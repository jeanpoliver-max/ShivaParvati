import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPage({ onBack }: { onBack: () => void }) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', background: '#f8f4e8', paddingBottom: '60px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        <button className="back-btn" style={{ position: 'relative', top: 'auto', left: 'auto', background: '#8B4513', border: 'none', marginBottom: '30px' }} onClick={onBack}>
          <ChevronLeft size={24} /> Voltar
        </button>
        
        <div style={{ background: '#FFF', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <h1 style={{ color: '#8B4513', marginBottom: '20px', fontSize: '32px' }}>Políticas de Privacidade</h1>
          <p style={{ color: '#555', marginBottom: '20px' }}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <div style={{ color: '#333', lineHeight: '1.7' }}>
            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>1. Introdução</h3>
            <p style={{ marginBottom: '16px' }}>A Shiva Parvati valoriza a privacidade dos seus clientes. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações pessoais ao utilizar nosso site e serviços.</p>
            
            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>2. Coleta de Informações</h3>
            <p style={{ marginBottom: '16px' }}>Podemos coletar informações pessoais que você nos fornece voluntariamente, como nome, e-mail, telefone e endereço, quando você preenche formulários de contato, assina nossa newsletter ou interage através de nossos canais de atendimento, como o WhatsApp.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>3. Uso das Informações</h3>
            <p style={{ marginBottom: '16px' }}>Utilizamos suas informações para responder às suas solicitações, processar pedidos (quando aplicável), enviar atualizações sobre nossos produtos, ofertas especiais e para melhorar a sua experiência em nosso site.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>4. Compartilhamento de Informações</h3>
            <p style={{ marginBottom: '16px' }}>Não vendemos, trocamos ou alugamos suas informações pessoais para terceiros. Podemos compartilhar seus dados com parceiros de serviços confiáveis (como empresas de logística ou plataformas de pagamento) apenas quando estritamente necessário para a prestação dos nossos serviços.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>5. Segurança dos Dados</h3>
            <p style={{ marginBottom: '16px' }}>Adotamos medidas de segurança apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet é 100% seguro.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>6. Cookies e Tecnologias de Rastreamento</h3>
            <p style={{ marginBottom: '16px' }}>Nosso site pode utilizar "cookies" para melhorar a experiência do usuário. Você pode configurar seu navegador para recusar todos os cookies ou indicar quando um cookie está sendo enviado.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>7. Seus Direitos</h3>
            <p style={{ marginBottom: '16px' }}>Você tem o direito de solicitar o acesso, correção, atualização ou exclusão das suas informações pessoais em nossa base de dados. Para exercer esses direitos, entre em contato conosco.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>8. Alterações nesta Política</h3>
            <p style={{ marginBottom: '16px' }}>Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você revise esta página regularmente para estar ciente de quaisquer modificações.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>9. Contato</h3>
            <p style={{ marginBottom: '16px' }}>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail contato@shivaparvati.com.br ou através do nosso telefone/WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
