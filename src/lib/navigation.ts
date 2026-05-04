import {
  Bell,
  Boxes,
  ChartColumnIncreasing,
  Crosshair,
  LayoutDashboard,
  Search,
  Send,
  Settings,
  Store,
} from "lucide-react";

export const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Snapshot of the internal tool shell",
    icon: LayoutDashboard,
  },
  {
    href: "/search",
    label: "Search",
    description: "Find seeded Target products and Gemini insights",
    icon: Search,
  },
  {
    href: "/store-performance",
    label: "Store Performance",
    description: "Store sales, customers, refunds, and top products",
    icon: Store,
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
    description: "Target vs Walmart pricing, stock, sales, and AI readouts",
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
