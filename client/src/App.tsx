import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "./context/user-context";
import { ProtectedRoute } from "@/components/layout/protected-route";
import Navbar from "@/components/layout/navbar";
import Header from "@/components/layout/header";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Services from "@/pages/services";
import Invoices from "@/pages/invoices";
import Customers from "@/pages/customers";
import Expenses from "@/pages/expenses";
import Messages from "@/pages/messages";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import Projects from "@/pages/projects";
import Personnel from "@/pages/personnel";
import Comptabilite from "@/pages/comptabilite";
import CompanyInfo from "@/pages/company-info";
import NotFound from "@/pages/not-found";
import CreditNotes from "@/pages/credit-notes";
import Quotes from "@/pages/quotes";
import DeliveryNotes from "@/pages/delivery-notes";
// Import new purchase components
import Suppliers from "@/pages/suppliers";
import PurchaseOrders from "@/pages/purchase-orders";
import SupplierDelivery from "@/pages/supplier-delivery";
import SupplierCreditNotes from "@/pages/supplier-credit-notes";
import ExpenseInvoices from "@/pages/expense-invoices";
import { useState } from "react";

function Router() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <Switch>
        <Route path="/login" component={Login} />
        <Route>
          <ProtectedRoute>
            <Navbar isCollapsed={isNavCollapsed} onCollapse={setIsNavCollapsed} />
            <main className={`transition-all duration-300 ${isNavCollapsed ? 'pl-20' : 'pl-64'}`}>
              <Header />
              <div className="container mx-auto px-8 py-8">
                <Switch>
                  <Route path="/" component={Dashboard} />
                  <Route path="/inventory" component={Inventory} />
                  <Route path="/services" component={Services} />
                  <Route path="/invoices" component={Invoices} />
                  <Route path="/customers" component={Customers} />
                  <Route path="/expenses" component={Expenses} />
                  <Route path="/credit-notes" component={CreditNotes} />
                  <Route path="/quotes" component={Quotes} />
                  <Route path="/delivery-notes" component={DeliveryNotes} />
                  {/* Purchase routes */}
                  <Route path="/suppliers" component={Suppliers} />
                  <Route path="/purchase-orders" component={PurchaseOrders} />
                  <Route path="/supplier-delivery" component={SupplierDelivery} />
                  <Route path="/supplier-credit-notes" component={SupplierCreditNotes} />
                  <Route path="/expense-invoices" component={ExpenseInvoices} />
                  <Route path="/messages" component={Messages} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/company-info" component={CompanyInfo} />
                  <Route path="/admin" component={Admin} />
                  <Route path="/projects" component={Projects} />
                  <Route path="/personnel" component={Personnel} />
                  <Route path="/comptabilite" component={Comptabilite} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </main>
          </ProtectedRoute>
        </Route>
      </Switch>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;