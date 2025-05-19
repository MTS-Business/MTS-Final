import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  DollarSign,
  Receipt,
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
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  UserCheck,
  ClipboardList,
  FileText as FileInvoice,
  Box,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const salesItems = [
  { href: "/customers", label: "Clients", icon: Users },
  { href: "/quotes", label: "Devis", icon: FileText },
  { href: "/delivery-notes", label: "Bons de livraison", icon: Truck },
  { href: "/invoices", label: "Factures", icon: Receipt },
  { href: "/credit-notes", label: "Facture d'avoirs", icon: FileMinus },
];

const purchaseItems = [
  { href: "/suppliers", label: "Fournisseurs", icon: UserCheck },
  { href: "/purchase-orders", label: "Bons de commande", icon: ClipboardList },
  { href: "/supplier-delivery", label: "Bons de livraison", icon: Truck },
  { href: "/supplier-credit-notes", label: "Factures d'avoir", icon: FileMinus },
  { href: "/expense-invoices", label: "Factures de dépense", icon: FileInvoice },
];

const stockItems = [
  { href: "/inventory", label: "Inventaire", icon: Package },
];

const hrItems = [
  { href: "/projects", label: "Projets", icon: Kanban },
  { href: "/personnel", label: "Personnel", icon: UserCircle },
];

const accountingItems = [
  { href: "/financial", label: "Gestion financière", icon: Wallet },
  { href: "/expenses", label: "Dépenses", icon: DollarSign },
  { href: "/comptabilite", label: "Relation avec comptable", icon: Calculator },
];

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: Briefcase },
];

const adminItems = [
  { href: "/company-info", label: "Informations société", icon: Building2 },
  { href: "/admin", label: "Administration", icon: Shield },
];

interface NavbarProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export default function Navbar({ isCollapsed, onCollapse }: NavbarProps) {
  const [location] = useLocation();
  const [isSalesExpanded, setIsSalesExpanded] = useState(true);
  const [isPurchaseExpanded, setIsPurchaseExpanded] = useState(true);
  const [isStockExpanded, setIsStockExpanded] = useState(true);
  const [isHrExpanded, setIsHrExpanded] = useState(true);
  const [isAccountingExpanded, setIsAccountingExpanded] = useState(true);

  const NavItem = ({ href, label, icon: Icon, onClick = null }) => (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          location === href
            ? "bg-[#0077B6] text-white"
            : "hover:bg-[#0077B6]/10"
        )}
        title={isCollapsed ? label : undefined}
        onClick={onClick}
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

  const SalesHeader = () => (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
        "hover:bg-[#0077B6]/10"
      )}
      onClick={() => setIsSalesExpanded(!isSalesExpanded)}
    >
      <Receipt className="h-5 w-5" />
      {!isCollapsed && (
        <>
          <span className="flex-1">Ventes</span>
          {isSalesExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </>
      )}
    </div>
  );

  const PurchaseHeader = () => (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
        "hover:bg-[#0077B6]/10"
      )}
      onClick={() => setIsPurchaseExpanded(!isPurchaseExpanded)}
    >
      <ShoppingCart className="h-5 w-5" />
      {!isCollapsed && (
        <>
          <span className="flex-1">Achats</span>
          {isPurchaseExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </>
      )}
    </div>
  );

  const StockHeader = () => (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
        "hover:bg-[#0077B6]/10"
      )}
      onClick={() => setIsStockExpanded(!isStockExpanded)}
    >
      <Box className="h-5 w-5" />
      {!isCollapsed && (
        <>
          <span className="flex-1">Stock</span>
          {isStockExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </>
      )}
    </div>
  );

  const HRHeader = () => (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
        "hover:bg-[#0077B6]/10"
      )}
      onClick={() => setIsHrExpanded(!isHrExpanded)}
    >
      <UserPlus className="h-5 w-5" />
      {!isCollapsed && (
        <>
          <span className="flex-1">RH</span>
          {isHrExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </>
      )}
    </div>
  );

  const AccountingHeader = () => (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
        "hover:bg-[#0077B6]/10"
      )}
      onClick={() => setIsAccountingExpanded(!isAccountingExpanded)}
    >
      <Calculator className="h-5 w-5" />
      {!isCollapsed && (
        <>
          <span className="flex-1">Comptabilité</span>
          {isAccountingExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </>
      )}
    </div>
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
          <NavItem {...mainNavItems[0]} /> {/* Dashboard */}

          <SalesHeader />
          {isSalesExpanded && !isCollapsed && (
            <div className="ml-3 border-l pl-3 flex flex-col gap-1">
              {salesItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          )}

          <PurchaseHeader />
          {isPurchaseExpanded && !isCollapsed && (
            <div className="ml-3 border-l pl-3 flex flex-col gap-1">
              {purchaseItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          )}

          <StockHeader />
          {isStockExpanded && !isCollapsed && (
            <div className="ml-3 border-l pl-3 flex flex-col gap-1">
              {stockItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          )}

          <HRHeader />
          {isHrExpanded && !isCollapsed && (
            <div className="ml-3 border-l pl-3 flex flex-col gap-1">
              {hrItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          )}

          <AccountingHeader />
          {isAccountingExpanded && !isCollapsed && (
            <div className="ml-3 border-l pl-3 flex flex-col gap-1">
              {accountingItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          )}

          <Separator className="my-4" />

          {/* Rest of main nav items */}
          {mainNavItems.slice(1).map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          <Separator className="my-4" />

          {/* Admin items */}
          {adminItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </div>
    </nav>
  );
}