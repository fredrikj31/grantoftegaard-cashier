import { useState } from "react";
import { X } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useProductPrices } from "../../../providers/ProductPrice";
import { Button } from "@shadcn-ui/components/ui/button";
import {
  DialogRoot,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogClose,
} from "@shadcn-ui/components/ui/dialog";

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

  const handleClose = () => {
    setName("");
    setPrice("");
    setEmoji("🥕");
    setError("");
    onClose();
  };

  const handleAddItem = async () => {
    setError("");

    if (!name.trim()) {
      setError("Navn er påkrævet");
      return;
    }

    if (!price.trim()) {
      setError("Pris er påkrævet");
      return;
    }

    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Pris skal være et positivt tal");
      return;
    }

    const success = await addProduct(name, priceNum, emoji);
    if (!success) {
      setError("Et produkt med det navn eksistere allerede");
      return;
    }

    handleClose();
  };

  const emojiPickerHeight = window.matchMedia("(max-width: 767px)").matches
    ? 200
    : 250;

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup>
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-xl font-bold">
                Tilføj Produkt
              </DialogTitle>
              <DialogClose className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-6 w-6" />
              </DialogClose>
            </div>

            <div className="space-y-4">
              <div className="flex flex-row gap-4">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Navn
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kartoffel"
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pris (kr)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="10"
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
                    step="1"
                    min="1"
                  />
                </div>
              </div>

              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Emoji
                </label>
                <EmojiPicker
                  onEmojiClick={(emojiData) => setEmoji(emojiData.emoji)}
                  theme={Theme.LIGHT}
                  width="100%"
                  height={emojiPickerHeight}
                  skinTonesDisabled
                  searchDisabled
                  previewConfig={{
                    showPreview: false,
                  }}
                />
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
                <p className="font-semibold">{name || "Navn"}</p>
                <p className="text-sm text-muted-foreground">
                  {price ? `${price} kr` : "Pris"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Annuller
                </Button>
                <Button onClick={handleAddItem} className="flex-1">
                  Tilføj
                </Button>
              </div>
            </div>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  );
}
