import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, X, MapPin, Store, Leaf, ChefHat, Sparkles, ShieldCheck, Clock, Navigation } from 'lucide-react';
import CategoryPage from './components/CategoryPage';
import AdminPage from './components/AdminPage';
import { getResellers, Reseller } from './services/resellers';
import { getProducts, Product } from './services/products';
import { getCategories, ProductCategory } from './services/categories';
import image1 from './assets/images/rondelli_bolonhesa_1779487429390.png';
import image2 from './assets/images/lasanha_rucula_tomate_1779487887471.png';
import image3 from './assets/images/sorrentino_queijo_1779487902156.png';
import image4 from './assets/images/sufioli_queijo_nozes_1779487916700.png';

import catMassas from './assets/images/rondelli_bolonhesa_1779487429390.png';
import catPizzas from './assets/images/pizza_artesanal_1779498365848.png';
import catTortas from './assets/images/torta_salgada_1779498396152.png';
import catMolhos from './assets/images/molhos_artesanais_1779498411741.png';
import catCaldos from './assets/images/caldos_cremes_1779498426041.png';
import catDiversos from './assets/images/diversos_paes_doces_1779498440884.png';

const heroSlides = [
  {
    image: image1,
    title: 'RONDELLI TOMATE SECO QUEIJO',
  },
  {
    image: image2,
    title: 'LASANHA RÚCULA - TOMATE SECO',
  },
  {
    image: image3,
    title: 'SORRENTINO CREME DE QUEIJO',
  },
  {
    image: image4,
    title: 'SUFIOLI QUEIJO NOZES PASSAS',
  }
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);
  const [viewState, setViewState] = useState<'home' | 'category' | 'admin'>('home');
  const [favorites, setFavorites] = useState<{name: string, size: string}[]>([]);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'favorites' | 'locator'>('favorites');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'stateSelect' | 'citySelect' | 'resellerSelect'>('cart');
  const [selectedStateStr, setSelectedStateStr] = useState<string>('');
  const [selectedCityStr, setSelectedCityStr] = useState<string>('');
  const [resellersLocal, setResellersLocal] = useState<Reseller[]>([]);
  const [productsLocal, setProductsLocal] = useState<Product[]>([]);
  const [categoriesLocal, setCategoriesLocal] = useState<ProductCategory[]>([]);

  useEffect(() => {
    setResellersLocal(getResellers());
    setProductsLocal(getProducts());
    const cats = getCategories();
    setCategoriesLocal(cats);
    if (!activeCategory && cats.length > 0) {
      setActiveCategory(cats[0]);
    }
  }, [viewState]);

  const getCategoryCountStr = (catId: string) => {
    const count = productsLocal.filter(p => p.categoryId === catId).length;
    return `${count} Variações de Sabores`;
  };

  const getCategoryItemsStr = (catId: string) => {
    const types = Array.from(new Set(productsLocal.filter(p => p.categoryId === catId).map(p => p.type)));
    return types.join(', ');
  };

  const closeDrawer = () => {
    setIsFavOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
      setSelectedStateStr('');
      setSelectedCityStr('');
    }, 300);
  };

  const availableStates = Array.from(new Set(resellersLocal.map(r => r.state)));
  const availableCities = Array.from(new Set(resellersLocal.filter(r => r.state === selectedStateStr).map(r => r.city)));

  const handleStateClick = (st: string) => {
    setSelectedStateStr(st);
    setCheckoutStep('citySelect');
  };

  const handleCityClick = (city: string) => {
    setSelectedCityStr(city);
    setCheckoutStep('resellerSelect');
  };

  const openLocator = (e: React.MouseEvent) => {
    e.preventDefault();
    setDrawerMode('locator');
    setCheckoutStep('stateSelect');
    setIsFavOpen(true);
  };

  const openFavoritesMenu = () => {
    setDrawerMode('favorites');
    setCheckoutStep('cart');
    setIsFavOpen(true);
  };

  const toggleFavorite = (name: string, size: string) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.name === name && fav.size === size);
      if (exists) {
        return prev.filter(fav => !(fav.name === name && fav.size === size));
      } else {
        return [...prev, { name, size }];
      }
    });
  };

  const createWhatsAppLink = (phone: string) => {
    if (favorites.length === 0) return '#';
    let text = 'Olá! Gostaria de encomendar os seguintes produtos:\n\n';
    favorites.forEach(f => {
      text += `- ${f.name} (${f.size})\n`;
    });
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    if (viewState !== 'home') return;

    // Fade-in ao scroll (interseção)
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // só uma vez
          }
        });
      },
      { threshold: 0.2 }
    );

    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [viewState]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nome = formData.get('nome');
    const telefone = formData.get('telefone');
    const email = formData.get('email');
    const interesse = formData.get('interesse');

    let mensagemInteresse = "";
    if (interesse === "comprar") {
      mensagemInteresse = "Gostaria de comprar os produtos da ShivaParvati";
    } else if (interesse === "trabalhe") {
      mensagemInteresse = "Quero trabalhar com a ShivaParvati";
    } else if (interesse === "parceria") {
      mensagemInteresse = "Quero ser parceiro da ShivaParvati";
    }

    const text = `Olá, meu nome é ${nome}.\nMeu telefone é ${telefone} e e-mail ${email}.\n\n${mensagemInteresse}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/5516997090967?text=${encodedText}`, '_blank');
  };

  const renderFavDrawer = () => {
    if (!isFavOpen) return null;
    return (
      <div className="fav-drawer-overlay" onClick={closeDrawer}>
        <div className="fav-drawer" onClick={e => e.stopPropagation()}>
          <div className="fav-header">
            {drawerMode === 'favorites' && checkoutStep === 'cart' && (
              <h3><Heart fill="#d32f2f" color="#d32f2f" size={20} style={{marginRight: '8px'}} /> Lista de Desejos</h3>
            )}
            {checkoutStep === 'stateSelect' && (
              <h3><MapPin color="#d32f2f" size={20} style={{marginRight: '8px'}} /> Onde você está?</h3>
            )}
            {checkoutStep === 'citySelect' && (
              <h3><MapPin color="#d32f2f" size={20} style={{marginRight: '8px'}} /> Escolha a cidade</h3>
            )}
            {checkoutStep === 'resellerSelect' && (
              <h3><Store color="#d32f2f" size={20} style={{marginRight: '8px'}} /> Lojas em {selectedCityStr}</h3>
            )}
            <button className="close-btn" onClick={closeDrawer}><X size={24} /></button>
          </div>
          <div className="fav-body">
            {drawerMode === 'favorites' && checkoutStep === 'cart' && (
              favorites.length === 0 ? (
                <div className="fav-empty">
                  <ShoppingBag size={48} color="#ccc" />
                  <p>Sua lista de desejos está vazia.</p>
                  <p>Adicione os sabores que mais gostou clicando no coração!</p>
                </div>
              ) : (
                <ul className="fav-list">
                  {favorites.map((fav, i) => (
                    <li key={i}>
                      <div>
                        <strong>{fav.name}</strong>
                        <span>({fav.size})</span>
                      </div>
                      <button onClick={() => toggleFavorite(fav.name, fav.size)}>Remover</button>
                    </li>
                  ))}
                </ul>
              )
            )}
            
            {checkoutStep === 'stateSelect' && (
              <div className="state-select-container">
                <p className="state-instruction">Selecione o estado para buscar a revendedora mais próxima de você:</p>
                <div className="states-grid">
                  {availableStates.map(st => {
                    const stateName = resellersLocal.find(r => r.state === st)?.stateName;
                    return (
                      <button key={st} className="state-card" onClick={() => handleStateClick(st)}>
                        <span className="state-uf">{st}</span>
                        <span className="state-name">{stateName}</span>
                      </button>
                    );
                  })}
                </div>
                {drawerMode === 'favorites' && (
                  <button className="btn-link" onClick={() => setCheckoutStep('cart')} style={{marginTop: '20px', width: '100%', textAlign: 'center'}}>Voltar para meus itens</button>
                )}
              </div>
            )}

            {checkoutStep === 'citySelect' && (
              <div className="state-select-container">
                <p className="state-instruction">Temos parceiros nestas cidades em {selectedStateStr}:</p>
                <div className="cities-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {availableCities.map(city => (
                    <button key={city} onClick={() => handleCityClick(city)} style={{ padding: '15px', background: '#f5f0e0', border: '1px solid #e0d5b0', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#333', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                      {city} <ChevronRight size={20} color="#8B4513" />
                    </button>
                  ))}
                </div>
                <button className="btn-link" onClick={() => setCheckoutStep('stateSelect')} style={{marginTop: '20px', width: '100%', textAlign: 'center'}}>Trocar Estado</button>
              </div>
            )}

            {checkoutStep === 'resellerSelect' && (
              <div className="reseller-select-container">
                <div className="resellers-list">
                  {resellersLocal.filter(r => r.state === selectedStateStr && r.city === selectedCityStr).map((r, i) => (
                    <div key={r.id} className="reseller-card">
                      <div className="reseller-info">
                        <h4>{r.name}</h4>
                        <p className="reseller-address">{r.address}</p>
                      </div>
                      <div className="reseller-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                        <a href={r.googleMapsLink} target="_blank" rel="noreferrer" className="btn-whatsapp-reseller" style={{ background: '#f8f4e8', color: '#8B4513', border: '1px solid #e0d5b0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <Navigation size={18} /> Ver no Mapa
                        </a>
                        <a href={createWhatsAppLink(r.phone)} target="_blank" rel="noreferrer" className="btn-whatsapp-reseller" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          Fazer Pedido
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-link" onClick={() => setCheckoutStep('citySelect')} style={{marginTop: '20px', width: '100%', textAlign: 'center'}}>Trocar Cidade</button>
              </div>
            )}
            
          </div>
          {drawerMode === 'favorites' && checkoutStep === 'cart' && favorites.length > 0 && (
            <div className="fav-footer">
              <button onClick={() => setCheckoutStep('stateSelect')} className="btn btn-whatsapp-order">
                Avançar para Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

    if (viewState === 'admin') {
      return <AdminPage onBack={() => setViewState('home')} />;
    }

    if (viewState === 'category' && activeCategory) {
      return (
        <>
          <CategoryPage 
            category={activeCategory} 
            onBack={() => {
              setViewState('home');
              setTimeout(() => {
                document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} 
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setIsFavOpen={openFavoritesMenu}
          />
          {renderFavDrawer()}
        </>
      );
    }

  return (
    <>
      <nav className="navbar" role="navigation">
        <div className="container">
          <div className="navbar-brand">
            Shiva<span>Parvati</span>
          </div>
          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`} id="navMenu">
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Início</a></li>
            <li><a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a></li>
            <li><a href="#quem-somos" onClick={() => setMenuOpen(false)}>Quem Somos</a></li>
            <li><a href="#produtos" onClick={() => setMenuOpen(false)}>Produtos</a></li>
            <li><a href="#diferenciais" onClick={() => setMenuOpen(false)}>Diferenciais</a></li>
            <li><a href="#depoimentos" onClick={() => setMenuOpen(false)}>Depoimentos</a></li>
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {favorites.length > 0 && (
              <button 
                onClick={openFavoritesMenu} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', padding: 0 }}
                aria-label="Ver lista de desejos"
              >
                <Heart size={28} fill="#d32f2f" color="#d32f2f" />
                <span style={{ position: 'absolute', top: '-6px', right: '-12px', background: '#1A1A1A', color: '#FFF', fontSize: '11px', padding: '2px 7px', border: '2px solid #FFF', borderRadius: '12px', fontWeight: 'bold' }}>{favorites.length}</span>
              </button>
            )}
            <div
              className="hamburger"
              id="hamburger"
              aria-label="Abrir menu"
              role="button"
              tabIndex={0}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero" id="home" style={{ backgroundImage: `linear-gradient(135deg, rgba(80,0,0,0.6), rgba(0,0,0,0.3)), url(${heroSlides[currentSlide].image})`, transition: 'background-image 0.5s ease-in-out' }}>
        <div className="hero-dish-label">
          {heroSlides[currentSlide].title}
        </div>
        <button className="carousel-control left" onClick={() => setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}><ChevronLeft size={48} strokeWidth={1} /></button>
        <div className="hero-content container">
          <h4 className="hero-eyebrow">Produtos artesanais de qualidade premium</h4>
          <h1 className="hero-title">Eleve suas refeições a experiências extraordinárias</h1>
          <p className="hero-subtitle">Aqui você garante refeições extraordinárias, sem ter que se preocupar com o preparo! Basta alguns minutinhos e você tem uma refeição completa, de comer rezando.</p>
          <a href="#produtos" className="btn btn-hero">Conheça Nosso Cardápio</a>
        </div>
        <button className="carousel-control right" onClick={() => setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1))}><ChevronRight size={48} strokeWidth={1} /></button>
      </section>

      <section className="form-section" id="contato">
        <div className="form-wrapper">
          <h2>O QUE VOCÊ BUSCA?</h2>
          <form className="contact-form" action="#" method="POST" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <input type="text" id="nome" name="nome" required placeholder="Nome" />
            </div>
            <div className="form-group">
              <input type="tel" id="telefone" name="telefone" required placeholder="Telefone" />
            </div>
            <div className="form-group">
              <input type="email" id="email" name="email" required placeholder="Email" />
            </div>
            <div className="form-group">
              <select id="interesse" name="interesse" required defaultValue="">
                <option value="" disabled hidden>Selecione...</option>
                <option value="comprar">Comprar</option>
                <option value="trabalhe">Trabalhe Conosco</option>
                <option value="parceria">Parcerias</option>
              </select>
            </div>
            <button type="submit" className="btn">Solicitar</button>
          </form>
        </div>
      </section>

      <section className="about section-padding" id="quem-somos">
        <div className="container">
          <div className="about-grid">
            <div className="about-image fade-in">
              <img src="https://i.imgur.com/KToueM6.jpeg" alt="Chef da Shiva Parvati preparando pratos artesanais" loading="lazy" />
              <p className="chef-name">Chefe: Erika Contrera</p>
            </div>
            <div className="about-text fade-in">
              <h2>Quem Somos</h2>
              <p className="subtitle">Produtos alimentícios feitos com paixão e qualidade desde 2002</p>
              <p>A <strong>Shiva Parvati Produtos Alimentícios</strong> nasceu em <strong>14 de fevereiro de 2002</strong>, em Fernando Prestes, interior de São Paulo, com a missão de levar à mesa dos brasileiros produtos artesanais de qualidade premium. Somos uma microempresa familiar que transforma ingredientes selecionados em produtos saborosos, doces irresistíveis e bebidas especiais.</p>
              <p>Nosso processo é 100% artesanal, sem conservantes ou aditivos químicos. Acreditamos que comida de verdade é aquela feita com tempo, cuidado e respeito ao cliente, conservando todo o seu sabor ao ser congelada. Cada receita é desenvolvida com dedicação, combinando tradição e inovação para oferecer sempre o melhor.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" id="produtos" style={{ background: '#f8f4e8' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <h2>Nossas Linhas de Produtos</h2>
            <p className="subtitle" style={{ marginBottom: 0 }}>Descubra a variedade que a Shiva Parvati oferece</p>
          </div>
          <div className="product-showcase">
            <div className="product-sidebar">
              {categoriesLocal.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${activeCategory?.id === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className="category-title">{cat.title}</span>
                  <span className="category-count">{getCategoryCountStr(cat.id)}</span>
                  <ChevronRight size={18} className="category-arrow" />
                </button>
              ))}
            </div>
            {activeCategory && (
              <div className="product-display fade-in visible">
                <div className="product-image-wrapper">
                  <img src={activeCategory.image} alt={`Categoria ${activeCategory.title}`} className="product-main-image" loading="lazy" />
                  <div className="product-badge">{getCategoryCountStr(activeCategory.id)}</div>
                </div>
                <div className="product-details">
                  <h3>{activeCategory.title}</h3>
                  <p className="product-desc"><strong>Tipos:</strong> {getCategoryItemsStr(activeCategory.id) || 'Variados'}</p>
                  <button className="btn btn-secondary" onClick={() => setViewState('category')}>Explorar Sabores e Criar Lista de Desejos</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="differentials section-padding" id="diferenciais">
        <div className="container text-center">
          <h2>Por que escolher Shiva Parvati?</h2>
          <div className="diffs-grid">
            <div className="diff-item fade-in">
              <div className="icon-wrapper"><Leaf size={32} /></div>
              <h4>Ingredientes Selecionados</h4>
              <p>Rigor absoluto no preparo com matéria-prima de altíssima excelência.</p>
            </div>
            <div className="diff-item fade-in">
              <div className="icon-wrapper"><ChefHat size={32} /></div>
              <h4>100% Artesanais</h4>
              <p>Feitos à mão, garantindo textura, afeto e um sabor verdadeiramente único.</p>
            </div>
            <div className="diff-item fade-in">
              <div className="icon-wrapper"><Sparkles size={32} /></div>
              <h4>Lançamentos Constantes</h4>
              <p>Nosso cardápio está sempre ganhando inovações para surpreender seu paladar.</p>
            </div>
            <div className="diff-item fade-in">
              <div className="icon-wrapper"><Heart style={{fill: '#d32f2f', color: '#d32f2f', stroke: 'none'}} size={32} /></div>
              <h4>Comida de Verdade</h4>
              <p>Zero conservantes ou aditivos industriais. Apenas comida pura e de verdade.</p>
            </div>
            <div className="diff-item fade-in">
              <div className="icon-wrapper"><ShieldCheck size={32} /></div>
              <h4>Qualidade Garantida</h4>
              <p>Padrão rigoroso e consistente que entrega o melhor à sua mesa diariamente.</p>
            </div>
            <div className="diff-item fade-in">
              <div className="icon-wrapper"><Clock size={32} /></div>
              <h4>Tradição desde 2002</h4>
              <p>Mais de duas décadas de experiência conquistando os paladares mais exigentes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="craving section-padding text-center">
        <div className="container">
          <h2>Ficou com vontade de experimentar?</h2>
          <p>Garanta refeições de chef sem sair de casa. Clique abaixo e procure pela unidade mais próxima ou faça seu pedido agora mesmo!</p>
          <div className="btn-group">
            <a href="#" onClick={openLocator} className="btn btn-primary">ONDE COMPRAR?</a>
            <a href="#produtos" className="btn btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>FAÇA SEU PEDIDO AGORA</a>
          </div>
        </div>
      </section>

      <section className="testimonials section-padding" id="depoimentos">
        <div className="container text-center">
          <h2>O que nossos clientes acham dos nossos produtos!</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card fade-in">
              <div className="stars">★★★★★</div>
              <blockquote>"Os produtos artesanais da Shiva Parvati são simplesmente incríveis! Sabor caseiro de verdade."</blockquote>
              <div className="author">Ana Paula</div>
              <div className="time">Há 2 semanas</div>
            </div>
            <div className="testimonial-card fade-in">
              <div className="stars">★★★★★</div>
              <blockquote>"Comprei os doces para uma festa e todos amaram. Qualidade excepcional!"</blockquote>
              <div className="author">Carlos M.</div>
              <div className="time">Há 1 mês</div>
            </div>
            <div className="testimonial-card fade-in">
              <div className="stars">★★★★★</div>
              <blockquote>"Atendimento maravilhoso e produtos fresquinhos. Recomendo de olhos fechados."</blockquote>
              <div className="author">Juliana R.</div>
              <div className="time">Há 3 semanas</div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div>
            <h4>Acesso Rápido</h4>
            <ul>
              <li><a href="#home">Início</a></li>
              <li><a href="#produtos">Produtos</a></li>
              <li><a href="#quem-somos">Quem Somos</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4>Suporte</h4>
            <ul>
              <li><a href="#home">FAQs</a></li>
              <li><a href="#home">Termos & Condições</a></li>
              <li><a href="#home">Políticas de Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4>Redes Sociais</h4>
            <div className="social-links">
              <a href="#home" aria-label="Facebook">f</a>
              <a href="https://wa.me/551632583182" target="_blank" rel="noreferrer" aria-label="WhatsApp">w</a>
              <a href="#home" aria-label="Instagram">ig</a>
            </div>
          </div>
          <div className="contact-info">
            <h4>Informações de Contato</h4>
            <p><strong>Telefone:</strong> (16) 3258-3182</p>
            <p><strong>E-mail:</strong> contato@shivaparvati.com.br</p>
            <p><strong>Endereço:</strong> R Donizete Miola, 623 - Distrito Industrial Ercidio Borgonovi<br />Fernando Prestes, SP - CEP 15.940-000</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Shiva Parvati Produtos Alimentícios Ltda. Todos os direitos reservados.</p>
          <p>CNPJ: 04.897.139/0001-30 | Microempresa (ME) <a href="#" onClick={(e) => { e.preventDefault(); setViewState('admin'); }} style={{color: 'inherit', marginLeft: '10px', textDecoration: 'underline'}}>Área do Lojista/Admin</a></p>
        </div>
      </footer>
      {renderFavDrawer()}
    </>
  );
}
