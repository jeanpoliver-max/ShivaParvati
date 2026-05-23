import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Mail, User, Phone, Eye, EyeOff } from 'lucide-react';
import { getAdminUsers, saveAdminUsers, authLogin, authResetPassword, AdminUser } from '../services/auth';

export default function AdminAuth({ onLogin, onBack }: { onLogin: (user: AdminUser) => void, onBack: () => void }) {
  const [hasUsers, setHasUsers] = useState(false);
  const [view, setView] = useState<'login' | 'setup_master' | 'forgot_password'>('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resetWhatsappLink, setResetWhatsappLink] = useState('');

  useEffect(() => {
    const users = getAdminUsers();
    if (users.length === 0) {
      setView('setup_master');
      setHasUsers(false);
    } else {
      setHasUsers(true);
      setView('login');
    }
  }, []);

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSetupMaster = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    if (!validatePassword(password)) {
      setErrorMsg('A senha deve conter no mínimo 8 caracteres, incluindo letras, números e símbolos.');
      return;
    }
    const newUser: AdminUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      passwordStr: password,
      isMaster: true
    };
    saveAdminUsers([newUser]);
    onLogin(newUser);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const user = authLogin(email, password);
    if (user) {
      onLogin(user);
    } else {
      setErrorMsg('E-mail ou senha incorretos.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setResetWhatsappLink('');
    const result = authResetPassword(email);
    if (result.success && result.phone && result.passwordMsg) {
      setSuccessMsg('Usuário encontrado! Clique no botão abaixo para receber sua senha via WhatsApp.');
      const link = `https://wa.me/${result.phone}?text=${encodeURIComponent(result.passwordMsg)}`;
      setResetWhatsappLink(link);
    } else {
      setErrorMsg('E-mail não encontrado na base de dados.');
    }
  };

  return (
    <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ background: '#FFF', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        <button className="btn-link" onClick={onBack} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
          <ChevronLeft size={18} /> Voltar ao site
        </button>  
        
        {view === 'setup_master' && (
          <div>
            <h2 style={{ color: '#8B4513', marginBottom: '10px' }}>Primeiro Acesso</h2>
            <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>Cadastre os dados do Administrador Master para inicializar o sistema de gestão.</p>
            {errorMsg && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{errorMsg}</div>}
            
            <form onSubmit={handleSetupMaster} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>Nome Completo</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>Telefone</label>
                <input required type="text" value={phone} onChange={e => setPhone(e.target.value.replace(/\\D/g, ''))} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }} placeholder="Apenas números" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>E-mail</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>Senha (Mín. 8 caracteres, números, letras e símbolos)</label>
                <div style={{ position: 'relative' }}>
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', paddingRight: '40px', border: '1px solid #ccc', borderRadius: '8px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>Confirmar Senha</label>
                <div style={{ position: 'relative' }}>
                  <input required type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '12px', paddingRight: '40px', border: '1px solid #ccc', borderRadius: '8px' }} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Cadastrar Master</button>
            </form>
          </div>
        )}

        {view === 'login' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Lock size={48} color="#8B4513" style={{ margin: '0 auto 10px' }} />
              <h2 style={{ color: '#1A1A1A' }}>Acesso Restrito</h2>
              <p style={{ color: '#666', fontSize: '14px' }}>Área Administrativa Shiva Parvati</p>
            </div>
            
            {errorMsg && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{errorMsg}</div>}
            {successMsg && <div style={{ color: '#2e7d32', background: '#e8f5e9', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{successMsg}</div>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>E-mail</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', paddingRight: '40px', border: '1px solid #ccc', borderRadius: '8px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => { setView('forgot_password'); setErrorMsg(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: '#8B4513', fontSize: '13px', textAlign: 'right', cursor: 'pointer', textDecoration: 'underline' }}>Esqueci minha senha</button>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Entrar</button>
            </form>
          </div>
        )}

        {view === 'forgot_password' && (
          <div>
            <h2 style={{ color: '#1A1A1A', marginBottom: '10px' }}>Recuperar Senha</h2>
            <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>Informe seu e-mail pré-cadastrado para enviarmos sua senha de acesso.</p>
            
            {errorMsg && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{errorMsg}</div>}
            {successMsg && <div style={{ color: '#2e7d32', background: '#e8f5e9', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{successMsg}</div>}
            {resetWhatsappLink && (
              <a href={resetWhatsappLink} target="_blank" rel="noreferrer" className="btn btn-whatsapp-order" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                Receber Senha no WhatsApp
              </a>
            )}

            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>E-mail cadastrado</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }} />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Enviar Senha</button>
              <button type="button" onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#666', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }}>Voltar para o Login</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
