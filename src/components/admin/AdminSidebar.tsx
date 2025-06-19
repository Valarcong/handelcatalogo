import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { Box, ShoppingBag, Database, Settings, Users } from "lucide-react";

const sections = [
  {
    group: "Productos",
    items: [
      {
        label: "Agregar Producto",
        to: "/admin?section=add",
        icon: Box,
        section: "add",
      },
      {
        label: "Gestionar Productos",
        to: "/admin?section=manage",
        icon: ShoppingBag,
        section: "manage",
      },
      {
        label: "Categorías",
        to: "/admin?section=categories",
        icon: Database,
        section: "categories",
      },
      {
        label: "Proveedores",
        to: "/admin?section=suppliers",
        icon: Users,
        section: "suppliers",
      },
    ],
  },
  {
    group: "Gestión",
    items: [
      {
        label: "Clientes",
        to: "/admin?section=clientes",
        icon: Users,
        section: "clientes",
      },
    ],
  },
  {
    group: "Pedidos",
    items: [
      {
        label: "Gestionar Pedidos",
        to: "/admin?section=pedidos",
        icon: ShoppingBag,
        section: "pedidos",
      },
    ],
  },
  {
    group: "Datos & Reportes",
    items: [
      {
        label: "Importar/Exportar",
        to: "/admin?section=import",
        icon: Database,
        section: "import",
      },
      {
        label: "Estadísticas",
        to: "/admin?section=stats",
        icon: Database,
        section: "stats",
      },
    ],
  },
  {
    group: "Configuración",
    items: [
      {
        label: "Ajustes",
        to: "/admin?section=settings",
        icon: Settings,
        section: "settings",
      },
    ],
  },
];

function getCurrentSection(search: string) {
  const params = new URLSearchParams(search);
  return params.get("section") || "add";
}

const AdminSidebar: React.FC = () => {
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
                  <SidebarMenuItem key={item.label}>
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

export default AdminSidebar;

