// Indian Map Data Sources Configuration
// Free and open-source data sources for enhanced agricultural mapping in India

export interface MapLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  type: 'tile' | 'wms' | 'wmts';
  opacity?: number;
  visible?: boolean;
  category: 'base' | 'satellite' | 'topographic' | 'weather' | 'agricultural' | 'soil';
}

export interface WMSLayer extends MapLayer {
  type: 'wms';
  layers: string;
  format: string;
  version: string;
  srs: string;
}

// Base map layers
export const BASE_LAYERS: MapLayer[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    type: 'tile',
    category: 'base',
    visible: true
  },
  {
    id: 'osm-fr',
    name: 'OpenStreetMap France',
    url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap France',
    type: 'tile',
    category: 'base',
    visible: false
  }
];

// Bhuvan ISRO layers (Indian Space Research Organisation)
export const BHUVAN_LAYERS: WMSLayer[] = [
  {
    id: 'bhuvan-satellite',
    name: 'Bhuvan Satellite Imagery',
    url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    layers: 'NRSC_LULC_50K',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© ISRO/Bhuvan',
    type: 'wms',
    category: 'satellite',
    opacity: 0.8,
    visible: false
  },
  {
    id: 'bhuvan-topo',
    name: 'Bhuvan Topographic',
    url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    layers: 'NRSC_TOPO_50K',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© ISRO/Bhuvan',
    type: 'wms',
    category: 'topographic',
    opacity: 0.8,
    visible: false
  },
  {
    id: 'bhuvan-dem',
    name: 'Bhuvan Digital Elevation Model',
    url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    layers: 'NRSC_DEM_30M',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© ISRO/Bhuvan',
    type: 'wms',
    category: 'topographic',
    opacity: 0.6,
    visible: false
  }
];

// Weather and Climate layers
export const WEATHER_LAYERS: WMSLayer[] = [
  {
    id: 'imd-rainfall',
    name: 'IMD Rainfall Data',
    url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    layers: 'IMD_RAINFALL',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© IMD/Bhuvan',
    type: 'wms',
    category: 'weather',
    opacity: 0.6,
    visible: false
  },
  {
    id: 'imd-temperature',
    name: 'IMD Temperature',
    url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    layers: 'IMD_TEMPERATURE',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© IMD/Bhuvan',
    type: 'wms',
    category: 'weather',
    opacity: 0.6,
    visible: false
  }
];

// Agricultural and Soil layers
export const AGRICULTURAL_LAYERS: WMSLayer[] = [
  {
    id: 'soil-map',
    name: 'Soil Map of India',
    url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    layers: 'SOIL_MAP_INDIA',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© ICAR/Bhuvan',
    type: 'wms',
    category: 'soil',
    opacity: 0.7,
    visible: false
  },
  {
    id: 'crop-calendar',
    name: 'Crop Calendar',
    url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    layers: 'CROP_CALENDAR',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© ICAR/Bhuvan',
    type: 'wms',
    category: 'agricultural',
    opacity: 0.7,
    visible: false
  },
  {
    id: 'irrigation-map',
    name: 'Irrigation Map',
    url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    layers: 'IRRIGATION_MAP',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© ICAR/Bhuvan',
    type: 'wms',
    category: 'agricultural',
    opacity: 0.7,
    visible: false
  }
];

// Sentinel Hub layers (ESA - European Space Agency)
export const SENTINEL_LAYERS: WMSLayer[] = [
  {
    id: 'sentinel-ndvi',
    name: 'Sentinel-2 NDVI',
    url: 'https://services.sentinel-hub.com/ogc/wms/your-instance-id',
    layers: 'NDVI',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© ESA/Sentinel Hub',
    type: 'wms',
    category: 'agricultural',
    opacity: 0.8,
    visible: false
  },
  {
    id: 'sentinel-rgb',
    name: 'Sentinel-2 RGB',
    url: 'https://services.sentinel-hub.com/ogc/wms/your-instance-id',
    layers: 'RGB',
    format: 'image/png',
    version: '1.1.1',
    srs: 'EPSG:3857',
    attribution: '© ESA/Sentinel Hub',
    type: 'wms',
    category: 'satellite',
    opacity: 0.9,
    visible: false
  }
];

// All available layers
export const ALL_LAYERS = [
  ...BASE_LAYERS,
  ...BHUVAN_LAYERS,
  ...WEATHER_LAYERS,
  ...AGRICULTURAL_LAYERS,
  ...SENTINEL_LAYERS
];

// Default map settings for India
export const DEFAULT_MAP_SETTINGS = {
  center: [20.5937, 78.9629] as [number, number], // Center of India
  zoom: 6,
  minZoom: 4,
  maxZoom: 18,
  maxBounds: [
    [6.0, 68.0], // Southwest corner
    [37.0, 97.0]  // Northeast corner
  ] as [[number, number], [number, number]]
};

// Indian states and their approximate centers for quick navigation
export const INDIAN_STATES = {
  'Andhra Pradesh': [15.9129, 79.7400],
  'Arunachal Pradesh': [28.2180, 94.7278],
  'Assam': [26.2006, 92.9376],
  'Bihar': [25.0961, 85.3131],
  'Chhattisgarh': [21.2787, 81.8661],
  'Goa': [15.2993, 74.1240],
  'Gujarat': [23.0225, 72.5714],
  'Haryana': [29.0588, 76.0856],
  'Himachal Pradesh': [31.1048, 77.1734],
  'Jharkhand': [23.6102, 85.2799],
  'Karnataka': [15.3173, 75.7139],
  'Kerala': [10.8505, 76.2711],
  'Madhya Pradesh': [22.9734, 78.6569],
  'Maharashtra': [19.7515, 75.7139],
  'Manipur': [24.6637, 93.9063],
  'Meghalaya': [25.4670, 91.3662],
  'Mizoram': [23.1645, 92.9376],
  'Nagaland': [26.1584, 94.5624],
  'Odisha': [20.9517, 85.0985],
  'Punjab': [31.1471, 75.3412],
  'Rajasthan': [27.0238, 74.2179],
  'Sikkim': [27.5330, 88.5122],
  'Tamil Nadu': [11.1271, 78.6569],
  'Telangana': [18.1124, 79.0193],
  'Tripura': [23.9408, 91.9882],
  'Uttar Pradesh': [26.8467, 80.9462],
  'Uttarakhand': [30.0668, 79.0193],
  'West Bengal': [22.9868, 87.8550]
};

// Utility functions
export const getLayerById = (id: string): MapLayer | undefined => {
  return ALL_LAYERS.find(layer => layer.id === id);
};

export const getLayersByCategory = (category: string): MapLayer[] => {
  return ALL_LAYERS.filter(layer => layer.category === category);
};

export const getVisibleLayers = (): MapLayer[] => {
  return ALL_LAYERS.filter(layer => layer.visible);
};

// Generate WMS URL for a layer
export const generateWMSUrl = (layer: WMSLayer, bbox: string): string => {
  const params = new URLSearchParams({
    service: 'WMS',
    request: 'GetMap',
    layers: layer.layers,
    styles: '',
    format: layer.format,
    transparent: 'true',
    version: layer.version,
    width: '256',
    height: '256',
    srs: layer.srs,
    bbox: bbox
  });
  
  return `${layer.url}?${params.toString()}`;
};

// Indian agricultural zones
export const AGRICULTURAL_ZONES = {
  'Northern Plains': {
    center: [28.6139, 77.2090],
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar'],
    crops: ['Wheat', 'Rice', 'Sugarcane', 'Cotton']
  },
  'Western India': {
    center: [19.0760, 72.8777],
    states: ['Maharashtra', 'Gujarat', 'Rajasthan'],
    crops: ['Cotton', 'Sugarcane', 'Groundnut', 'Wheat']
  },
  'Southern India': {
    center: [12.9716, 77.5946],
    states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'],
    crops: ['Rice', 'Coconut', 'Spices', 'Coffee']
  },
  'Eastern India': {
    center: [22.5726, 88.3639],
    states: ['West Bengal', 'Odisha', 'Jharkhand'],
    crops: ['Rice', 'Jute', 'Tea', 'Sugarcane']
  },
  'Central India': {
    center: [23.2599, 77.4126],
    states: ['Madhya Pradesh', 'Chhattisgarh'],
    crops: ['Wheat', 'Rice', 'Soybean', 'Cotton']
  }
};
