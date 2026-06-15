/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { products as defaultProducts } from "../data/products";
import {
  getAllProducts,
  putProduct,
  putProducts,
  deleteProduct as dbDeleteProduct,
  getProductCount,
  clearAllProducts,
} from "../services/productDatabase";

export interface ProductPrice {
  id: string;
  name: string;
  emoji: string;
  price: number;
  index: number;
}

interface ProductPriceContextType {
  products: ProductPrice[];
  isLoading: boolean;
  updatePrice: (id: string, price: number) => void;
  getPrice: (id: string) => number;
  addProduct: (name: string, price: number, emoji: string) => Promise<boolean>;
  deleteProduct: (id: string) => void;
  reorderProduct: (id: string, newIndex: number) => void;
  resetProducts: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const count = await getProductCount();
      if (count === 0) {
        const seed = defaultProducts.map((p) => ({ ...p }));
        await putProducts(seed);
        setProductPrices(seed);
      } else {
        const stored = await getAllProducts();
        setProductPrices(stored);
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const updatePrice = (id: string, price: number) => {
    setProductPrices((prevPrices) => {
      const updated = prevPrices.map((p) =>
        p.id === id ? { ...p, price } : p,
      );
      const changed = updated.find((p) => p.id === id);
      if (changed) putProduct(changed);
      return updated;
    });
  };

  const getPrice = (id: string) => {
    const product = productPrices.find((p) => p.id === id);
    return product?.price || 0;
  };

  const addProduct = async (
    name: string,
    price: number,
    emoji: string,
  ): Promise<boolean> => {
    if (
      productPrices.some((p) => p.name.toLowerCase() === name.toLowerCase())
    ) {
      return false;
    }

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

    await putProduct(newProduct);
    setProductPrices((prev) => [...prev, newProduct]);
    return true;
  };

  const deleteProduct = (id: string) => {
    setProductPrices((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      const sorted = [...remaining].sort((a, b) => a.index - b.index);
      const renumbered = sorted.map((p, i) => ({ ...p, index: i }));
      putProducts(renumbered);
      return renumbered;
    });
    dbDeleteProduct(id);
  };

  const resetProducts = async () => {
    await clearAllProducts();
    const seed = defaultProducts.map((p) => ({ ...p }));
    await putProducts(seed);
    setProductPrices(seed);
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
        if (oldIndex < newIndex && p.index > oldIndex && p.index <= newIndex) {
          return { ...p, index: p.index - 1 };
        }
        if (oldIndex > newIndex && p.index < oldIndex && p.index >= newIndex) {
          return { ...p, index: p.index + 1 };
        }
        return p;
      });

      const changed = updated.filter((u) => {
        const original = prev.find((p) => p.id === u.id);
        return original && original.index !== u.index;
      });
      if (changed.length > 0) putProducts(changed);

      return updated;
    });
  };

  if (isLoading) return null;

  return (
    <ProductPriceContext.Provider
      value={{
        products: productPrices,
        isLoading,
        updatePrice,
        getPrice,
        addProduct,
        deleteProduct,
        reorderProduct,
        resetProducts,
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
