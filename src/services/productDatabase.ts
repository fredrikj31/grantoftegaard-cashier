import { openDB, type IDBPDatabase } from "idb";
import type { ProductPrice } from "../providers/ProductPrice";

const DB_NAME = "cashier-db";
const DB_VERSION = 1;
const STORE_NAME = "products";

interface CashierDB {
  products: {
    key: string;
    value: ProductPrice;
    indexes: { "by-index": number };
  };
}

let dbPromise: Promise<IDBPDatabase<CashierDB>> | null = null;

function getDB(): Promise<IDBPDatabase<CashierDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CashierDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by-index", "index");
      },
    });
  }
  return dbPromise;
}

export async function getAllProducts(): Promise<ProductPrice[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function putProduct(product: ProductPrice): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, product);
}

export async function putProducts(products: ProductPrice[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await Promise.all([...products.map((p) => tx.store.put(p)), tx.done]);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function getProductCount(): Promise<number> {
  const db = await getDB();
  return db.count(STORE_NAME);
}

export async function clearAllProducts(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
