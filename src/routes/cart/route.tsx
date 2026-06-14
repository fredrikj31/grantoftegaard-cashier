import { Button } from "@shadcn-ui/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { CartItems } from "./components/CartItems";

export const CartRoute = () => {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-4 px-4 py-4 md:px-6 md:py-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Kurv
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-8">
          <CartItems />
        </div>
      </div>
    </main>
  );
};
