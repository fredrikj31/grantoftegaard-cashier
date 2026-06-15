import { ArrowLeft, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useProductPrices } from "../../providers/ProductPrice";
import { Link } from "react-router";
import { Button } from "@shadcn-ui/components/ui/button";
import { AddItemModal } from "./components/AddItemModal";
import {
  DialogRoot,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@shadcn-ui/components/ui/dialog";
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
  const { products, updatePrice, deleteProduct, reorderProduct, resetProducts } =
    useProductPrices();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

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
          <div className="mt-10 border-t border-border pt-8">
            <h2 className="text-lg font-semibold mb-1">Nulstil data</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Gendanner den originale produktliste og sletter alle ændringer.
            </p>
            <Button
              variant="destructive"
              onClick={() => setIsResetDialogOpen(true)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Nulstil data
            </Button>
          </div>
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

      <DialogRoot open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogViewport>
            <DialogPopup>
              <DialogTitle className="text-lg font-semibold mb-2">
                Nulstil data?
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mb-6">
                Dette vil slette alle ændringer og gendanne den originale produktliste. Handlingen kan ikke fortrydes.
              </DialogDescription>
              <div className="flex gap-3 justify-end">
                <DialogClose
                  render={<Button variant="outline">Annuller</Button>}
                />
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await resetProducts();
                    setIsResetDialogOpen(false);
                  }}
                >
                  Nulstil
                </Button>
              </div>
            </DialogPopup>
          </DialogViewport>
        </DialogPortal>
      </DialogRoot>
    </main>
  );
};
