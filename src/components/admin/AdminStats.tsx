import React, { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useDateFilters } from '@/hooks/analytics/useDateFilters';
import { useAuthContext } from '@/hooks/AuthContext';
import { DateRangeFilter } from './analytics/DateRangeFilter';
import KPICards from './dashboard/KPICards';
import SalesHistoryChart from './dashboard/SalesHistoryChart';
import OrderFunnelChart from './dashboard/OrderFunnelChart';
import ChannelPieChart from './dashboard/ChannelPieChart';
import AdminAdvancedDashboard from './AdminAdvancedDashboard';
import AdminReportsSection from './AdminReportsSection';
import AdminAIPredictiveAlerts from './AdminAIPredictiveAlerts';
import PredictiveAnalytics from './PredictiveAnalytics';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

type AdminTab = 'general' | 'advanced' | 'reports' | 'predictive';

const AdminStats: React.FC = () => {
  const { pedidos, loading: loadingPedidos, fetchPedidos } = useOrders();
  const { products, loading: loadingProducts } = useProducts();
  const { range, setRange } = useDateFilters();
  const [tab, setTab] = useState<AdminTab>('general');
  const { user } = useAuthContext();

  const TABS = [
    { id: 'general', label: 'General' },
    { id: 'advanced', label: 'Avanzado' },
    { id: 'reports', label: 'Reportes' },
    { id: 'predictive', label: 'Predictivo' },
  ] as const;

  useEffect(() => {
    fetchPedidos(range);
  }, [range]);

  const handleRefresh = () => {
    fetchPedidos(range);
    // Aquí se podrían refrescar otros datos si fuera necesario
  };

  const renderContent = () => {
    switch (tab) {
      case 'general':
        return (
          <div className="space-y-4">
            <KPICards pedidos={pedidos} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SalesHistoryChart pedidos={pedidos} />
              <OrderFunnelChart pedidos={pedidos} />
            </div>
            <ChannelPieChart pedidos={pedidos} />
          </div>
        );
      case 'advanced':
        return <AdminAdvancedDashboard pedidos={pedidos} />;
      case 'reports':
        return <AdminReportsSection pedidos={pedidos} productos={products} />;
      case 'predictive':
        return <PredictiveAnalytics pedidos={pedidos} productos={products} dateRange={range} />;
      default:
        return null;
    }
  };

  const loading = loadingPedidos || loadingProducts;

  if (loading && pedidos.length === 0) {
    return <div>Cargando estadísticas...</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-yellow-600 py-8">
        No se detectó usuario autenticado. Por favor vuelve a ingresar al sistema.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Estadísticas</h1>
        <div className="flex items-center gap-4">
          <DateRangeFilter range={range} setRange={setRange} />
          <Button onClick={handleRefresh} variant="outline" size="icon" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <Tabs value={tab} onValueChange={(value) => setTab(value as AdminTab)}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tab}>
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStats;
