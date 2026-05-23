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

const STORAGE_KEY = 'shiva_parvati_resellers';

export function getResellers(): Reseller[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const initial = resellersData.map((r, i) => ({
    ...r,
    id: `reseller_${i}`,
    googleMapsLink: `https://maps.google.com/?q=${encodeURIComponent(r.address + ', ' + r.city + ', ' + r.state)}`
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function addReseller(reseller: Omit<Reseller, 'id'>) {
  const all = getResellers();
  const newReseller = { ...reseller, id: Date.now().toString() };
  all.push(newReseller);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function updateReseller(reseller: Reseller) {
  const all = getResellers();
  const idx = all.findIndex(r => r.id === reseller.id);
  if (idx >= 0) {
    all[idx] = reseller;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

export function deleteReseller(id: string) {
  const all = getResellers();
  const filtered = all.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
