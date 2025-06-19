
import React, { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COLORS = [
  "#2563eb", "#ea580c", "#10b981", "#dc2626", "#facc15",
  "#a21caf", "#14b8a6", "#f472b6", "#fbbf24", "#6d28d9"
];

const VentasStatsCharts: React.FC = () => {
  const { products, categories } = useProducts();

  // Agrupar productos por categoría
  const productsPerCategory = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => p.category === cat.name).length,
    }));
  }, [products, categories]);

  // Agrupar por marca
  const brandMap = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.brand || "omegaplast"] = (counts[p.brand || "omegaplast"] || 0) + 1;
    });
    return Object.entries(counts).map(([brand, count]) => ({
      name: brand,
      value: count,
    }));
  }, [products]);

  // Distribución por rango de precio (buckets)
  const priceBuckets = useMemo(() => {
    const buckets = [
      { name: "≤ S/.10", count: 0 },
      { name: "S/.10-30", count: 0 },
      { name: "S/.30-60", count: 0 },
      { name: "S/.60+", count: 0 },
    ];
    products.forEach((p) => {
      if (p.unitPrice <= 10) buckets[0].count++;
      else if (p.unitPrice <= 30) buckets[1].count++;
      else if (p.unitPrice <= 60) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [products]);

  // Tendencia de precios por categoría (promedio)
  const avgPricePerCategory = useMemo(() => {
    return categories.map(cat => {
      const catProducts = products.filter(p => p.category === cat.name);
      const avg = catProducts.length > 0
        ? catProducts.reduce((sum, p) => sum + (p.unitPrice || 0), 0) / catProducts.length
        : 0;
      return {
        category: cat.name,
        avgPrice: Number(avg.toFixed(2)),
      };
    });
  }, [products, categories]);

  // Producto más caro y más barato
  const mostExpensive = products.length > 0
    ? products.reduce((max, p) => p.unitPrice > max.unitPrice ? p : max, products[0])
    : undefined;
  const cheapest = products.length > 0
    ? products.reduce((min, p) => p.unitPrice < min.unitPrice ? p : min, products[0])
    : undefined;

  return (
    <div className="space-y-8">
      {/* 1. Productos por categoría (BarChart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Productos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={productsPerCategory}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Productos por marca (PieChart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución por Marca</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={brandMap}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={88}
                label={d => d.name}
              >
                {brandMap.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Distribución de productos por precio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución por Rango de Precio (Unitario)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={priceBuckets}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#ea580c" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Promedio de precio por categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Precio Promedio por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={avgPricePerCategory}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgPrice" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 5. Producto más caro / barato */}
      <div className="flex gap-4 flex-wrap">
        {mostExpensive && (
          <Card className="flex-1 min-w-[210px]">
            <CardHeader>
              <CardTitle className="text-base">Producto más caro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{mostExpensive.brand}</Badge>
                <span className="font-medium">{mostExpensive.name}</span>
              </div>
              <div className="text-sm mt-1 text-gray-600">S/. {mostExpensive.unitPrice.toFixed(2)}</div>
              <div className="text-xs text-gray-400">Categoría: {mostExpensive.category}</div>
            </CardContent>
          </Card>
        )}
        {cheapest && (
          <Card className="flex-1 min-w-[210px]">
            <CardHeader>
              <CardTitle className="text-base">Producto más económico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{cheapest.brand}</Badge>
                <span className="font-medium">{cheapest.name}</span>
              </div>
              <div className="text-sm mt-1 text-gray-600">S/. {cheapest.unitPrice.toFixed(2)}</div>
              <div className="text-xs text-gray-400">Categoría: {cheapest.category}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VentasStatsCharts;
