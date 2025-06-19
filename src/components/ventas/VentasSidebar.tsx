
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Package, List, TrendingUp, FileText, FileEdit } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const sections = [
  {
    group: "Catálogo",
    items: [
      {
        label: "Productos",
        to: "/ventas?section=products",
        icon: Package,
        section: "products",
      },
      {
        label: "Pedidos",
        to: "/ventas?section=orders",
        icon: List,
        section: "orders",
      },
      {
        label: "Cotizaciones",
        to: "/ventas?section=quotes",
        icon: FileText,
        section: "quotes",
      },
      {
        label: "Estadísticas",
        to: "/ventas?section=stats",
        icon: TrendingUp,
        section: "stats",
      }
    ],
  },
  {
    group: "Configuración",
    items: [
      {
        label: "Templates",
        to: "/ventas?section=templates",
        icon: FileEdit, // Se asigna un icono válido
        section: "templates",
      },
    ]
  }
];

function getCurrentSection(search: string) {
  const params = new URLSearchParams(search);
  return params.get("section") || "products";
}

const VentasSidebar: React.FC = () => {
  const location = useLocation();
  const currentSection = getCurrentSection(location.search);

  return (
    <Sidebar>
      <SidebarContent>
        {sections.map(group => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.section}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentSection === item.section}
                    >
                      <Link to={item.to}>
                        <item.icon className="mr-2" size={18}/>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default VentasSidebar;
