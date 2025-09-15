import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Layers, 
  Satellite, 
  Mountain, 
  CloudRain,
  Crop,
  Download,
  Eye,
  EyeOff,
  Ruler
} from 'lucide-react';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Coordinates {
  lat: number;
  lng: number;
}

interface FieldBoundary {
  id: string;
  name: string;
  coordinates: number[][];
  area: number; // in hectares
  cropType?: string;
  soilType?: string;
}

interface LeafletParcelMapProps {
  coordinates: Coordinates;
  parcelName: string;
  isEditing: boolean;
  onCoordinatesChange?: (coordinates: Coordinates) => void;
  onFieldCreated?: (field: FieldBoundary) => void;
  existingFields?: FieldBoundary[];
}

// Map layer configuration
const MAP_LAYERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    icon: Layers
  },
  satellite: {
    name: 'Satellite (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
    icon: Satellite
  },
  topographic: {
    name: 'Topographic',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap',
    icon: Mountain
  }
};

// Component to add measurement controls
const MeasurementControl = () => {
  const map = useMap();
  
  useEffect(() => {
    // Simple measurement control
    const measureControl = L.control({ position: 'topright' });
    
    measureControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'leaflet-control-measure');
      div.innerHTML = `
        <button class="measure-btn" title="Measure Distance/Area">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3l18 18M9 9l6 6M15 9l-6 6"/>
          </svg>
        </button>
      `;
      
      div.style.cssText = `
        background: white;
        border: 2px solid rgba(0,0,0,0.2);
        border-radius: 4px;
        cursor: pointer;
        padding: 4px;
      `;
      
      div.onclick = () => {
        alert('Measurement tool - Click and drag to measure distance/area');
      };
      
      return div;
    };
    
    measureControl.addTo(map);
  }, [map]);
  
  return null;
};

// Component to add layer controls
const LayerControl = ({ onLayerChange }: { onLayerChange: (layer: string) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    const layerControl = L.control.layers(
      {
        'OpenStreetMap': L.tileLayer(MAP_LAYERS.osm.url, {
          attribution: MAP_LAYERS.osm.attribution
        }),
        'Satellite': L.tileLayer(MAP_LAYERS.satellite.url, {
          attribution: MAP_LAYERS.satellite.attribution
        }),
        'Topographic': L.tileLayer(MAP_LAYERS.topographic.url, {
          attribution: MAP_LAYERS.topographic.attribution
        })
      },
      {},
      { position: 'topleft' }
    ).addTo(map);
    
    // Listen for layer changes
    map.on('baselayerchange', (e) => {
      onLayerChange(e.name);
    });
    
    return () => {
      map.removeControl(layerControl);
    };
  }, [map, onLayerChange]);
  
  return null;
};

const LeafletParcelMap: React.FC<LeafletParcelMapProps> = ({
  coordinates,
  parcelName,
  isEditing,
  onCoordinatesChange,
  onFieldCreated,
  existingFields = []
}) => {
  const [activeLayer, setActiveLayer] = useState('OpenStreetMap');
  const [showWeather, setShowWeather] = useState(false);
  const [showFields, setShowFields] = useState(true);
  const [drawnFields, setDrawnFields] = useState<FieldBoundary[]>(existingFields);
  const mapRef = useRef<L.Map>(null);

  // Convert field boundaries to GeoJSON
  const fieldsToGeoJSON = () => {
    return {
      type: 'FeatureCollection',
      features: drawnFields.map(field => ({
        type: 'Feature',
        properties: {
          id: field.id,
          name: field.name,
          area: field.area,
          cropType: field.cropType,
          soilType: field.soilType
        },
        geometry: {
          type: 'Polygon',
          coordinates: [field.coordinates]
        }
      }))
    };
  };

  // Export field data
  const exportFieldData = () => {
    const dataStr = JSON.stringify(fieldsToGeoJSON(), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${parcelName}_fields.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Add sample field for demonstration
  const addSampleField = () => {
    const sampleField: FieldBoundary = {
      id: `field_${Date.now()}`,
      name: `Sample Field ${drawnFields.length + 1}`,
      coordinates: [
        [coordinates.lat + 0.001, coordinates.lng + 0.001],
        [coordinates.lat + 0.001, coordinates.lng - 0.001],
        [coordinates.lat - 0.001, coordinates.lng - 0.001],
        [coordinates.lat - 0.001, coordinates.lng + 0.001],
        [coordinates.lat + 0.001, coordinates.lng + 0.001]
      ],
      area: 2.5,
      cropType: 'Wheat',
      soilType: 'Loamy'
    };
    
    setDrawnFields(prev => [...prev, sampleField]);
    onFieldCreated?.(sampleField);
  };

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Enhanced Field Mapping with Leaflet + OSM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="layers" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="layers" className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="fields" className="flex items-center gap-1">
                <Crop className="h-4 w-4" />
                Fields
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="layers" className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant={activeLayer === 'OpenStreetMap' ? 'default' : 'outline'}>
                  <Layers className="h-3 w-3 mr-1" />
                  OSM Base
                </Badge>
                <Badge variant={activeLayer === 'Satellite' ? 'default' : 'outline'}>
                  <Satellite className="h-3 w-3 mr-1" />
                  Satellite
                </Badge>
                <Badge variant={activeLayer === 'Topographic' ? 'default' : 'outline'}>
                  <Mountain className="h-3 w-3 mr-1" />
                  Topo
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Free and open-source mapping with excellent coverage in India
              </p>
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showWeather ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowWeather(!showWeather)}
                >
                  <CloudRain className="h-4 w-4 mr-1" />
                  Weather
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Ruler className="h-4 w-4 mr-1" />
                  Measure
                </Button>
                <Button variant="outline" size="sm" onClick={addSampleField}>
                  <Crop className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Measurement tools and field drawing capabilities
              </p>
            </TabsContent>
            
            <TabsContent value="fields" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Fields: {drawnFields.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFields(!showFields)}
                >
                  {showFields ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {drawnFields.map(field => (
                <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{field.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {field.area.toFixed(2)} ha • {field.cropType}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="export" className="space-y-2">
              <Button onClick={exportFieldData} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Field Data (GeoJSON)
              </Button>
              <p className="text-sm text-muted-foreground">
                Export field boundaries and data for analysis
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden border">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <LayerControl onLayerChange={setActiveLayer} />
          <MeasurementControl />
          
          {/* Base Layer */}
          <TileLayer
            url={MAP_LAYERS.osm.url}
            attribution={MAP_LAYERS.osm.attribution}
          />
          
          {/* Parcel Marker */}
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div>
                <h3 className="font-bold">{parcelName}</h3>
                <p>Lat: {coordinates.lat.toFixed(6)}</p>
                <p>Lng: {coordinates.lng.toFixed(6)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click marker to edit location
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      {/* Map Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Active Layer: {activeLayer}</span>
        <span>Fields: {drawnFields.length} • Total Area: {drawnFields.reduce((sum, field) => sum + field.area, 0).toFixed(2)} ha</span>
      </div>
      
      {/* Features Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">🇮🇳 India-Optimized</h4>
              <p className="text-muted-foreground">
                Excellent coverage for Indian rural areas, villages, and agricultural landmarks
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">💰 Completely Free</h4>
              <p className="text-muted-foreground">
                No API keys, no billing, no usage limits. Open-source and community-driven
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🚀 High Performance</h4>
              <p className="text-muted-foreground">
                Lightweight, mobile-friendly, and highly customizable for agricultural use
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeafletParcelMap;
