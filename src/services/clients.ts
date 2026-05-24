export interface Client {
  id: string;
  name: string;
  phone: string;
  date: string;
  latitude: number | null;
  longitude: number | null;
  city?: string;
}

export function getClients(): Client[] {
  const data = localStorage.getItem('shiva_clients');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveClients(clients: Client[]): void {
  localStorage.setItem('shiva_clients', JSON.stringify(clients));
}

export function addClient(client: Omit<Client, 'id'>): Client {
  const clients = getClients();
  const newClient = { ...client, id: Date.now().toString() };
  clients.push(newClient);
  saveClients(clients);
  return newClient;
}

export function deleteClient(id: string): void {
  const clients = getClients();
  saveClients(clients.filter(c => c.id !== id));
}

export function updateClient(updated: Client): void {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === updated.id);
  if (index !== -1) {
    clients[index] = updated;
    saveClients(clients);
  }
}
