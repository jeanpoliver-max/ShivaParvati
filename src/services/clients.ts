import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface Client {
  id: string;
  name: string;
  phone: string;
  date: string;
  latitude: number | null;
  longitude: number | null;
  city?: string;
}

const getCollection = () => collection(db, 'clients');

export async function getClients(): Promise<Client[]> {
  try {
    const snapshot = await getDocs(getCollection());
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
  } catch (e) {
    console.error("Error getting clients:", e);
    return [];
  }
}

export async function getClientsSync(): Promise<Client[]> {
  // Keeping sync signature for compat, but returning empty or handling async differently if needed 
  // It's better to refactor callers to be async
  return [];
}

export async function addClient(client: Omit<Client, 'id'>): Promise<Client> {
  const docRef = await addDoc(getCollection(), client);
  return { id: docRef.id, ...client };
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, 'clients', id));
}

export async function updateClient(updated: Client): Promise<void> {
  const docRef = doc(db, 'clients', updated.id);
  const { id, ...data } = updated;
  await updateDoc(docRef, data);
}

