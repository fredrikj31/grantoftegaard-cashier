/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { products } from "../data/products";

export interface ProductPrice {
  id: string;
  name: string;
  emoji: string;
  price: number;
  index: number;
}

interface ProductPriceContextType {
  products: ProductPrice[];
  updatePrice: (id: string, price: number) => void;
  getPrice: (id: string) => number;
  addProduct: (name: string, price: number, emoji: string) => boolean;
  deleteProduct: (id: string) => void;
  reorderProduct: (id: string, newIndex: number) => void;
}

const ProductPriceContext = createContext<ProductPriceContextType | undefined>(
  undefined,
);

export function ProductPriceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [productPrices, setProductPrices] = useState<ProductPrice[]>([]);

  useEffect(() => {
    setProductPrices(
      products.map((p) => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        price: p.price,
        index: p.index,
      })),
    );
  }, []);

  const updatePrice = (id: string, price: number) => {
    setProductPrices((prevPrices) =>
      prevPrices.map((p) => (p.id === id ? { ...p, price } : p)),
    );
  };

  const getPrice = (id: string) => {
    const product = productPrices.find((p) => p.id === id);
    return product?.price || 0;
  };

  const addProduct = (name: string, price: number, emoji: string): boolean => {
    // Check for duplicate name
    if (
      productPrices.some((p) => p.name.toLowerCase() === name.toLowerCase())
    ) {
      return false;
    }

    // Check for positive price
    if (price <= 0) {
      return false;
    }

    const newId = Date.now().toString();
    const newIndex = Math.max(...productPrices.map((p) => p.index), -1) + 1;

    const newProduct: ProductPrice = {
      id: newId,
      name,
      emoji,
      price,
      index: newIndex,
    };

    setProductPrices((prev) => [...prev, newProduct]);
    return true;
  };

  const deleteProduct = (id: string) => {
    setProductPrices((prev) => prev.filter((p) => p.id !== id));
  };

  const reorderProduct = (id: string, newIndex: number) => {
    setProductPrices((prev) => {
      const product = prev.find((p) => p.id === id);
      if (!product) return prev;

      const oldIndex = product.index;
      const updated = prev.map((p) => {
        if (p.id === id) {
          return { ...p, index: newIndex };
        }
        // Shift other items
        if (oldIndex < newIndex && p.index > oldIndex && p.index <= newIndex) {
          return { ...p, index: p.index - 1 };
        }
        if (oldIndex > newIndex && p.index < oldIndex && p.index >= newIndex) {
          return { ...p, index: p.index + 1 };
        }
        return p;
      });
      return updated;
    });
  };

  return (
    <ProductPriceContext.Provider
      value={{
        products: productPrices,
        updatePrice,
        getPrice,
        addProduct,
        deleteProduct,
        reorderProduct,
      }}
    >
      {children}
    </ProductPriceContext.Provider>
  );
}

export function useProductPrices() {
  const context = useContext(ProductPriceContext);
  if (context === undefined) {
    throw new Error(
      "useProductPrices must be used within a ProductPriceProvider",
    );
  }
  return context;
}
