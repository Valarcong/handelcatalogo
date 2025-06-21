import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, useSidebar } from "./context"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarNav,
  SidebarNavItem,
  SidebarNavLink,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupItem,
  SidebarGroupItemLink,
  SidebarGroupItemButton,
  SidebarGroupItemIcon,
  SidebarGroupItemText,
  SidebarGroupItemBadge,
  SidebarGroupItemSeparator,
  SidebarGroupItemSkeleton,
  SidebarGroupItemInput,
  SidebarGroupItemSlot,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./components"

// Wrapper que incluye el TooltipProvider
const SidebarProviderWithTooltips = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SidebarProvider>
>(({ children, ...props }, ref) => {
  return (
    <SidebarProvider {...props} ref={ref}>
      <TooltipProvider delayDuration={0}>
        {children}
      </TooltipProvider>
    </SidebarProvider>
  )
})
SidebarProviderWithTooltips.displayName = "SidebarProviderWithTooltips"

export {
  SidebarProviderWithTooltips as SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarNav,
  SidebarNavItem,
  SidebarNavLink,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupItem,
  SidebarGroupItemLink,
  SidebarGroupItemButton,
  SidebarGroupItemIcon,
  SidebarGroupItemText,
  SidebarGroupItemBadge,
  SidebarGroupItemSeparator,
  SidebarGroupItemSkeleton,
  SidebarGroupItemInput,
  SidebarGroupItemSlot,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} 