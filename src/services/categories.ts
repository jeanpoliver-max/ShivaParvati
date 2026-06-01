import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface ProductCategory {
  id: string;
  title: string;
  image: string; // we'll use a string or imported image
}

const getCollection = () => collection(db, 'categories');

export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const snapshot = await getDocs(getCollection());
    const order = ['massas', 'pizzas', 'tortas', 'molhos', 'caldos', 'diversos'];
    const docs = snapshot.docs.map(doc => {
      const data = { id: doc.id, ...doc.data() } as ProductCategory;
      const titleLower = (data.title || '').toLowerCase();
      if (titleLower.includes('massas')) data.image = 'https://i.imgur.com/DBYlaZy.png';
      else if (titleLower.includes('pizzas')) data.image = 'https://i.imgur.com/Pyx1ruw.png';
      else if (titleLower.includes('tortas')) data.image = 'https://i.imgur.com/Ja880kG.png';
      else if (titleLower.includes('molhos')) data.image = 'https://i.imgur.com/5OsSKQt.png';
      else if (titleLower.includes('caldos')) data.image = 'https://i.imgur.com/KwVS48e.png';
      else if (titleLower.includes('diversos')) data.image = 'https://i.imgur.com/f0Vr0rR.png';
      return data;
    });
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
    console.error('Error getting categories', e);
    return [];
  }
}

export async function addCategory(category: Omit<ProductCategory, 'id'>) {
  await addDoc(getCollection(), category);
}

export async function updateCategory(category: ProductCategory) {
  const docRef = doc(db, 'categories', category.id);
  const { id, ...data } = category;
  await updateDoc(docRef, data);
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, 'categories', id));
}
