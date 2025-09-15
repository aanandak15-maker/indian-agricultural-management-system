#!/usr/bin/env node

/**
 * QGIS Command-Line Processor for Indian Agricultural Data
 * 
 * This script automates QGIS processing for field boundary validation,
 * area calculations, and data export for the web application.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class QGISProcessor {
  constructor() {
    this.qgisPath = this.findQGISPath();
    this.processPath = path.join(this.qgisPath, 'qgis_process');
    this.tempDir = path.join(__dirname, '../temp');
    this.outputDir = path.join(__dirname, '../exports');
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  findQGISPath() {
    const possiblePaths = [
      '/Applications/QGIS.app/Contents/MacOS/bin', // macOS
      '/usr/bin', // Linux
      'C:\\Program Files\\QGIS 3.36\\bin', // Windows
      'C:\\Program Files\\QGIS 3.34\\bin', // Windows (older)
    ];

    for (const qgisPath of possiblePaths) {
      if (fs.existsSync(path.join(qgisPath, 'qgis_process'))) {
        console.log(`✅ Found QGIS at: ${qgisPath}`);
        return qgisPath;
      }
    }

    throw new Error('❌ QGIS not found. Please install QGIS and ensure qgis_process is in PATH.');
  }

  ensureDirectories() {
    [this.tempDir, this.outputDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  /**
   * Process field boundaries from Supabase data
   */
  async processFieldBoundaries(fieldData) {
    console.log('🔄 Processing field boundaries...');
    
    const inputFile = path.join(this.tempDir, 'fields_input.geojson');
    const outputFile = path.join(this.outputDir, 'fields_processed.geojson');
    
    // Write input data
    fs.writeFileSync(inputFile, JSON.stringify(fieldData, null, 2));
    
    try {
      // Run QGIS processing
      const command = `${this.processPath} run native:buffer --INPUT="${inputFile}" --DISTANCE=0.0001 --SEGMENTS=5 --END_CAP_STYLE=0 --JOIN_STYLE=0 --MITER_LIMIT=2 --DISSOLVE=false --OUTPUT="${outputFile}"`;
      
      execSync(command, { stdio: 'inherit' });
      
      // Read processed data
      const processedData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      
      console.log(`✅ Processed ${processedData.features.length} field boundaries`);
      return processedData;
      
    } catch (error) {
      console.error('❌ Error processing field boundaries:', error.message);
      throw error;
    }
  }

  /**
   * Calculate field areas and validate boundaries
   */
  async calculateFieldAreas(fieldData) {
    console.log('📐 Calculating field areas...');
    
    const inputFile = path.join(this.tempDir, 'fields_area.geojson');
    const outputFile = path.join(this.outputDir, 'fields_with_areas.geojson');
    
    fs.writeFileSync(inputFile, JSON.stringify(fieldData, null, 2));
    
    try {
      // Add area calculation
      const command = `${this.processPath} run native:fieldcalculator --INPUT="${inputFile}" --FIELD_NAME="area_hectares" --FIELD_TYPE=0 --FIELD_LENGTH=10 --FIELD_PRECISION=2 --FORMULA="$area / 10000" --OUTPUT="${outputFile}"`;
      
      execSync(command, { stdio: 'inherit' });
      
      const result = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      
      console.log(`✅ Calculated areas for ${result.features.length} fields`);
      return result;
      
    } catch (error) {
      console.error('❌ Error calculating areas:', error.message);
      throw error;
    }
  }

  /**
   * Generate MBTiles for offline use
   */
  async generateMBTiles(centerLat, centerLng, zoomLevels = '10-16') {
    console.log('🗺️ Generating MBTiles for offline use...');
    
    const outputFile = path.join(this.outputDir, 'agricultural_tiles.mbtiles');
    
    try {
      // Use QGIS to generate tiles
      const command = `${this.processPath} run native:package --LAYERS="OpenStreetMap" --OUTPUT="${outputFile}" --EXTENT="${centerLng-0.1},${centerLat-0.1},${centerLng+0.1},${centerLat+0.1}" --ZOOM_LEVELS="${zoomLevels}"`;
      
      execSync(command, { stdio: 'inherit' });
      
      console.log(`✅ Generated MBTiles: ${outputFile}`);
      return outputFile;
      
    } catch (error) {
      console.error('❌ Error generating MBTiles:', error.message);
      throw error;
    }
  }

  /**
   * Validate field boundaries against Indian agricultural data
   */
  async validateFieldBoundaries(fieldData) {
    console.log('✅ Validating field boundaries...');
    
    const inputFile = path.join(this.tempDir, 'fields_validate.geojson');
    const outputFile = path.join(this.outputDir, 'fields_validated.geojson');
    
    fs.writeFileSync(inputFile, JSON.stringify(fieldData, null, 2));
    
    try {
      // Check for overlaps and invalid geometries
      const command = `${this.processPath} run native:checkvalidity --INPUT="${inputFile}" --METHOD=2 --IGNORE_RING_SELF_INTERSECTION=false --OUTPUT="${outputFile}"`;
      
      execSync(command, { stdio: 'inherit' });
      
      const result = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      
      console.log(`✅ Validated ${result.features.length} field boundaries`);
      return result;
      
    } catch (error) {
      console.error('❌ Error validating boundaries:', error.message);
      throw error;
    }
  }

  /**
   * Process weather data integration
   */
  async processWeatherData(fieldData, weatherData) {
    console.log('🌤️ Processing weather data integration...');
    
    const fieldsFile = path.join(this.tempDir, 'fields_weather.geojson');
    const weatherFile = path.join(this.tempDir, 'weather_data.geojson');
    const outputFile = path.join(this.outputDir, 'fields_with_weather.geojson');
    
    fs.writeFileSync(fieldsFile, JSON.stringify(fieldData, null, 2));
    fs.writeFileSync(weatherFile, JSON.stringify(weatherData, null, 2));
    
    try {
      // Spatial join with weather data
      const command = `${this.processPath} run native:joinattributesbylocation --INPUT="${fieldsFile}" --JOIN="${weatherFile}" --PREDICATE=0 --JOIN_FIELDS="rainfall,temperature" --METHOD=0 --DISCARD_NONMATCHING=false --PREFIX="" --OUTPUT="${outputFile}"`;
      
      execSync(command, { stdio: 'inherit' });
      
      const result = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      
      console.log(`✅ Integrated weather data for ${result.features.length} fields`);
      return result;
      
    } catch (error) {
      console.error('❌ Error processing weather data:', error.message);
      throw error;
    }
  }

  /**
   * Export data for web use
   */
  async exportForWeb(data, format = 'geojson') {
    console.log(`📤 Exporting data for web use (${format})...`);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(this.outputDir, `web_export_${timestamp}.${format}`);
    
    if (format === 'geojson') {
      fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    } else if (format === 'csv') {
      // Convert GeoJSON to CSV
      const csvData = this.geojsonToCSV(data);
      fs.writeFileSync(outputFile, csvData);
    }
    
    console.log(`✅ Exported data: ${outputFile}`);
    return outputFile;
  }

  geojsonToCSV(geojson) {
    const features = geojson.features || [];
    if (features.length === 0) return '';
    
    const headers = ['id', 'name', 'area_hectares', 'crop_type', 'soil_type', 'latitude', 'longitude'];
    const rows = features.map(feature => {
      const props = feature.properties || {};
      const coords = feature.geometry?.coordinates?.[0]?.[0] || [0, 0];
      
      return [
        props.id || '',
        props.name || '',
        props.area_hectares || 0,
        props.crop_type || '',
        props.soil_type || '',
        coords[1] || 0,
        coords[0] || 0
      ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Clean up temporary files
   */
  cleanup() {
    console.log('🧹 Cleaning up temporary files...');
    
    if (fs.existsSync(this.tempDir)) {
      const files = fs.readdirSync(this.tempDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(this.tempDir, file));
      });
    }
    
    console.log('✅ Cleanup completed');
  }
}

// CLI usage
if (require.main === module) {
  const processor = new QGISProcessor();
  
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  switch (command) {
    case 'process-fields':
      // Example usage
      const sampleData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { id: 1, name: 'Field 1', crop_type: 'Wheat' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[78.9629, 20.5937], [78.9639, 20.5937], [78.9639, 20.5947], [78.9629, 20.5947], [78.9629, 20.5937]]]
            }
          }
        ]
      };
      
      processor.processFieldBoundaries(sampleData)
        .then(result => {
          console.log('✅ Processing completed');
          processor.cleanup();
        })
        .catch(error => {
          console.error('❌ Processing failed:', error);
          process.exit(1);
        });
      break;
      
    case 'generate-tiles':
      processor.generateMBTiles(20.5937, 78.9629)
        .then(() => {
          console.log('✅ Tile generation completed');
        })
        .catch(error => {
          console.error('❌ Tile generation failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log(`
🗺️ QGIS Processor for Indian Agricultural Data

Usage:
  node qgis-processor.js <command> [args]

Commands:
  process-fields    Process field boundaries
  generate-tiles    Generate MBTiles for offline use
  validate          Validate field boundaries
  weather           Process weather data integration

Examples:
  node qgis-processor.js process-fields
  node qgis-processor.js generate-tiles
      `);
  }
}

module.exports = QGISProcessor;
