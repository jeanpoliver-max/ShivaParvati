export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordStr: string;
  isMaster: boolean;
}

const USERS_KEY = 'shiva_parvati_admins_v2';

export function getAdminUsers(): AdminUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveAdminUsers(users: AdminUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function authLogin(email: string, passwordStr: string): AdminUser | null {
  const users = getAdminUsers();
  const user = users.find(u => u.email === email && u.passwordStr === passwordStr);
  return user || null;
}

export function authResetPassword(email: string): { success: boolean; phone?: string; passwordMsg?: string } {
  const users = getAdminUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    return {
      success: true,
      phone: user.phone,
      passwordMsg: `Olá ${user.name}, sua senha de acesso ao painel Shiva Parvati é: ${user.passwordStr}`
    };
  }
  return { success: false };
}
