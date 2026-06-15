import {
  ArrowLeft,
  Check,
  X,
  Pencil,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useProductPrices } from "../../providers/ProductPrice";
import { Link } from "react-router";
import { Button } from "@shadcn-ui/components/ui/button";
import { AddItemModal } from "./components/AddItemModal";

export const SettingsRoute = () => {
  const { products, updatePrice, deleteProduct, reorderProduct } =
    useProductPrices();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleEditClick = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditingPrice(currentPrice.toString());
  };

  const handleSavePrice = (id: string) => {
    const newPrice = parseInt(editingPrice, 10);
    if (!isNaN(newPrice) && newPrice > 0) {
      updatePrice(id, newPrice);
      setEditingId(null);
      setEditingPrice("");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingPrice("");
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedProduct = products.find((p) => p.id === draggedId);
    const targetProduct = products.find((p) => p.id === targetId);

    if (draggedProduct && targetProduct) {
      // Swap indices
      reorderProduct(draggedId, targetProduct.index);
      reorderProduct(targetId, draggedProduct.index);
    }

    setDraggedId(null);
  };

  const handleMoveUp = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product && product.index > 0) {
      const prevProduct = products.find((p) => p.index === product.index - 1);
      if (prevProduct) {
        reorderProduct(id, prevProduct.index);
        reorderProduct(prevProduct.id, product.index);
      }
    }
  };

  const handleMoveDown = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const maxIndex = Math.max(...products.map((p) => p.index));
      if (product.index < maxIndex) {
        const nextProduct = products.find((p) => p.index === product.index + 1);
        if (nextProduct) {
          reorderProduct(id, nextProduct.index);
          reorderProduct(nextProduct.id, product.index);
        }
      }
    }
  };

  const sortedProducts = [...products].sort((a, b) => a.index - b.index);

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
            Indstillinger
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 pb-20">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-lg font-semibold mb-4">Ændre Produkter</h2>
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              draggable
              onDragStart={() => handleDragStart(product.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(product.id)}
              className={`flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-opacity ${
                draggedId === product.id ? "opacity-50" : ""
              } cursor-move`}
            >
              <span className="text-2xl">{product.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{product.name}</p>
              </div>

              {editingId === product.id ? (
                <div className="flex items-center gap-1 ml-auto shrink-0">
                  <input
                    type="number"
                    value={editingPrice}
                    onChange={(e) => setEditingPrice(e.target.value)}
                    className="w-16 rounded border border-border bg-background px-2 py-1 text-right text-sm"
                    step="1"
                    min="1"
                    autoFocus
                  />
                  <span className="text-sm font-semibold min-w-fit">kr</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSavePrice(product.id)}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancel}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1 ml-auto shrink-0">
                  <p className="font-bold text-lg w-12 text-right">
                    {product.price}
                  </p>
                  <p className="text-sm font-semibold">kr</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditClick(product.id, product.price)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMoveUp(product.id)}
                    disabled={product.index === 0}
                    className="h-8 w-8"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMoveDown(product.id)}
                    disabled={
                      product.index ===
                      Math.max(...products.map((p) => p.index))
                    }
                    className="h-8 w-8"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteProduct(product.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};
