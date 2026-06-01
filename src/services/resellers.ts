import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { resellersData } from '../data';

export interface Reseller {
  id: string;
  state: string;
  stateName: string;
  city: string;
  name: string;
  address: string;
  googleMapsLink: string;
  phone: string;
}

const getCollection = () => collection(db, 'resellers');

export async function getResellers(): Promise<Reseller[]> {
  try {
    const snapshot = await getDocs(getCollection());
    const resellers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reseller));
    return resellers.sort((a, b) => {
      const cityComparison = a.city.localeCompare(b.city);
      if (cityComparison !== 0) {
        return cityComparison;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (e) {
    console.error('Error getting resellers', e);
    return [];
  }
}

export async function addReseller(reseller: Omit<Reseller, 'id'>) {
  await addDoc(getCollection(), reseller);
}

export async function updateReseller(reseller: Reseller) {
  const docRef = doc(db, 'resellers', reseller.id);
  const { id, ...data } = reseller;
  await updateDoc(docRef, data);
}

export async function deleteReseller(id: string) {
  await deleteDoc(doc(db, 'resellers', id));
}

