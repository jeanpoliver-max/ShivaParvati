import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth, provider, db } from '../firebase';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordStr?: string;
  isMaster: boolean;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const snap = await getDocs(collection(db, 'adminUsers'));
    return snap.docs.map(d => d.data() as AdminUser);
  } catch(e) {
    console.error('Error fetching admin users', e);
    return [];
  }
}

export async function saveAdminUsers(users: AdminUser[]) {
  for (const user of users) {
    if (user.email) {
      await setDoc(doc(db, 'adminUsers', user.email), user);
    }
  }
}

export async function authLoginGoogle(): Promise<AdminUser | null> {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user is in admin list
    const admins = await getAdminUsers();
    
    // Initial master setup
    if (admins.length === 0 || user.email === 'jeanp.oliver@gmail.com') {
      const newAdmin: AdminUser = {
        id: user.uid,
        name: user.displayName || 'Master Admin',
        email: user.email || '',
        phone: '',
        isMaster: true
      };
      await saveAdminUsers([newAdmin]);
      return newAdmin; // Logged in
    }
    
    const existingAdmin = admins.find(a => a.email === user.email);
    if (existingAdmin) {
      return existingAdmin;
    } else {
      await authSignOut();
      alert('Seu email não tem permissão de administrador.');
      return null;
    }
  } catch (e: any) {
    console.error('Login error', e);
    throw e;
  }
}

export async function authSignOut() {
  await signOut(auth);
}

