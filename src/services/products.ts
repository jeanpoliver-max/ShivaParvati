import { massasData, pizzasData, tortasData, molhosData, caldosData, diversosData } from '../data';

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  type: string;
  embalagem: string[];
}

const PRODUCTS_KEY = 'shiva_parvati_products_v1';

export function getProducts(): Product[] {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Seed initial data
  const initialData: Product[] = [];
  
  const map: Record<string, any[]> = {
    massas: massasData,
    pizzas: pizzasData,
    tortas: tortasData,
    molhos: molhosData,
    caldos: caldosData,
    diversos: diversosData
  };

  for (const [catId, arr] of Object.entries(map)) {
    arr.forEach((item, idx) => {
      initialData.push({
        id: `${catId}_${idx}_${Date.now()}`,
        categoryId: catId,
        name: item.name,
        type: item.type,
        embalagem: item.embalagem || []
      });
    });
  }
  
  saveProducts(initialData);
  return initialData;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, 'id'>) {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  saveProducts(products);
}

export function updateProduct(product: Product) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
    saveProducts(products);
  }
}

export function deleteProduct(id: string) {
  const products = getProducts();
  const updated = products.filter(p => p.id !== id);
  saveProducts(updated);
}
