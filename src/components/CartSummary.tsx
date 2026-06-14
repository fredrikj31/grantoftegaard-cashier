import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "../providers/Cart";
import { Button } from "@shadcn-ui/components/ui/button";

export function CartSummary() {
  const { getTotalPrice, items } = useCart();
  const totalPrice = getTotalPrice();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-border bg-card p-4 md:p-6">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">Total</p>
        <p className="text-2xl font-bold md:text-3xl">{totalPrice} kr</p>
      </div>
      <Link to="/cart">
        <Button size="lg" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {items.length}
            </span>
          )}
        </Button>
      </Link>
    </div>
  );
}
