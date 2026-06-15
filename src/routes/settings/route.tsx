import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useProductPrices } from "../../providers/ProductPrice";
import { Link } from "react-router";
import { Button } from "@shadcn-ui/components/ui/button";
import { AddItemModal } from "./components/AddItemModal";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableProductRow } from "./components/SortableProductRow";

export const SettingsRoute = () => {
  const { products, updatePrice, deleteProduct, reorderProduct } =
    useProductPrices();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const overProduct = sortedProducts.find((p) => p.id === String(over.id));
    if (!overProduct) return;
    reorderProduct(String(active.id), overProduct.index);
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
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Ændre Produkter</h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedProducts.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {sortedProducts.map((product) => (
                  <SortableProductRow
                    key={product.id}
                    product={product}
                    editingId={editingId}
                    editingPrice={editingPrice}
                    onEditClick={handleEditClick}
                    onSavePrice={handleSavePrice}
                    onCancel={handleCancel}
                    onPriceChange={setEditingPrice}
                    onDelete={deleteProduct}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};
