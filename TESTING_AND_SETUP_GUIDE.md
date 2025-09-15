# 🧪 Testing and Setup Guide - QGIS + Leaflet Integration

## 🎯 **Current Status: ✅ READY TO TEST**

Your agricultural management system is running at **http://localhost:8081** with enhanced mapping capabilities!

## 📋 **Step-by-Step Testing Guide**

### **Step 1: Test Current Setup (Right Now!)**

#### **🌐 Open Your Application**
1. **Open your browser** and go to: **http://localhost:8081**
2. **Sign up** for a new account or **log in** if you already have one
3. **Navigate to the Fields page** to test the new mapping features

#### **🗺️ Test Enhanced Mapping Features**
1. **Click "Map View"** button on the Fields page
2. **Try the new features:**
   - **Layer switching** - Switch between OSM, Satellite, and Topographic maps
   - **Add sample fields** - Click "Add Field" to create test field boundaries
   - **Export data** - Try exporting field data as GeoJSON
   - **Weather overlay** - Toggle IMD weather data display

#### **🔍 What to Look For:**
- ✅ **Real map display** (not placeholder)
- ✅ **Interactive controls** (zoom, pan, layer switching)
- ✅ **Field management** (add, view, export fields)
- ✅ **Weather data** (temperature, humidity, rainfall)
- ✅ **Professional UI** with tabs and controls

### **Step 2: Install QGIS (For Full Processing)**

#### **🍎 macOS Installation**
```bash
# Option 1: Using Homebrew (Recommended)
brew install qgis

# Option 2: Download from website
# Go to https://qgis.org/ and download the macOS installer
```

#### **🐧 Linux Installation**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install qgis

# CentOS/RHEL
sudo yum install qgis
```

#### **🪟 Windows Installation**
1. **Download QGIS** from https://qgis.org/
2. **Run the installer** and follow the setup wizard
3. **Add QGIS to PATH** during installation

#### **✅ Verify QGIS Installation**
```bash
# Check if QGIS is installed
qgis --version

# Check if qgis_process is available
qgis_process --help
```

### **Step 3: Run QGIS Setup Script**

#### **🚀 Execute the Setup**
```bash
# Navigate to your project directory
cd /Users/anand/Documents/kiro\ hackathon\ devpost/agri-dom-7930

# Run the QGIS setup script
./qgis-setup/setup.sh
```

#### **📁 What the Setup Creates:**
- **QGIS project file** (`indian-agricultural-mapping.qgs`)
- **Processing scripts** (`qgis-processor.js`)
- **API configuration** (with your tokens)
- **Plugin configurations** (Indian data sources)
- **Example workflows** (ready to use)

### **Step 4: Test QGIS Processing**

#### **🔧 Test the Processing Script**
```bash
# Navigate to scripts directory
cd qgis-setup/scripts

# Install Node.js dependencies
npm install

# Test field processing
node qgis-processor.js process-fields

# Test tile generation
node qgis-processor.js generate-tiles
```

#### **🗺️ Open QGIS Project**
```bash
# Open the configured QGIS project
qgis qgis-setup/indian-agricultural-mapping.qgs
```

### **Step 5: Process Real Field Data**

#### **📊 Sample Data Processing**
```bash
# Process sample field boundaries
node qgis-setup/scripts/qgis-processor.js process-fields

# Calculate field areas
node qgis-setup/scripts/qgis-processor.js calculate-areas

# Validate field boundaries
node qgis-setup/scripts/qgis-processor.js validate

# Generate offline tiles
node qgis-setup/scripts/qgis-processor.js generate-tiles
```

#### **🌾 Real Agricultural Data**
1. **Import your field data** into QGIS
2. **Run spatial analysis** (area calculations, soil analysis)
3. **Export processed data** for web use
4. **Generate offline tiles** for rural areas

### **Step 6: Export Data for Analysis**

#### **📤 Export Options**
```bash
# Export as GeoJSON for web use
node qgis-setup/scripts/qgis-processor.js export-web

# Export as CSV for analysis
node qgis-setup/scripts/qgis-processor.js export-csv

# Generate MBTiles for offline use
node qgis-setup/scripts/qgis-processor.js generate-tiles
```

#### **📈 Data Analysis Workflow**
1. **Process in QGIS** - Professional spatial analysis
2. **Export to web** - GeoJSON for your React app
3. **Generate reports** - PDF/Excel exports
4. **Create visualizations** - Charts and maps

## 🎯 **Testing Checklist**

### **✅ Web Application (Current)**
- [ ] Application loads at http://localhost:8081
- [ ] Authentication works (signup/login)
- [ ] Fields page displays correctly
- [ ] Map view shows real Leaflet maps
- [ ] Layer switching works (OSM, Satellite, Topo)
- [ ] Field creation and management works
- [ ] Weather data displays (IMD integration)
- [ ] Export functionality works (GeoJSON)

### **✅ QGIS Integration (After Installation)**
- [ ] QGIS installs successfully
- [ ] Setup script runs without errors
- [ ] QGIS project opens correctly
- [ ] Processing scripts work
- [ ] Indian data sources connect
- [ ] Field validation works
- [ ] Area calculations are accurate
- [ ] Export functions work

### **✅ Data Processing (Full Workflow)**
- [ ] Import field boundaries
- [ ] Validate geometries
- [ ] Calculate areas and perimeters
- [ ] Integrate weather data
- [ ] Generate offline tiles
- [ ] Export for web use
- [ ] Create analysis reports

## 🚨 **Troubleshooting**

### **Common Issues and Solutions**

#### **❌ QGIS Not Found**
```bash
# Check if QGIS is in PATH
which qgis
which qgis_process

# Add QGIS to PATH (if needed)
export PATH="/Applications/QGIS.app/Contents/MacOS/bin:$PATH"
```

#### **❌ API Keys Not Working**
- **Check your tokens** in `qgis-setup/data-sources/api-config.js`
- **Verify API endpoints** are accessible
- **Test with curl** to confirm connectivity

#### **❌ Processing Scripts Fail**
```bash
# Check Node.js version
node --version

# Install dependencies
cd qgis-setup/scripts
npm install

# Check file permissions
chmod +x qgis-setup/scripts/qgis-processor.js
```

#### **❌ Map Not Loading**
- **Check browser console** for JavaScript errors
- **Verify Leaflet dependencies** are installed
- **Clear browser cache** and reload

## 🎉 **Success Indicators**

### **✅ You'll Know It's Working When:**
1. **Web app loads** with real interactive maps
2. **Weather data displays** from IMD APIs
3. **Field boundaries** can be created and exported
4. **QGIS processes** field data successfully
5. **Offline tiles** generate for rural areas
6. **Professional analysis** tools are available

## 📞 **Need Help?**

### **🔍 Debug Steps:**
1. **Check the browser console** for errors
2. **Verify all dependencies** are installed
3. **Test API connectivity** with curl
4. **Check file permissions** on scripts
5. **Review the logs** in terminal

### **📚 Resources:**
- **QGIS Documentation**: https://docs.qgis.org/
- **Leaflet Documentation**: https://leafletjs.com/
- **React-Leaflet Guide**: https://react-leaflet.js.org/
- **Bhuvan Portal**: https://bhuvan.nrsc.gov.in/
- **IMD Weather API**: https://mausam.imd.gov.in/

## 🚀 **Next Steps After Testing**

1. **Process your real field data** with QGIS
2. **Integrate with Supabase** database
3. **Deploy to production** with offline capabilities
4. **Add more Indian data sources** as needed
5. **Scale for multiple users** and large datasets

**Your agricultural management system is now ready for professional GIS operations!** 🌱

---

## 🎯 **Quick Start Commands**

```bash
# Test current setup
open http://localhost:8081

# Install QGIS (macOS)
brew install qgis

# Run setup
./qgis-setup/setup.sh

# Test processing
cd qgis-setup/scripts && node qgis-processor.js process-fields

# Open QGIS project
qgis qgis-setup/indian-agricultural-mapping.qgs
```

**Ready to test? Let's go!** 🚀
