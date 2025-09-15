# 🌾 Indian Agricultural Management System

> **Live Demo:** [https://agrisystem-git-main-aanandak15-makers-projects.vercel.app/](https://agrisystem-git-main-aanandak15-makers-projects.vercel.app/)

A comprehensive farm management platform designed specifically for Indian farmers, built with modern web technologies to streamline agricultural operations, track crop performance, and optimize farm productivity.

## 🚀 Features

### 🗺️ **Field Management**
- **Interactive Field Mapping**: Visual field management with Leaflet maps
- **Field Details Tracking**: Monitor soil type, irrigation systems, and field conditions
- **Crop History**: Track planting and harvest dates for each field
- **Weather Integration**: Real-time weather alerts and rainfall tracking
- **Indian Crop Support**: Specialized for Rice, Wheat, Cotton, Sugarcane, and other Indian crops

### 📊 **Crop Planning & Monitoring**
- **Crop Calendar**: Visual planning with planting and harvest schedules
- **Task Management**: Track field activities and maintenance tasks
- **Growth Monitoring**: Monitor crop development stages
- **Disease & Pest Tracking**: Record and manage crop health issues
- **Yield Prediction**: Data-driven yield forecasting

### 💰 **Financial Management**
- **Revenue Tracking**: Monitor harvest sales and government aid
- **Expense Management**: Track seeds, fertilizers, equipment, and labor costs
- **Profitability Analysis**: Visual charts showing field-wise profitability
- **Financial Reports**: Comprehensive financial summaries and insights
- **Budget Planning**: Plan and track agricultural budgets

### 📦 **Inventory Management**
- **Seed & Fertilizer Tracking**: Monitor stock levels and usage
- **Equipment Management**: Track farm equipment and maintenance
- **Supply Chain**: Manage suppliers and procurement
- **Stock Alerts**: Automated low-stock notifications
- **Import/Export**: CSV data import and export functionality

### 📈 **Analytics & Statistics**
- **Performance Dashboards**: Real-time farm performance metrics
- **Yield Analysis**: Historical yield data and trends
- **Environmental Charts**: Weather and soil condition analysis
- **Financial Analytics**: Revenue and expense trend analysis
- **Comparative Reports**: Field-wise performance comparisons

### 🌤️ **Weather & Environmental**
- **Weather Alerts**: Real-time weather warnings and advisories
- **Rainfall Tracking**: Monitor precipitation patterns
- **Soil Monitoring**: Track soil health and conditions
- **Climate Adaptation**: Weather-based farming recommendations

## 🛠️ Technology Stack

### **Frontend**
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and building
- **Tailwind CSS** for responsive and modern UI design
- **Framer Motion** for smooth animations and transitions
- **React Router** for seamless navigation

### **UI Components**
- **Radix UI** for accessible and customizable components
- **Shadcn/ui** for consistent design system
- **Lucide React** for beautiful icons
- **Recharts** for interactive data visualization

### **Maps & Visualization**
- **Leaflet** for interactive field mapping
- **React Leaflet** for React integration
- **Leaflet Draw** for field boundary creation
- **Custom Indian map integration** with state-wise crop data

### **Backend & Database**
- **Supabase** for backend-as-a-service
- **PostgreSQL** for robust data storage
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live data updates

### **Data Management**
- **React Query** for efficient data fetching and caching
- **Papa Parse** for CSV data processing
- **Date-fns** for date manipulation
- **Zod** for data validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aanandak15-maker/indian-agricultural-management-system.git
   cd indian-agricultural-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   Add your Supabase credentials to `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   ```bash
   # Run the complete database setup
   psql -h your_db_host -U your_username -d your_database -f complete-setup.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   Navigate to `http://localhost:5173`

## 📱 Usage

### **Getting Started**
1. **Sign Up/Login**: Create your account or login to access the platform
2. **Add Fields**: Create and map your agricultural fields
3. **Plan Crops**: Set up crop rotations and planting schedules
4. **Track Activities**: Log daily farming activities and tasks
5. **Monitor Progress**: Use dashboards to track performance
6. **Generate Reports**: Export data for analysis and record-keeping

### **Key Workflows**

#### **Field Setup**
- Click "Add Field" to create new agricultural fields
- Use the map interface to draw field boundaries
- Add field details: soil type, irrigation, area, etc.
- Set up crop rotation schedules

#### **Crop Management**
- Plan crops using the calendar interface
- Track planting and harvest dates
- Monitor crop growth stages
- Record pest and disease incidents

#### **Financial Tracking**
- Log revenue from harvest sales
- Track expenses for seeds, fertilizers, equipment
- Monitor government aid and subsidies
- Generate financial reports

#### **Inventory Management**
- Add seeds, fertilizers, and equipment
- Track stock levels and usage
- Set up low-stock alerts
- Manage supplier information

## 🌍 Indian Agriculture Focus

### **Supported Crops**
- **Rice**: Kharif and Rabi seasons
- **Wheat**: Winter wheat varieties
- **Cotton**: Bt cotton and traditional varieties
- **Sugarcane**: High-yield varieties
- **Maize**: Hybrid and traditional varieties
- **Pulses**: Chickpea, Lentil, Mung bean
- **Oilseeds**: Mustard, Groundnut, Sunflower

### **Regional Adaptations**
- **Punjab**: Wheat and Rice focus
- **Gujarat**: Cotton and Groundnut
- **Karnataka**: Sugarcane and Rice
- **Maharashtra**: Cotton and Sugarcane
- **Tamil Nadu**: Rice and Sugarcane

### **Weather Integration**
- **Monsoon Tracking**: Southwest and Northeast monsoon
- **Temperature Monitoring**: Heat wave and frost alerts
- **Rainfall Analysis**: Seasonal precipitation patterns
- **Climate Adaptation**: Weather-based farming recommendations

## 📊 Database Schema

### **Core Tables**
- **users**: User authentication and profiles
- **fields**: Agricultural field information
- **crop_history**: Historical crop data
- **financial_records**: Revenue and expense tracking
- **inventory**: Stock management
- **tasks**: Field activity tracking

### **Key Features**
- **Row Level Security**: User data isolation
- **Real-time Updates**: Live data synchronization
- **Data Validation**: Type-safe data handling
- **Backup & Recovery**: Automated data protection

## 🚀 Deployment

### **Vercel Deployment**
The application is deployed on Vercel with automatic CI/CD:

**Live URL**: [https://agrisystem-git-main-aanandak15-makers-projects.vercel.app/](https://agrisystem-git-main-aanandak15-makers-projects.vercel.app/)

### **Deployment Features**
- **Automatic Builds**: Deploys on every push to main branch
- **Environment Variables**: Secure configuration management
- **CDN Distribution**: Global content delivery
- **SSL Certificate**: Secure HTTPS connection

## 🤝 Contributing

We welcome contributions to improve the platform for Indian farmers:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -m 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write comprehensive tests
- Update documentation
- Follow the existing code structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Farmers**: For their invaluable feedback and requirements
- **Agricultural Experts**: For domain knowledge and best practices
- **Open Source Community**: For the amazing tools and libraries
- **Supabase Team**: For the excellent backend platform
- **Vercel Team**: For seamless deployment experience

## 📞 Support

For support, feature requests, or bug reports:

- **GitHub Issues**: [Create an issue](https://github.com/aanandak15-maker/indian-agricultural-management-system/issues)
- **Email**: [Contact us](mailto:support@agrisystem.com)
- **Documentation**: [Full documentation](https://agrisystem-git-main-aanandak15-makers-projects.vercel.app/docs)

## 🌟 Hackathon Submission

This project was developed for the **KIRO Hackathon** with the goal of revolutionizing agricultural management for Indian farmers through technology.

### **Key Achievements**
- ✅ **Complete Farm Management System**
- ✅ **Real-time Data Synchronization**
- ✅ **Mobile-Responsive Design**
- ✅ **Indian Agriculture Focus**
- ✅ **Production-Ready Deployment**
- ✅ **Comprehensive Documentation**

---

**Built with ❤️ for Indian Agriculture**

*Empowering farmers with technology for a sustainable future*