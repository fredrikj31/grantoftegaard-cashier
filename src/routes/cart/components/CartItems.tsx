import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../../providers/Cart";
import { Button } from "@shadcn-ui/components/ui/button";

export const CartItems = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-lg text-muted-foreground">Kurven er tom</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-2xl">{item.emoji}</div>
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.price} kr each
                </p>
              </div>
              <p className="font-bold text-lg">
                {item.price * item.quantity} kr
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <div className="rounded-lg border-t-2 border-border bg-card p-4">
        <div className="mb-4 flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>{totalPrice} kr</span>
        </div>
        <Button onClick={clearCart} variant="destructive" className="w-full">
          Tøm Kurv
        </Button>
      </div>
    </div>
  );
};
