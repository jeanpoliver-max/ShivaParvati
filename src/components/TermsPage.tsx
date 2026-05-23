import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage({ onBack }: { onBack: () => void }) {
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
          <h1 style={{ color: '#8B4513', marginBottom: '20px', fontSize: '32px' }}>Termos & Condições</h1>
          <p style={{ color: '#555', marginBottom: '20px' }}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <div style={{ color: '#333', lineHeight: '1.7' }}>
            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>1. Introdução</h3>
            <p style={{ marginBottom: '16px' }}>Bem-vindo à Shiva Parvati. Estes Termos & Condições regulam o uso do nosso site e a compra de nossos produtos alimentícios artesanais. Ao acessar ou usar nosso site, você concorda em cumprir e estar vinculado a estes termos.</p>
            
            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>2. Produtos e Pedidos</h3>
            <p style={{ marginBottom: '16px' }}>Nossos produtos são fabricados de forma artesanal e ultracongelados para manter a máxima qualidade. As imagens apresentadas no site são ilustrativas. Os pedidos realizados estão sujeitos à disponibilidade de estoque. Reservamo-nos o direito de limitar as quantidades de quaisquer produtos ou serviços que oferecemos.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>3. Preços e Pagamentos</h3>
            <p style={{ marginBottom: '16px' }}>Os preços dos nossos produtos estão sujeitos a alterações sem aviso prévio. As formas de pagamento disponíveis serão informadas no momento da finalização do pedido, que geralmente é realizado diretamente através dos nossos canais de atendimento (WhatsApp) ou revendedores.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>4. Entrega e Retirada</h3>
            <p style={{ marginBottom: '16px' }}>Os prazos e taxas de entrega variam conforme a localização e serão informados durante o processo de compra via WhatsApp. É responsabilidade do cliente fornecer um endereço correto e ter alguém disponível para receber e armazenar os produtos adequadamente (no freezer) no momento da entrega.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>5. Política de Trocas e Devoluções</h3>
            <p style={{ marginBottom: '16px' }}>Por se tratarem de produtos alimentícios perecíveis e congelados, trocas ou devoluções só serão aceitas em caso de defeito de fabricação ou produto em desacordo com o pedido, devendo o cliente nos contatar imediatamente após o recebimento.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>6. Propriedade Intelectual</h3>
            <p style={{ marginBottom: '16px' }}>Todo o conteúdo deste site, incluindo logotipos, textos, imagens e design, é de propriedade exclusiva da Shiva Parvati e é protegido pelas leis de direitos autorais.</p>

            <h3 style={{ marginTop: '20px', color: '#D4AF37' }}>7. Contato</h3>
            <p style={{ marginBottom: '16px' }}>Para dúvidas, sugestões ou reclamações sobre estes Termos & Condições, entre em contato conosco através do e-mail contato@shivaparvati.com.br ou pelo WhatsApp (16) 99709-0967.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
