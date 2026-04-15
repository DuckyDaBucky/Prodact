import {
  Bell,
  Boxes,
  ChartColumnIncreasing,
  LayoutDashboard,
  ReceiptText,
  Send,
  Settings,
  Store,
  Tags,
} from "lucide-react";

export const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
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
    href: "/pricing",
    label: "Pricing",
    description: "Placeholder for competitor pricing work",
    icon: Tags,
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
    href: "/reports",
    label: "Reports",
    description: "Placeholder for export and executive reports",
    icon: ReceiptText,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Internal tool preferences and account shell",
    icon: Settings,
  },
] as const;
