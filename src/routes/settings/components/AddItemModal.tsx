import { useState } from "react";
import { X } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useProductPrices } from "../../../providers/ProductPrice";
import { Button } from "@shadcn-ui/components/ui/button";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [emoji, setEmoji] = useState("🥕");
  const [error, setError] = useState("");
  const { addProduct } = useProductPrices();

  const handleAddItem = async () => {
    // Clear previous error
    setError("");

    // Validate inputs
    if (!name.trim()) {
      setError("Item name is required");
      return;
    }

    if (!price.trim()) {
      setError("Price is required");
      return;
    }

    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Price must be a positive number");
      return;
    }

    // Try to add the product
    const success = await addProduct(name, priceNum, emoji);
    if (!success) {
      setError("Item with this name already exists");
      return;
    }

    // Reset form and close modal
    setName("");
    setPrice("");
    setEmoji("🥕");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Carrot"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Price (kr)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 10"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
              step="1"
              min="1"
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-sm font-semibold mb-2">Emoji</label>
            <div className="bg-background rounded border border-border p-2 max-h-80 overflow-y-auto">
              <EmojiPicker
                onEmojiClick={(emojiData) => setEmoji(emojiData.emoji)}
                theme={Theme.DARK}
                width="100%"
                height={300}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">
              {error}
            </div>
          )}

          {/* Preview */}
          <div className="bg-muted p-3 rounded text-center">
            <div className="text-4xl mb-2">{emoji}</div>
            <p className="font-semibold">{name || "Item Name"}</p>
            <p className="text-sm text-muted-foreground">
              {price ? `${price} kr` : "Price"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddItem} className="flex-1">
              Add Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
