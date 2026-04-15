import {
  Bell,
  Boxes,
  ChartColumnIncreasing,
  LayoutDashboard,
  MessageSquareMore,
  ReceiptText,
  Settings,
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
    href: "/messages",
    label: "Messages",
    description: "Inbox and team communication workspace",
    icon: MessageSquareMore,
  },
  {
    href: "/alerts",
    label: "Alerts",
    description: "Placeholder for notification logic",
    icon: Bell,
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
