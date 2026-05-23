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

const CATEGORIES_KEY = 'shiva_parvati_categories_v1';

export function getCategories(): ProductCategory[] {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initial fallback data
  const initialData: ProductCategory[] = [
    { id: 'massas', title: 'Massas', image: catMassas },
    { id: 'pizzas', title: 'Pizzas', image: catPizzas },
    { id: 'tortas', title: 'Tortas', image: catTortas },
    { id: 'molhos', title: 'Molhos', image: catMolhos },
    { id: 'caldos', title: 'Caldos', image: catCaldos },
    { id: 'diversos', title: 'Diversos', image: catDiversos }
  ];
  saveCategories(initialData);
  return initialData;
}

export function saveCategories(categories: ProductCategory[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function addCategory(category: Omit<ProductCategory, 'id'>) {
  const categories = getCategories();
  const id = Date.now().toString();
  categories.push({ ...category, id });
  saveCategories(categories);
}

export function updateCategory(category: ProductCategory) {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
    saveCategories(categories);
  }
}

export function deleteCategory(id: string) {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  saveCategories(filtered);
}
