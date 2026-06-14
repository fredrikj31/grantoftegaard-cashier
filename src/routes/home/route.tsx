import { Button } from "@shadcn-ui/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router";
import { ProductGrid } from "../../components/ProductGrid";
import { CartSummary } from "../../components/CartSummary";

export const HomeRoute = () => {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Grantoftegaard
          </h1>
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <ProductGrid />
      </div>

      <CartSummary />
    </main>
  );
};
