import React, { useState, useEffect } from 'react';
import { getResellers, addReseller, updateReseller, deleteReseller, Reseller } from '../services/resellers';
import { getAdminUsers, saveAdminUsers, AdminUser } from '../services/auth';
import { getProducts, addProduct, updateProduct, deleteProduct, Product } from '../services/products';
import { ChevronLeft, Edit, Trash2, LogOut, Users, MapPin, Eye, EyeOff, Package, Layers } from 'lucide-react';
import AdminAuth from './AdminAuth';
import { getCategories, addCategory, updateCategory, deleteCategory, ProductCategory } from '../services/categories';

export default function AdminPage({ onBack }: { onBack: () => void }) {
  const [loggedInUser, setLoggedInUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'resellers' | 'users' | 'products' | 'categories'>('resellers');
  
  // Resellers State
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Reseller, 'id'>>({
    state: '', stateName: '', city: '', name: '', address: '', googleMapsLink: '', phone: ''
  });

  // Users State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState<Omit<AdminUser, 'id'> & { confirmPasswordStr?: string }>({
    name: '', email: '', phone: '', passwordStr: '', isMaster: false, confirmPasswordStr: ''
  });
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showUserConfirmPassword, setShowUserConfirmPassword] = useState(false);
  const [userErrorMsg, setUserErrorMsg] = useState('');

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productCatFilter, setProductCatFilter] = useState('massas');
  const [productFormData, setProductFormData] = useState<Omit<Product, 'id'>>({
    categoryId: 'massas', name: '', type: '', embalagem: []
  });
  const [embalagemStr, setEmbalagemStr] = useState('');

  // Categories State
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState<Omit<ProductCategory, 'id'>>({
    title: '', image: ''
  });

  useEffect(() => {
    if (loggedInUser) {
      setResellers(getResellers());
      setProducts(getProducts());
      setCategories(getCategories());
      if (loggedInUser.isMaster) {
        setAdminUsers(getAdminUsers());
      }
    }
  }, [loggedInUser]);

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSaveReseller = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateReseller({ ...formData, id: editingId });
    } else {
      addReseller(formData);
    }
    setResellers(getResellers());
    setEditingId(null);
    setFormData({ state: '', stateName: '', city: '', name: '', address: '', googleMapsLink: '', phone: '' });
  };

  const startEditReseller = (r: Reseller) => {
    setEditingId(r.id);
    setFormData(r);
  };

  const handleDeleteReseller = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta revenda?')) {
      deleteReseller(id);
      setResellers(getResellers());
    }
  };

  // --- Users Handlers ---
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserErrorMsg('');
    
    // Only validate password constraint if creating a new user or explicitly changing password
    if (!editingUserId || userFormData.passwordStr) {
      if (userFormData.passwordStr !== userFormData.confirmPasswordStr) {
        setUserErrorMsg('As senhas não coincidem.');
        return;
      }
      if (!validatePassword(userFormData.passwordStr)) {
        setUserErrorMsg('A senha deve conter no mínimo 8 caracteres, letras, números e símbolos.');
        return;
      }
    }
    
    let allUsers = getAdminUsers();
    
    if (editingUserId) {
      // check email unique
      const existing = allUsers.find(u => u.email === userFormData.email && u.id !== editingUserId);
      if (existing) {
        setUserErrorMsg('Este e-mail já está em uso.');
        return;
      }
      const idx = allUsers.findIndex(u => u.id === editingUserId);
      if (idx >= 0) {
        const uToSave = { ...userFormData, id: editingUserId };
        delete uToSave.confirmPasswordStr;
        if (!uToSave.passwordStr) {
          uToSave.passwordStr = allUsers[idx].passwordStr;
        }
        allUsers[idx] = uToSave as AdminUser;
      }
    } else {
      const existing = allUsers.find(u => u.email === userFormData.email);
      if (existing) {
        setUserErrorMsg('Este e-mail já está em uso.');
        return;
      }
      const newUser = { ...userFormData, id: Date.now().toString() };
      delete newUser.confirmPasswordStr;
      allUsers.push(newUser as AdminUser);
    }
    
    saveAdminUsers(allUsers);
    setAdminUsers(allUsers);
    setEditingUserId(null);
    setUserFormData({ name: '', email: '', phone: '', passwordStr: '', isMaster: false, confirmPasswordStr: '' });
  };

  const startEditUser = (u: AdminUser) => {
    setEditingUserId(u.id);
    setUserFormData({ name: u.name, email: u.email, phone: u.phone, passwordStr: '', isMaster: u.isMaster, confirmPasswordStr: '' });
  };

  const handleDeleteUser = (id: string) => {
    if (id === loggedInUser?.id) {
      alert('Você não pode excluir a si mesmo.');
      return;
    }
    if (window.confirm('Excluir este usuário permanentemente?')) {
      let allUsers = getAdminUsers();
      allUsers = allUsers.filter(u => u.id !== id);
      saveAdminUsers(allUsers);
      setAdminUsers(allUsers);
    }
  };

  // --- Products Handlers ---
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const embalagemArray = embalagemStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const prodToSave = { ...productFormData, embalagem: embalagemArray };
    
    if (editingProductId) {
      updateProduct({ ...prodToSave, id: editingProductId });
    } else {
      addProduct(prodToSave);
    }
    setProducts(getProducts());
    setEditingProductId(null);
    setProductFormData({ categoryId: productCatFilter, name: '', type: '', embalagem: [] });
    setEmbalagemStr('');
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductFormData({ categoryId: p.categoryId, name: p.name, type: p.type, embalagem: p.embalagem });
    setEmbalagemStr(p.embalagem.join(', '));
    setProductCatFilter(p.categoryId);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  // --- Categories Handlers ---
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCatId) {
      updateCategory({ ...catFormData, id: editingCatId });
    } else {
      addCategory(catFormData);
    }
    setCategories(getCategories());
    setEditingCatId(null);
    setCatFormData({ title: '', image: '' });
  };

  const startEditCategory = (c: ProductCategory) => {
    setEditingCatId(c.id);
    setCatFormData({ title: c.title, image: c.image });
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Atenção: Excluir uma linha de produtos não exclui os produtos dentro dela. Tem certeza?')) {
      deleteCategory(id);
      setCategories(getCategories());
      setProducts(getProducts()); // optional refresh
    }
  };

  if (!loggedInUser) {
    return <AdminAuth onLogin={setLoggedInUser} onBack={onBack} />;
  }

  return (
    <div className="admin-page" style={{ padding: '40px 20px', minHeight: '100vh', background: '#faf9f5' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <button className="btn-link" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ChevronLeft size={20} /> Voltar ao Site
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Olá, <strong>{loggedInUser.name}</strong></span>
            <button onClick={() => setLoggedInUser(null)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', fontSize: '13px' }}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>

        <div style={{ background: '#FFF', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
            <button 
              onClick={() => setActiveTab('resellers')} 
              style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', color: activeTab === 'resellers' ? '#8B4513' : '#666', borderBottom: activeTab === 'resellers' ? '2px solid #8B4513' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <MapPin size={20} /> Lojas e Parceiros
            </button>
            <button 
              onClick={() => setActiveTab('products')} 
              style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', color: activeTab === 'products' ? '#8B4513' : '#666', borderBottom: activeTab === 'products' ? '2px solid #8B4513' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Package size={20} /> Gestão de Produtos
            </button>
            <button 
              onClick={() => setActiveTab('categories')} 
              style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', color: activeTab === 'categories' ? '#8B4513' : '#666', borderBottom: activeTab === 'categories' ? '2px solid #8B4513' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Layers size={20} /> Linhas de Produtos
            </button>
            {loggedInUser.isMaster && (
              <button 
                onClick={() => setActiveTab('users')} 
                style={{ background: 'none', border: 'none', padding: '10px 20px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', color: activeTab === 'users' ? '#8B4513' : '#666', borderBottom: activeTab === 'users' ? '2px solid #8B4513' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Users size={20} /> Usuários (Administradores)
              </button>
            )}
          </div>

          {activeTab === 'resellers' && (
            <div className="admin-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
              <div className="admin-form-panel">
                <h3 style={{ marginBottom: '20px', color: '#1A1A1A' }}>{editingId ? 'Editar Parceiro' : 'Novo Parceiro'}</h3>
                <form onSubmit={handleSaveReseller} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label>Estado (Sigla - Ex: SP)</label>
                    <input required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value.toUpperCase()})} maxLength={2} placeholder="SP" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Nome do Estado</label>
                    <input required value={formData.stateName} onChange={e => setFormData({...formData, stateName: e.target.value})} placeholder="São Paulo" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Cidade</label>
                    <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Ribeirão Preto" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Nome do Parceiro</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Empório XYZ" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Endereço Completo</label>
                    <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Rua 123" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Link Google Maps</label>
                    <input required type="url" value={formData.googleMapsLink} onChange={e => setFormData({...formData, googleMapsLink: e.target.value})} placeholder="https://..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp (Somente números)</label>
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} placeholder="5516999999999" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
                    {editingId ? 'Salvar Alterações' : 'Cadastrar'}
                  </button>
                  {editingId && <button type="button" className="btn-link" onClick={() => { setEditingId(null); setFormData({state: '', stateName: '', city: '', name: '', address: '', googleMapsLink: '', phone: ''}); }} style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>Cancelar Edição</button>}
                </form>
              </div>

              <div className="admin-list-panel">
                <h3 style={{ marginBottom: '20px', color: '#1A1A1A' }}>Parceiros Cadastrados</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {resellers.length === 0 && <p style={{ color: '#666' }}>Nenhum parceiro cadastrado.</p>}
                  {resellers.map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <div>
                        <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>{r.name}</strong> <span style={{ color: '#888', fontSize: '13px' }}>- {r.city}/{r.state}</span>
                        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#555' }}>{r.address}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={() => startEditReseller(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#666' }}><Edit size={20} /></button>
                        <button type="button" onClick={() => handleDeleteReseller(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#d32f2f' }}><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
              <div className="admin-form-panel">
                <h3 style={{ marginBottom: '20px', color: '#1A1A1A' }}>{editingProductId ? 'Editar Produto' : 'Novo Produto'}</h3>
                <form onSubmit={handleSaveProduct} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label>Linha de Produto</label>
                    <select required value={productFormData.categoryId} onChange={e => { setProductFormData({...productFormData, categoryId: e.target.value}); setProductCatFilter(e.target.value); }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nome do Produto (Sabor - Ex: Lasanha 4 Queijos)</label>
                    <input required value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} placeholder="Nome do produto" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Tipo (Ex: Lasanha, Rondelli)</label>
                    <input required value={productFormData.type} onChange={e => setProductFormData({...productFormData, type: e.target.value})} placeholder="Tipo do produto" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Unidades de Venda / Embalagens (Separadas por vírgula. Ex: 900g, 450g)</label>
                    <input required value={embalagemStr} onChange={e => setEmbalagemStr(e.target.value)} placeholder="Ex: 900g, 450g" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
                    {editingProductId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                  </button>
                  {editingProductId && <button type="button" className="btn-link" onClick={() => { setEditingProductId(null); setProductFormData({categoryId: productCatFilter, name: '', type: '', embalagem: []}); setEmbalagemStr(''); }} style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>Cancelar Edição</button>}
                </form>
              </div>

              <div className="admin-list-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#1A1A1A' }}>Produtos Cadastrados</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Filtrar Linha:</span>
                    <select value={productCatFilter} onChange={e => setProductCatFilter(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {products.filter(p => p.categoryId === productCatFilter).length === 0 && (
                    <p style={{ color: '#666' }}>Nenhum produto cadastrado nesta linha.</p>
                  )}
                  {products.filter(p => p.categoryId === productCatFilter).map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>{p.name}</strong>
                          <span style={{ background: '#e0d5b0', color: '#8B4513', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{p.type}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Embalagens: {p.embalagem.join(', ')}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginLeft: '15px' }}>
                        <button type="button" onClick={() => startEditProduct(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#666' }}><Edit size={20} /></button>
                        <button type="button" onClick={() => handleDeleteProduct(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#d32f2f' }}><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="admin-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
              <div className="admin-form-panel">
                <h3 style={{ marginBottom: '20px', color: '#1A1A1A' }}>{editingCatId ? 'Editar Linha' : 'Nova Linha'}</h3>
                <form onSubmit={handleSaveCategory} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label>Título da Linha</label>
                    <input required value={catFormData.title} onChange={e => setCatFormData({...catFormData, title: e.target.value})} placeholder="Ex: Congelados Premium" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Imagem (URL)</label>
                    <input required type="url" value={catFormData.image} onChange={e => setCatFormData({...catFormData, image: e.target.value})} placeholder="https://..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
                    {editingCatId ? 'Salvar Alterações' : 'Cadastrar Linha'}
                  </button>
                  {editingCatId && <button type="button" className="btn-link" onClick={() => { setEditingCatId(null); setCatFormData({title: '', image: ''}); }} style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>Cancelar Edição</button>}
                </form>
              </div>

              <div className="admin-list-panel">
                <h3 style={{ marginBottom: '20px', color: '#1A1A1A' }}>Linhas de Produtos Cadastradas</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {categories.length === 0 && <p style={{ color: '#666' }}>Nenhuma linha cadastrada.</p>}
                  {categories.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                        <img src={c.image} alt={c.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>{c.title}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginLeft: '15px' }}>
                        <button type="button" onClick={() => startEditCategory(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#666' }}><Edit size={20} /></button>
                        <button type="button" onClick={() => handleDeleteCategory(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#d32f2f' }}><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && loggedInUser.isMaster && (
            <div className="admin-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
              <div className="admin-form-panel">
                <h3 style={{ marginBottom: '10px', color: '#1A1A1A' }}>{editingUserId ? 'Editar Usuário' : 'Novo Administrador'}</h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Pré-cadastre os usuários que terão acesso à plataforma.</p>
                
                {userErrorMsg && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>{userErrorMsg}</div>}

                <form onSubmit={handleSaveUser} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input required value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input required value={userFormData.phone} onChange={e => setUserFormData({...userFormData, phone: e.target.value.replace(/\D/g, '')})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>E-mail (Usado no Login)</label>
                    <input required type="email" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                  </div>
                  <div className="form-group">
                    <label>{editingUserId ? 'Nova Senha' : 'Senha Inicial'} (Mín. 8 caracteres, letras, números, símbolos)</label>
                    <div style={{ position: 'relative' }}>
                      <input required={!editingUserId} type={showUserPassword ? "text" : "password"} value={userFormData.passwordStr} onChange={e => setUserFormData({...userFormData, passwordStr: e.target.value})} style={{ width: '100%', padding: '10px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #ccc' }} />
                      <button type="button" onClick={() => setShowUserPassword(!showUserPassword)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                        {showUserPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {editingUserId && <small style={{ color: '#777', display: 'block', marginTop: '4px' }}>Deixe vazio para não alterar</small>}
                  </div>
                  {(!editingUserId || userFormData.passwordStr) && (
                    <div className="form-group">
                      <label>Confirmar Senha</label>
                      <div style={{ position: 'relative' }}>
                        <input required type={showUserConfirmPassword ? "text" : "password"} value={userFormData.confirmPasswordStr || ''} onChange={e => setUserFormData({...userFormData, confirmPasswordStr: e.target.value})} style={{ width: '100%', padding: '10px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #ccc' }} />
                        <button type="button" onClick={() => setShowUserConfirmPassword(!showUserConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                          {showUserConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <input type="checkbox" id="isMaster" checked={userFormData.isMaster} onChange={e => setUserFormData({...userFormData, isMaster: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                    <label htmlFor="isMaster" style={{ margin: 0, fontWeight: 600, cursor: 'pointer' }}>Acesso Master</label>
                  </div>
                  <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
                    {editingUserId ? 'Salvar Edição' : 'Cadastrar Usuário'}
                  </button>
                  {editingUserId && <button type="button" className="btn-link" onClick={() => { setEditingUserId(null); setUserFormData({name: '', email: '', phone: '', passwordStr: '', isMaster: false, confirmPasswordStr: ''}); setUserErrorMsg(''); }} style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>Cancelar Edição</button>}
                </form>
              </div>

              <div className="admin-list-panel">
                <h3 style={{ marginBottom: '20px', color: '#1A1A1A' }}>Usuários Cadastrados</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {adminUsers.filter(u => u.id !== loggedInUser.id).length === 0 && adminUsers.length === 1 && (
                    <p style={{ color: '#666' }}>Apenas você está cadastrado.</p>
                  )}
                  {adminUsers.map(u => (
                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <div>
                        <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>{u.name} {u.id === loggedInUser.id && '(Você)'}</strong>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                          <span style={{ background: u.isMaster ? '#ffebee' : '#e3f2fd', color: u.isMaster ? '#c62828' : '#1565c0', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{u.isMaster ? 'Master' : 'Admin'}</span>
                          <span style={{ fontSize: '13px', color: '#666' }}>{u.email}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={() => startEditUser(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#666' }}><Edit size={20} /></button>
                        {u.id !== loggedInUser.id && (
                          <button type="button" onClick={() => handleDeleteUser(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#d32f2f' }}><Trash2 size={20} /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
