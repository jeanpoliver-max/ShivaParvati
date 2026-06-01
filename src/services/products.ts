import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { massasData, pizzasData, tortasData, molhosData, caldosData, diversosData } from '../data';

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  type: string;
  embalagem: string[];
}

const getCollection = () => collection(db, 'products');

export async function getProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(getCollection());
    const order = ['massas', 'pizzas', 'tortas', 'molhos', 'caldos', 'diversos'];
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    docs.sort((a, b) => {
      const getOrderIndex = (cat: any) => {
        const title = cat.title ? String(cat.title).toLowerCase() : '';
        const categoryId = cat.categoryId ? String(cat.categoryId).toLowerCase() : '';
        const id = cat.id ? String(cat.id).toLowerCase() : '';
        for (let i = 0; i < order.length; i++) {
          if (title.includes(order[i]) || categoryId.includes(order[i]) || id.includes(order[i])) {
            return i;
          }
        }
        return 999;
      };
      return getOrderIndex(a) - getOrderIndex(b);
    });
    return docs;
  } catch (e) {
    console.error('Error getting products', e);
    return [];
  }
}

export async function addProduct(product: Omit<Product, 'id'>) {
  await addDoc(getCollection(), product);
}

export async function updateProduct(product: Product) {
  const docRef = doc(db, 'products', product.id);
  const { id, ...data } = product;
  await updateDoc(docRef, data);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}

