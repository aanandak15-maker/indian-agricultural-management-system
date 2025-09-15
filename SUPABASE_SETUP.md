# Supabase Integration Setup Guide

## 🚀 Quick Start

Your Supabase project is already configured! Here's what you need to do to complete the setup:

### 1. Database Setup

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/wazwpegjogtqtcjtqvsd
2. **Navigate to SQL Editor** in the left sidebar
3. **Run the SQL files in this order**:
   - Copy and paste `setup-database.sql` → Click "Run"
   - Copy and paste `setup-indexes.sql` → Click "Run"  
   - Copy and paste `setup-triggers.sql` → Click "Run"
   - Copy and paste `setup-rls.sql` → Click "Run"
   - (Optional) Copy and paste `sample-data.sql` → Click "Run"

### 2. Environment Variables

The `.env.local` file has been created with your Supabase credentials:
- ✅ `VITE_SUPABASE_URL`: Your project URL
- ✅ `VITE_SUPABASE_ANON_KEY`: Your anonymous key

### 3. Authentication Setup

1. **Go to Authentication > Settings** in your Supabase dashboard
2. **Configure Site URL**: Add `http://localhost:5173` for development
3. **Configure Redirect URLs**: Add `http://localhost:5173/**` for development
4. **Enable Email Authentication** (should be enabled by default)

### 4. Row Level Security (RLS)

The database schema includes RLS policies that ensure:
- Users can only see their own data
- All operations are properly secured
- Data isolation between different users

### 5. Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Create a test account**:
   - Go to `http://localhost:5173`
   - Click "Sign up"
   - Create an account with a valid email
   - Check your email for the confirmation link

3. **Test field creation**:
   - After logging in, go to Fields page
   - Click "Add a Field"
   - Fill out the form and save
   - The data should now be stored in Supabase!

## 📊 Database Schema Overview

### Tables Created:
- **users**: User profiles (extends Supabase auth)
- **fields**: Agricultural fields/parcels
- **crop_history**: Historical crop data per field
- **financial_records**: Revenue and expense tracking
- **inventory**: Seeds, fertilizers, equipment

### Key Features:
- **Automatic timestamps**: `created_at` and `updated_at` fields
- **Data validation**: Check constraints for data integrity
- **Performance indexes**: Optimized queries for large datasets
- **Row Level Security**: Complete data isolation between users

## 🔧 Development Workflow

### Adding New Features:
1. **Update database schema** in `database-schema.sql`
2. **Update TypeScript types** in `src/lib/supabase.ts`
3. **Add operations** in `src/lib/supabase-operations.ts`
4. **Update context** in `src/contexts/SupabaseCRMContext.tsx`

### Data Operations:
```typescript
// Example: Creating a new field
const { createField } = useSupabaseCRM();
await createField({
  name: "North Field",
  area: 12.5,
  crop: "Rice",
  status: "active",
  soil_type: "Clay",
  coordinates: { lat: 28.6139, lng: 77.2090 }
});
```

## 🚨 Important Notes

### Security:
- ✅ RLS policies are enabled on all tables
- ✅ Users can only access their own data
- ✅ All operations are authenticated

### Performance:
- ✅ Database indexes are created for common queries
- ✅ Efficient data loading with React Query
- ✅ Optimistic updates for better UX

### Scalability:
- ✅ PostgreSQL can handle millions of records
- ✅ Supabase handles scaling automatically
- ✅ Real-time subscriptions available for live updates

## 🐛 Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check that `.env.local` exists and has correct values
   - Restart your development server

2. **"Row Level Security policy violation"**
   - Make sure user is authenticated
   - Check that RLS policies are properly set up

3. **"Table doesn't exist"**
   - Run the database schema SQL in Supabase dashboard
   - Check that all tables were created successfully

### Getting Help:
- Check Supabase logs in the dashboard
- Use browser developer tools to see network requests
- Verify environment variables are loaded correctly

## 🎯 Next Steps

1. **Test all CRUD operations** (Create, Read, Update, Delete)
2. **Add real-time features** using Supabase subscriptions
3. **Implement file uploads** for field images
4. **Add advanced analytics** with custom SQL queries
5. **Set up production deployment** with proper environment variables

## 📈 Production Deployment

When deploying to production:

1. **Update environment variables**:
   - Set production Supabase URL
   - Update Site URL in Supabase dashboard
   - Configure proper redirect URLs

2. **Database optimizations**:
   - Add more indexes based on usage patterns
   - Set up database backups
   - Monitor query performance

3. **Security**:
   - Review RLS policies
   - Set up proper CORS settings
   - Enable rate limiting

Your agricultural management system is now ready for production use with full database persistence! 🌱
