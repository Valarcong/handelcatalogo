import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { Product, Category } from "@/types/product";
import { Pedido } from "@/types/order";

interface Props {
  pedidos: Pedido[];
  products: Product[];
  categories: Category[];
}

const COLORS = ["#2563eb", "#10b981", "#facc15", "#ef4444", "#8b5cf6", "#14b8a6"];

const AdminAdvancedDashboard: React.FC<Props> = ({ pedidos, products, categories }) => {
  // KPIs rápidos
  const totalVentas = useMemo(() => pedidos.reduce((acc, p) => acc + (typeof p.total === "number" ? p.total : 0), 0), [pedidos]);
  const totalPedidos = pedidos.length;
  const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;
  const pedidosCancelados = pedidos.filter(p => p.estado === "cancelado").length;
  const cancelRate = totalPedidos > 0 ? (pedidosCancelados / totalPedidos) * 100 : 0;

  // Embudo de pedidos por estado
  const estadosFunnel = ["pendiente", "enproceso", "enviado", "entregado_pp", "entregado_pr", "cancelado"];
  const funnelData = estadosFunnel.map(estado => ({
    name: estado.charAt(0).toUpperCase() + estado.slice(1),
    value: pedidos.filter(p => p.estado === estado).length
  }));

  // Detectar granularidad adecuada: si el rango es <= 31 días → usar "día", si > 31 → usar mes
  const groupBy = (() => {
    if (pedidos.length < 2) return "día";
    const fechas = pedidos.map(p => new Date(p.created_at));
    fechas.sort((a,b) => a.getTime() - b.getTime());
    const diffMs = fechas.at(-1)!.getTime() - fechas[0].getTime();
    const diffDays = diffMs / (1000*60*60*24);
    return diffDays > 31 ? "mes" : "día";
  })();

  // Ventas por periodo adecuado
  const timeSeries = useMemo(() => {
    const map: { [k: string]: { ingresos: number, pedidos: number } } = {};
    pedidos.forEach((p) => {
      const d = new Date(p.created_at);
      const label = groupBy === "día"
        ? d.toISOString().slice(0,10)
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[label]) map[label] = { ingresos: 0, pedidos: 0 };
      map[label].ingresos += typeof p.total === "number" ? p.total : 0;
      map[label].pedidos += 1;
    });
    return Object.entries(map)
      .map(([period, v]) => ({ period, ...v }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }, [pedidos, groupBy]);

  // Ventas por canal (si existe "canal" en pedido, sino simular uno)
  const canales = pedidos.reduce((arr, p) => {
    const canal = (p as any).canal || "Directo";
    const found = arr.find(c => c.name === canal);
    if (found) found.value += 1;
    else arr.push({ name: canal, value: 1 });
    return arr;
  }, [] as { name: string; value: number; }[]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-xl font-bold text-brand-navy">S/. {totalVentas.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Ventas totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-xl font-bold text-brand-navy">{totalPedidos}</div>
            <div className="text-sm text-gray-600">Pedidos totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-xl font-bold text-brand-navy">S/. {ticketPromedio.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Ticket promedio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-xl font-bold text-brand-navy">{pedidosCancelados}</div>
            <div className="text-sm text-gray-600">Pedidos cancelados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-xl font-bold text-brand-navy">{cancelRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Tasa de cancelación</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Embudo de pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Embudo de pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={funnelData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Ventas por canal*/}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={canales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {canales.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ventas históricas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Histórico de Ventas ({groupBy === "día" ? "días" : "meses"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={timeSeries}>
              <XAxis dataKey="period" />
              <YAxis width={60} />
              <Tooltip formatter={(v:number) => `S/. ${v.toFixed(2)}`} />
              <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos"/>
              <Line type="monotone" dataKey="pedidos" stroke="#facc15" strokeWidth={2} name="Pedidos"/>
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdvancedDashboard;
