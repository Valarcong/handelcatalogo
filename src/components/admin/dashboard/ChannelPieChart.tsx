import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Pedido, PEDIDO_ESTADOS } from "@/types/order";

interface ChannelPieChartProps {
  pedidos: Pedido[];
}

const STATUS_COLORS: { [key: string]: string } = {
  Pendiente: '#f97316',
  'En proceso': '#3b82f6',
  Enviado: '#8b5cf6',
  Entregado: '#22c55e',
  Cancelado: '#ef4444',
  Default: '#64748b'
};

const getStatusLabelAndGroup = (status: string): string => {
  if (status === 'entregado_pp' || status === 'entregado_pr') return 'Entregado';
  const found = PEDIDO_ESTADOS.find(s => s.value === status);
  return found ? found.label : 'Desconocido';
};

const ChannelPieChart: React.FC<ChannelPieChartProps> = ({ pedidos }) => {
  const statusData = React.useMemo(() => {
    const counts = new Map<string, number>();
    pedidos.forEach(p => {
      const label = getStatusLabelAndGroup(p.estado);
      if (label !== 'Desconocido') {
        counts.set(label, (counts.get(label) || 0) + 1);
      }
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [pedidos]);

  const totalPedidos = pedidos.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pedidos por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        {totalPedidos > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                formatter={(value: number, name: string) => [`${value} (${(value / totalPedidos * 100).toFixed(0)}%)`, name]}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconSize={10}
                wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                formatter={(value) => <span className="text-gray-700 ml-2">{value}</span>}
              />
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                labelLine={false}
              >
                {statusData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || STATUS_COLORS.Default} />
                ))}
              </Pie>
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="central" fill="#1f2937" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {totalPedidos}
              </text>
              <text x="50%" y="45%" dy="25" textAnchor="middle" fill="#6b7280" style={{ fontSize: '0.875rem' }}>
                Pedidos
              </text>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[220px] text-gray-500">
            No hay datos de pedidos para mostrar.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChannelPieChart; 