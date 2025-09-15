/**
 * API Configuration for Indian Agricultural Data Sources
 * 
 * This file contains the API keys and endpoints for:
 * - Bhuvan ISRO (Indian Space Research Organisation)
 * - IMD (Indian Meteorological Department)
 * - Other Indian agricultural data sources
 */

const API_CONFIG = {
  // Bhuvan ISRO Configuration
  bhuvan: {
    baseUrl: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
    token: '10f02004b82aca206bf8c04a059c169524df54f0', // Your provided token
    layers: {
      satellite: 'NRSC_LULC_50K',
      topographic: 'NRSC_TOPO_50K',
      dem: 'NRSC_DEM_30M',
      landUse: 'NRSC_LULC_50K',
      soil: 'SOIL_MAP_INDIA',
      irrigation: 'IRRIGATION_MAP'
    },
    endpoints: {
      wms: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wms',
      wfs: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/wfs',
      rest: 'https://bhuvan-app1.nrsc.gov.in/bhuvan/rest'
    }
  },

  // IMD (Indian Meteorological Department) Configuration
  imd: {
    baseUrl: 'https://mausam.imd.gov.in/',
    apiKey: 'sk-live-Q4vJkX7laGTNqYDVNA9miPwI8DvK7YGpifrHq9PT', // Your provided key
    endpoints: {
      weather: 'https://mausam.imd.gov.in/api/weather',
      rainfall: 'https://mausam.imd.gov.in/api/rainfall',
      temperature: 'https://mausam.imd.gov.in/api/temperature',
      forecast: 'https://mausam.imd.gov.in/api/forecast'
    },
    dataTypes: {
      current: 'current_weather',
      forecast: 'weather_forecast',
      rainfall: 'rainfall_data',
      temperature: 'temperature_data'
    }
  },

  // ICAR (Indian Council of Agricultural Research) Configuration
  icar: {
    baseUrl: 'https://data.icar.gov.in/',
    endpoints: {
      soil: 'https://data.icar.gov.in/api/soil',
      crops: 'https://data.icar.gov.in/api/crops',
      research: 'https://data.icar.gov.in/api/research'
    }
  },

  // Data.gov.in Configuration
  dataGov: {
    baseUrl: 'https://data.gov.in/',
    endpoints: {
      agriculture: 'https://data.gov.in/api/agriculture',
      weather: 'https://data.gov.in/api/weather',
      soil: 'https://data.gov.in/api/soil'
    }
  },

  // Sentinel Hub Configuration (ESA)
  sentinel: {
    baseUrl: 'https://services.sentinel-hub.com/ogc/wms',
    instanceId: 'your-instance-id', // Replace with your Sentinel Hub instance ID
    layers: {
      ndvi: 'NDVI',
      rgb: 'RGB',
      nir: 'NIR'
    }
  }
};

/**
 * Generate WMS URL for Bhuvan layers
 */
function generateBhuvanWMSUrl(layer, bbox, width = 256, height = 256) {
  const params = new URLSearchParams({
    service: 'WMS',
    request: 'GetMap',
    layers: API_CONFIG.bhuvan.layers[layer] || layer,
    styles: '',
    format: 'image/png',
    transparent: 'true',
    version: '1.1.1',
    width: width.toString(),
    height: height.toString(),
    srs: 'EPSG:3857',
    bbox: bbox,
    token: API_CONFIG.bhuvan.token
  });
  
  return `${API_CONFIG.bhuvan.endpoints.wms}?${params.toString()}`;
}

/**
 * Generate IMD weather API URL
 */
function generateIMDWeatherUrl(endpoint, params = {}) {
  const url = new URL(API_CONFIG.imd.endpoints[endpoint]);
  url.searchParams.append('api_key', API_CONFIG.imd.apiKey);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
}

/**
 * Get weather data for a specific location
 */
async function getWeatherData(latitude, longitude) {
  try {
    const url = generateIMDWeatherUrl('weather', {
      lat: latitude,
      lon: longitude,
      format: 'json'
    });
    
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      temperature: data.temperature,
      humidity: data.humidity,
      rainfall: data.rainfall,
      windSpeed: data.wind_speed,
      windDirection: data.wind_direction,
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Get rainfall data for agricultural planning
 */
async function getRainfallData(latitude, longitude, days = 7) {
  try {
    const url = generateIMDWeatherUrl('rainfall', {
      lat: latitude,
      lon: longitude,
      days: days,
      format: 'json'
    });
    
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      totalRainfall: data.total_rainfall,
      dailyRainfall: data.daily_rainfall,
      averageRainfall: data.average_rainfall,
      period: `${days} days`
    };
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    throw error;
  }
}

/**
 * Get soil data for agricultural planning
 */
async function getSoilData(latitude, longitude) {
  try {
    const url = generateBhuvanWMSUrl('soil', `${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}`);
    
    // For soil data, we might need to use a different approach
    // This is a placeholder for the actual implementation
    return {
      soilType: 'Loamy',
      ph: 6.5,
      organicMatter: 2.1,
      nitrogen: 0.8,
      phosphorus: 0.3,
      potassium: 1.2
    };
  } catch (error) {
    console.error('Error fetching soil data:', error);
    throw error;
  }
}

/**
 * Get crop calendar data
 */
async function getCropCalendar(cropType, region) {
  try {
    // This would typically come from ICAR or agricultural databases
    const cropCalendars = {
      'Wheat': {
        planting: 'October-November',
        harvesting: 'March-April',
        duration: '120-150 days',
        waterRequirement: '400-500mm'
      },
      'Rice': {
        planting: 'June-July',
        harvesting: 'October-November',
        duration: '120-150 days',
        waterRequirement: '1000-1500mm'
      },
      'Cotton': {
        planting: 'April-May',
        harvesting: 'October-December',
        duration: '180-200 days',
        waterRequirement: '600-800mm'
      },
      'Sugarcane': {
        planting: 'October-November',
        harvesting: 'October-December (next year)',
        duration: '12-18 months',
        waterRequirement: '1500-2000mm'
      }
    };
    
    return cropCalendars[cropType] || null;
  } catch (error) {
    console.error('Error fetching crop calendar:', error);
    throw error;
  }
}

/**
 * Validate API configuration
 */
function validateConfig() {
  const errors = [];
  
  if (!API_CONFIG.bhuvan.token) {
    errors.push('Bhuvan token is missing');
  }
  
  if (!API_CONFIG.imd.apiKey) {
    errors.push('IMD API key is missing');
  }
  
  if (errors.length > 0) {
    console.warn('⚠️ API Configuration Issues:', errors);
    return false;
  }
  
  console.log('✅ API Configuration is valid');
  return true;
}

module.exports = {
  API_CONFIG,
  generateBhuvanWMSUrl,
  generateIMDWeatherUrl,
  getWeatherData,
  getRainfallData,
  getSoilData,
  getCropCalendar,
  validateConfig
};
