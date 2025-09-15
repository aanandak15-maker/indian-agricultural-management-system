import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Layers, 
  Ruler, 
  Edit3, 
  Satellite, 
  Mountain, 
  CloudRain,
  Crop,
  Download,
  Eye,
  EyeOff
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

interface EnhancedParcelMapProps {
  coordinates: Coordinates;
  parcelName: string;
  isEditing: boolean;
  onCoordinatesChange?: (coordinates: Coordinates) => void;
  onFieldCreated?: (field: FieldBoundary) => void;
  existingFields?: FieldBoundary[];
}

// Component to add measurement controls
const MeasurementControl = () => {
  const map = useMap();
  
  useEffect(() => {
    // Import leaflet-measure dynamically
    import('leaflet-measure').then((module) => {
      const measureControl = new module.default({
        position: 'topright',
        primaryLengthUnit: 'meters',
        secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'hectares',
        secondaryAreaUnit: 'acres',
        activeColor: '#4CAF50',
        completedColor: '#4CAF50',
        popupOptions: {
          className: 'leaflet-measure-resultpopup',
          autoPanPadding: [10, 10]
        }
      });
      
      measureControl.addTo(map);
    });
  }, [map]);
  
  return null;
};

// Component to add layer controls
const LayerControl = ({ onLayerChange }: { onLayerChange: (layer: string) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    const layerControl = L.control.layers(
      {
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }),
        'Bhuvan Satellite': L.tileLayer('https://bhuvan-app1.nrsc.gov.in/bhuvan/wms?service=WMS&request=GetMap&layers=NRSC_LULC_50K&styles=&format=image/png&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG:3857&bbox={bbox-epsg-3857}', {
          attribution: '© ISRO/Bhuvan'
        }),
        'Bhuvan Topographic': L.tileLayer('https://bhuvan-app1.nrsc.gov.in/bhuvan/wms?service=WMS&request=GetMap&layers=NRSC_TOPO_50K&styles=&format=image/png&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG:3857&bbox={bbox-epsg-3857}', {
          attribution: '© ISRO/Bhuvan'
        }),
        'Sentinel-2 NDVI': L.tileLayer('https://services.sentinel-hub.com/ogc/wms/your-instance-id?service=WMS&request=GetMap&layers=NDVI&styles=&format=image/png&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG:3857&bbox={bbox-epsg-3857}', {
          attribution: '© ESA/Sentinel Hub'
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

// Weather overlay component
const WeatherOverlay = ({ showWeather }: { showWeather: boolean }) => {
  const map = useMap();
  
  useEffect(() => {
    if (showWeather) {
      // IMD Weather layer (example - you'll need to get actual WMS endpoint)
      const weatherLayer = L.tileLayer('https://bhuvan-app1.nrsc.gov.in/bhuvan/wms?service=WMS&request=GetMap&layers=IMD_RAINFALL&styles=&format=image/png&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG:3857&bbox={bbox-epsg-3857}', {
        attribution: '© IMD/Bhuvan',
        opacity: 0.6
      });
      
      weatherLayer.addTo(map);
      
      return () => {
        map.removeLayer(weatherLayer);
      };
    }
  }, [map, showWeather]);
  
  return null;
};

const EnhancedParcelMap: React.FC<EnhancedParcelMapProps> = ({
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
  const [measurementResults, setMeasurementResults] = useState<any[]>([]);
  const mapRef = useRef<L.Map>(null);

  // Handle field creation from drawing
  const handleFieldCreated = (e: any) => {
    const { layer } = e;
    const bounds = layer.getBounds();
    const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    const areaHectares = area / 10000; // Convert to hectares
    
    const newField: FieldBoundary = {
      id: `field_${Date.now()}`,
      name: `Field ${drawnFields.length + 1}`,
      coordinates: layer.getLatLngs()[0].map((latlng: L.LatLng) => [latlng.lat, latlng.lng]),
      area: areaHectares,
      cropType: 'Unknown',
      soilType: 'Unknown'
    };
    
    setDrawnFields(prev => [...prev, newField]);
    onFieldCreated?.(newField);
  };

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

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Enhanced Field Mapping
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
                  <Eye className="h-3 w-3 mr-1" />
                  OSM Base
                </Badge>
                <Badge variant={activeLayer === 'Bhuvan Satellite' ? 'default' : 'outline'}>
                  <Satellite className="h-3 w-3 mr-1" />
                  Satellite
                </Badge>
                <Badge variant={activeLayer === 'Bhuvan Topographic' ? 'default' : 'outline'}>
                  <Mountain className="h-3 w-3 mr-1" />
                  Topo
                </Badge>
                <Badge variant={activeLayer === 'Sentinel-2 NDVI' ? 'default' : 'outline'}>
                  <Crop className="h-3 w-3 mr-1" />
                  NDVI
                </Badge>
              </div>
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
                <Button variant="outline" size="sm" disabled>
                  <Edit3 className="h-4 w-4 mr-1" />
                  Draw
                </Button>
              </div>
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
          <WeatherOverlay showWeather={showWeather} />
          
          {/* Base Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          
          {/* Field Drawing */}
          {isEditing && (
            <FeatureGroup>
              <EditControl
                position="topright"
                onCreated={handleFieldCreated}
                draw={{
                  rectangle: true,
                  polygon: true,
                  circle: false,
                  marker: false,
                  circlemarker: false,
                  polyline: false
                }}
                edit={{
                  edit: true,
                  remove: true
                }}
              />
            </FeatureGroup>
          )}
          
          {/* Existing Fields */}
          {showFields && drawnFields.length > 0 && (
            <GeoJSON
              data={fieldsToGeoJSON()}
              style={(feature) => ({
                color: '#4CAF50',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.3
              })}
              onEachFeature={(feature, layer) => {
                const props = feature.properties;
                layer.bindPopup(`
                  <div>
                    <h3>${props.name}</h3>
                    <p><strong>Area:</strong> ${props.area.toFixed(2)} hectares</p>
                    <p><strong>Crop:</strong> ${props.cropType}</p>
                    <p><strong>Soil:</strong> ${props.soilType}</p>
                  </div>
                `);
              }}
            />
          )}
          
          {/* Parcel Marker */}
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div>
                <h3 className="font-bold">{parcelName}</h3>
                <p>Lat: {coordinates.lat.toFixed(6)}</p>
                <p>Lng: {coordinates.lng.toFixed(6)}</p>
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
    </div>
  );
};

export default EnhancedParcelMap;
