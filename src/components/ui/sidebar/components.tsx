import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebar } from "./context"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={{
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties}
            side={side}
          >
            <div className="flex h-full w-full flex-col gap-4">
              <div className="flex h-[60px] items-center px-2">
                <SidebarHeader />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <div className="flex w-full flex-col gap-2 p-4">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        data-sidebar="sidebar"
        data-state={state}
        className={cn(
          "group/sidebar relative flex h-full w-[--sidebar-width] flex-col gap-4 bg-sidebar text-sidebar-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="flex h-[60px] items-center px-2">
          <SidebarHeader />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="flex w-full flex-col gap-2 p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const { isMobile } = useSidebar()

  if (isMobile) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex h-[60px] items-center px-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6", className)}
            onClick={toggleSidebar}
            {...props}
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Toggle sidebar
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Press Cmd + B to toggle
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarNav.displayName = "SidebarNav"

const SidebarNavItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarNavItem.displayName = "SidebarNavItem"

const SidebarNavLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    variant?: "default" | "ghost"
  }
>(({ className, variant = "default", children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        variant === "default" && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
})
SidebarNavLink.displayName = "SidebarNavLink"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    variant?: "default" | "ghost"
  }
>(({ className, variant = "default", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2",
        variant === "default" && "p-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-2 py-1.5 text-xs font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarGroupItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupItem.displayName = "SidebarGroupItem"

const SidebarGroupItemLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    variant?: "default" | "ghost"
  }
>(({ className, variant = "default", children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        variant === "default" && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
})
SidebarGroupItemLink.displayName = "SidebarGroupItemLink"

const SidebarGroupItemButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    variant?: "default" | "ghost"
  }
>(({ className, variant = "default", children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
})
SidebarGroupItemButton.displayName = "SidebarGroupItemButton"

const SidebarGroupItemIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupItemIcon.displayName = "SidebarGroupItemIcon"

const SidebarGroupItemText = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupItemText.displayName = "SidebarGroupItemText"

const SidebarGroupItemBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupItemBadge.displayName = "SidebarGroupItemBadge"

const SidebarGroupItemSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      className={cn("my-2", className)}
      {...props}
    />
  )
})
SidebarGroupItemSeparator.displayName = "SidebarGroupItemSeparator"

const SidebarGroupItemSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 rounded-lg px-3 py-2", className)}
      {...props}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-32" />
    </div>
  )
})
SidebarGroupItemSkeleton.displayName = "SidebarGroupItemSkeleton"

const SidebarGroupItemInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={cn("h-8", className)}
      {...props}
    />
  )
})
SidebarGroupItemInput.displayName = "SidebarGroupItemInput"

const SidebarGroupItemSlot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <Slot
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </Slot>
  )
})
SidebarGroupItemSlot.displayName = "SidebarGroupItemSlot"

// Componentes adicionales para el AdminSidebar
const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    isActive?: boolean
  }
>(({ className, isActive = false, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium w-full justify-start",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
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