import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import catMassas from '../assets/images/rondelli_bolonhesa_1779487429390.png';
import catPizzas from '../assets/images/pizza_artesanal_1779498365848.png';
import catTortas from '../assets/images/torta_salgada_1779498396152.png';
import catMolhos from '../assets/images/molhos_artesanais_1779498411741.png';
import catCaldos from '../assets/images/caldos_cremes_1779498426041.png';
import catDiversos from '../assets/images/diversos_paes_doces_1779498440884.png';

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
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductCategory));
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
