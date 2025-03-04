import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Briefcase
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/invoices", label: "Factures", icon: FileText },
  { href: "/customers", label: "Clients", icon: Users },
  { href: "/expenses", label: "Dépenses", icon: DollarSign },
  { href: "/sales", label: "Ventes", icon: TrendingUp },
];

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="border-r fixed left-0 top-0 h-screen w-64 bg-background">
      <div className="flex flex-col h-full p-4">
        <div className="font-bold text-2xl text-primary mb-8 px-3">Business Manager</div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}