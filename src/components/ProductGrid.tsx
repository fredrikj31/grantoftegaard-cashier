import { Button } from "@shadcn-ui/components/ui/button";
import { useCart } from "../providers/Cart";
import { useProductPrices } from "../providers/ProductPrice";

export function ProductGrid() {
  const { addItem } = useCart();
  const { products: dynamicProducts, getPrice } = useProductPrices();

  // Sort products by index
  const sortedProducts = [...dynamicProducts].sort((a, b) => a.index - b.index);

  return (
    <div className="grid grid-cols-3 gap-3 p-4 md:gap-4">
      {sortedProducts.map((product) => {
        const currentPrice = getPrice(product.id);
        return (
          <Button
            key={product.id}
            onClick={() => addItem({ ...product, price: currentPrice })}
            variant="outline"
            className="h-auto flex-col items-center justify-center gap-2 py-4"
          >
            <span className="text-3xl">{product.emoji}</span>
            <span className="text-xs font-semibold text-center line-clamp-2">
              {product.name}
            </span>
            <span className="text-sm font-bold">{currentPrice} kr</span>
          </Button>
        );
      })}
    </div>
  );
}
