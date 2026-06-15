import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, X, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@shadcn-ui/components/ui/button";
import type { ProductPrice } from "../../../providers/ProductPrice";

interface Props {
  product: ProductPrice;
  editingId: string | null;
  editingPrice: string;
  onEditClick: (id: string, price: number) => void;
  onSavePrice: (id: string) => void;
  onCancel: () => void;
  onPriceChange: (value: string) => void;
  onDelete: (id: string) => void;
}

export function SortableProductRow({
  product,
  editingId,
  editingPrice,
  onEditClick,
  onSavePrice,
  onCancel,
  onPriceChange,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-shadow ${
        isDragging ? "opacity-50 shadow-lg z-10 relative" : ""
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        {...listeners}
        className="text-muted-foreground cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 shrink-0"
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <span className="text-2xl">{product.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{product.name}</p>
      </div>

      {editingId === product.id ? (
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <input
            type="number"
            value={editingPrice}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-16 rounded border border-border bg-background px-2 py-1 text-right text-sm"
            step="1"
            min="1"
            autoFocus
          />
          <span className="text-sm font-semibold min-w-fit">kr</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onSavePrice(product.id)}
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <p className="font-bold text-lg w-12 text-right">{product.price}</p>
          <p className="text-sm font-semibold">kr</p>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEditClick(product.id, product.price)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(product.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
