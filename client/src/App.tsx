import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Services from "@/pages/services";
import Invoices from "@/pages/invoices";
import Customers from "@/pages/customers";
import Expenses from "@/pages/expenses";
import Sales from "@/pages/sales";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pl-64">
        <div className="container mx-auto px-4 py-8">
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
      <Navbar />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;