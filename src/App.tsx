
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ParcelsPage from "./pages/ParcelsPage";
import ParcelsDetailsPage from "./pages/ParcelsDetailsPage";
import CropsPage from "./pages/CropsPage";
import InventoryPage from "./pages/InventoryPage";
import FinancePage from "./pages/FinancePage";
import StatsPage from "./pages/StatsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { SupabaseCRMProvider } from "./contexts/SupabaseCRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthPage } from "./components/auth/AuthPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { trackPageView } from "./utils/analytics";

// Define routes configuration with redirects
const routes = [
  { path: "/", element: <Index /> },
  { path: "/fields", element: <ParcelsPage /> },
  { path: "/fields/:id", element: <ParcelsDetailsPage /> },
  { path: "/crops", element: <CropsPage /> },
  { path: "/inventory", element: <InventoryPage /> },
  { path: "/finance", element: <FinancePage /> },
  { path: "/statistics", element: <StatisticsProvider><StatsPage /></StatisticsProvider> },
  { path: "/reports", element: <ReportsPage /> },
  { path: "/settings", element: <SettingsPage /> },
  // Redirect old French routes to new English routes
  { path: "/parcelles", element: <Navigate to="/fields" replace /> },
  { path: "/parcelles/:id", element: <Navigate to="/fields/:id" replace /> },
  { path: "/cultures", element: <Navigate to="/crops" replace /> },
  { path: "/inventaire", element: <Navigate to="/inventory" replace /> },
  { path: "/finances", element: <Navigate to="/finance" replace /> },
  { path: "/statistiques", element: <Navigate to="/statistics" replace /> },
  { path: "/dashboard", element: <Navigate to="/" replace /> },
  { path: "*", element: <NotFound /> }
];

// Create query client with enhanced configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Router change handler component
const RouterChangeHandler = () => {
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Track page view for analytics
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'dashboard' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);
  
  return null;
};

// Protected routes component
const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-agri-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      {routes.map((route) => (
        <Route 
          key={route.path} 
          path={route.path} 
          element={route.element} 
        />
      ))}
    </Routes>
  );
};

// Application main component with properly nested providers
const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppSettingsProvider>
            <SupabaseCRMProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <RouterChangeHandler />
                  <ProtectedRoutes />
                </TooltipProvider>
              </BrowserRouter>
            </SupabaseCRMProvider>
          </AppSettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
