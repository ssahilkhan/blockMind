"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Box,
  ArrowRightLeft,
  FileCode2,
  Coins,
  Activity,
  PieChart,
  Settings,
  ChevronLeft,
  Send,
  Brain,
  ShieldCheck,
  Bot,
  Globe,
  ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemData {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItemData[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Wallets", href: "/wallets", icon: Wallet },
  { label: "Blocks", href: "/blocks", icon: Box },
  { label: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { label: "Studio", href: "/studio", icon: Send },
  { label: "Contracts", href: "/contracts", icon: FileCode2 },
  { label: "Tokens", href: "/tokens", icon: Coins },
  { label: "Events", href: "/events", icon: Activity },
  { label: "Portfolio", href: "/portfolio", icon: PieChart },
  { label: "AI Assistant", href: "/ai", icon: Brain },
  { label: "Copilot", href: "/copilot", icon: Bot },
  { label: "Security", href: "/security", icon: ShieldCheck },
  { label: "Auditor", href: "/auditor", icon: ClipboardCheck },
  { label: "Networks", href: "/networks", icon: Globe },
];

const BOTTOM_ITEMS: NavItemData[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavItem({
  item,
  collapsed,
}: {
  item: NavItemData;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

export function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-14 items-center justify-between px-3">
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">
            BlockMind
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <Separator />

      <nav className="space-y-1 px-2 py-3">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
}
