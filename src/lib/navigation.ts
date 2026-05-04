import {
  Bell,
  Boxes,
  ChartColumnIncreasing,
  Crosshair,
  LayoutDashboard,
  Send,
  Settings,
  Store,
} from "lucide-react";

export const navItems = [
  {
    href: "/dashboard",
    label: "Store Performance",
    description: "Snapshot of the internal tool shell",
    icon: LayoutDashboard,
  },
  {
    href: "/inventory",
    label: "Inventory",
    description: "Placeholder for stock visibility workflows",
    icon: Boxes,
  },
  {
    href: "/competitor-analysis",
    label: "Competitor Analysis",
    description: "Location-level competitor insights and AI actions",
    icon: Crosshair,
  },
  {
    href: "/product-analysis",
    label: "Product Analysis",
    description: "Placeholder for future analytics pages",
    icon: ChartColumnIncreasing,
  },
  {
    href: "/alerts",
    label: "Notifications",
    description: "Product and social notification center",
    icon: Bell,
  },
  {
    href: "/messages",
    label: "Messages",
    description: "Search and review faculty conversations",
    icon: Send,
  },
  {
    href: "/store-layout",
    label: "Store Layout",
    description: "Compare current and recommended floor plans",
    icon: Store,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Internal tool preferences and account shell",
    icon: Settings,
  },
] as const;
