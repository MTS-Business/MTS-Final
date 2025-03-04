import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Services from "@/pages/services";
import Invoices from "@/pages/invoices";
import Customers from "@/pages/customers";
import Expenses from "@/pages/expenses";
import Sales from "@/pages/sales";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
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
            <Route path="/sales" component={Sales} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;