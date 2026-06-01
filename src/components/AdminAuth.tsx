import React, { useState } from 'react';
import { ChevronLeft, Lock } from 'lucide-react';
import { AdminUser, authLoginGoogle } from '../services/auth';

export default function AdminAuth({ onLogin, onBack }: { onLogin: (user: AdminUser) => void, onBack: () => void }) {
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      const user = await authLoginGoogle();
      if (user) {
        onLogin(user);
      } else {
        setErrorMsg('Autenticação falhou ou sem permissão. Certifique-se de que seu email está liberado.');
      }
    } catch (e: any) {
      setErrorMsg('Erro: ' + (e.message || 'Falha ao autenticar. Se estiver no editor, tente abrir o site em uma nova aba.'));
    }
  };

  return (
    <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ background: '#FFF', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        <button className="btn-link" onClick={onBack} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
          <ChevronLeft size={18} /> Voltar ao site
        </button>  

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Lock size={48} color="#8B4513" style={{ margin: '0 auto 10px' }} />
          <h2 style={{ color: '#1A1A1A' }}>Acesso Restrito</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Área Administrativa Shiva Parvati (Requer Google Auth para Firebase)</p>
          {window.self !== window.top && (
            <div style={{ marginTop: '15px', color: '#e65100', background: '#fff3e0', padding: '10px', borderRadius: '8px', fontSize: '13px', textAlign: 'left' }}>
              <strong>Aviso:</strong> Você está no modo de pré-visualização. Para conseguir acessar com o Google, você precisará abrir o aplicativo em uma nova aba primeiro.
            </div>
          )}
        </div>
        
        {errorMsg && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{errorMsg}</div>}

        <button onClick={handleGoogleLogin} className="btn-whatsapp-order" style={{ width: '100%', padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#4285F4' }}>
          Entrar com Conta Google
        </button>
      </div>
    </div>
  );
}
