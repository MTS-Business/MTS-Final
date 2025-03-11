import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  DollarSign,
  Receipt,
  TrendingUp,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Shield,
  Kanban,
  UserCircle,
  Calculator,
  Building2,
  Truck,
  FileMinus,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const salesItems = [
  { href: "/customers", label: "Clients", icon: Users },
  { href: "/invoices", label: "Factures", icon: Receipt },
  { href: "/credit-notes", label: "Avoirs", icon: FileMinus },
  { href: "/quotes", label: "Devis", icon: FileText },
  { href: "/delivery-notes", label: "Bons de livraison", icon: Truck },
];

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventaire", icon: Package },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/expenses", label: "Dépenses", icon: DollarSign },
  { href: "/projects", label: "Projets", icon: Kanban },
  { href: "/personnel", label: "Personnel", icon: UserCircle },
];

const adminItems = [
  { href: "/company-info", label: "Informations société", icon: Building2 },
  { href: "/admin", label: "Administration", icon: Shield },
  { href: "/comptabilite", label: "Comptabilité", icon: Calculator },
];

interface NavbarProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export default function Navbar({ isCollapsed, onCollapse }: NavbarProps) {
  const [location] = useLocation();

  const NavItem = ({ href, label, icon: Icon }) => (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          location === href
            ? "bg-[#0077B6] text-white"
            : "hover:bg-[#0077B6]/10"
        )}
        title={isCollapsed ? label : undefined}
      >
        <Icon className="h-5 w-5" />
        <span className={cn(
          "transition-all",
          isCollapsed ? "hidden" : "block"
        )}>
          {label}
        </span>
      </a>
    </Link>
  );

  return (
    <nav className={cn(
      "border-r fixed left-0 top-0 h-screen bg-background transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8">
          <div className={cn(
            "transition-all",
            isCollapsed ? "w-8" : "w-32"
          )}>
            <img 
              src="/logo.png" 
              alt="MTS Gestion" 
              className="w-full h-auto"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapse(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {mainNavItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          <Separator className="my-4" />

          {!isCollapsed && (
            <div className="text-sm font-medium text-muted-foreground px-3 mb-2">
              Ventes
            </div>
          )}
          {salesItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          <Separator className="my-4" />

          {adminItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </div>
    </nav>
  );
}