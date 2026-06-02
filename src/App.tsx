import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, X, MapPin, Store, Leaf, ChefHat, Sparkles, ShieldCheck, Clock, Navigation, Instagram } from 'lucide-react';
import CategoryPage from './components/CategoryPage';
import AdminPage from './components/AdminPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import { getResellers, Reseller } from './services/resellers';
import { getProducts, Product } from './services/products';
import { getCategories, ProductCategory } from './services/categories';
import { addClient } from './services/clients';
import image1 from './assets/images/rondelli_bolonhesa_1779487429390.png';
import image2 from './assets/images/lasanha_rucula_tomate_1779487887471.png';
import image3 from './assets/images/sorrentino_queijo_1779487902156.png';
import image4 from './assets/images/sufioli_queijo_nozes_1779487916700.png';

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
  const [viewState, setViewState] = useState<'home' | 'category' | 'admin' | 'terms' | 'privacy'>('home');
  const [favorites, setFavorites] = useState<{name: string, size: string, quantity: number}[]>([]);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'favorites' | 'locator'>('favorites');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'leadCapture' | 'stateSelect' | 'resellerSelect'>('cart');
  const [leadCode, setLeadCode] = useState({ name: '', phone: '' });
  const [selectedStateStr, setSelectedStateStr] = useState<string>('');
  const [resellersLocal, setResellersLocal] = useState<Reseller[]>([]);
  const [productsLocal, setProductsLocal] = useState<Product[]>([]);
  const [categoriesLocal, setCategoriesLocal] = useState<ProductCategory[]>([]);

  const totalItems = favorites.reduce((acc, curr) => acc + curr.quantity, 0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const res = await getResellers();
      const prods = await getProducts();
      const cats = await getCategories();
      if (mounted) {
        setResellersLocal(res);
        setProductsLocal(prods);
        setCategoriesLocal(cats);
        if (!activeCategory && cats.length > 0) {
          setActiveCategory(cats[0]);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [viewState]);


  const getCategoryCountStr = (catId: string) => {
    const count = productsLocal.filter(p => p.categoryId === catId).length;
    return `${count} Variações de Sabores`;
  };

  const getCategoryItemsStr = (catId: string) => {
    const types = Array.from(new Set(productsLocal.filter(p => p.categoryId === catId).map(p => p.type).filter(Boolean)));
    return types.join(', ');
  };

  const closeDrawer = () => {
    setIsFavOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
      setSelectedStateStr('');
    }, 300);
  };

  const availableStates: string[] = Array.from(new Set(resellersLocal.map(r => r.state)));

  const handleStateClick = (st: string) => {
    setSelectedStateStr(st);
    setCheckoutStep('resellerSelect');
  };

  const openLocator = (e: React.MouseEvent) => {
    e.preventDefault();
    setDrawerMode('locator');
    if (availableStates.length === 1) {
      setSelectedStateStr(availableStates[0]);
      setCheckoutStep('resellerSelect');
    } else {
      setCheckoutStep('stateSelect');
    }
    setIsFavOpen(true);
  };

  const openFavoritesMenu = () => {
    setDrawerMode('favorites');
    setCheckoutStep('cart');
    setIsFavOpen(true);
  };

  const updateQuantity = (name: string, size: string, delta: number) => {
    setFavorites(prev => {
      const existing = prev.find(fav => fav.name === name && fav.size === size);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter(fav => !(fav.name === name && fav.size === size));
        } else {
          return prev.map(fav => fav.name === name && fav.size === size ? { ...fav, quantity: newQuantity } : fav);
        }
      } else {
        if (delta > 0) {
          return [...prev, { name, size, quantity: delta }];
        }
        return prev;
      }
    });
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
    if (interesse === "falar") {
      mensagemInteresse = "Gostaria de falar com a Shiva Parvati";
    } else if (interesse === "trabalhe") {
      mensagemInteresse = "Quero trabalhar com a ShivaParvati";
    } else if (interesse === "parceria") {
      mensagemInteresse = "Quero ser parceiro da ShivaParvati";
    }

    const text = `Olá, meu nome é ${nome}.\nMeu telefone é ${telefone} e e-mail ${email}.\n\n${mensagemInteresse}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/5516997090967?text=${encodedText}`, '_blank');
  };

  const sendOrderWhatsApp = (resellerPhone: string) => {
    let text = `*Novo Pedido*\n\n*Cliente:* ${leadCode.name}\n*Contato:* ${leadCode.phone}\n\n*Lista de Produtos:*\n`;
    favorites.forEach(fav => {
      text += `- ${fav.quantity}x ${fav.name} - Embalagem ${fav.size}\n`;
    });
    
    const encodedText = encodeURIComponent(text);
    const cleanPhone = resellerPhone.replace(/\D/g, '');
    const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${finalPhone}?text=${encodedText}`, '_blank');
    closeDrawer();
  };

  const advanceFromLeadToLocator = () => {
    if (availableStates.length === 1) {
      setSelectedStateStr(availableStates[0]);
      setCheckoutStep('resellerSelect');
    } else {
      setCheckoutStep('stateSelect');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const date = new Date().toISOString();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let city = '';
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.address) {
              const cityName = data.address.city || data.address.town || data.address.village;
              const stateName = data.address.state;
              if (cityName && stateName) {
                city = `${cityName} - ${stateName}`;
              } else if (cityName) {
                city = cityName;
              }
            }
          } catch (e) {
            console.error('Error fetching city data from coordinates', e);
          }
          
          addClient({
            name: leadCode.name,
            phone: leadCode.phone,
            date,
            latitude,
            longitude,
            city
          });
          advanceFromLeadToLocator();
        },
        (error) => {
          addClient({
            name: leadCode.name,
            phone: leadCode.phone,
            date,
            latitude: null,
            longitude: null
          });
          advanceFromLeadToLocator();
        }
      );
    } else {
      addClient({
        name: leadCode.name,
        phone: leadCode.phone,
        date,
        latitude: null,
        longitude: null
      });
      advanceFromLeadToLocator();
    }
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
            {checkoutStep === 'leadCapture' && (
              <h3><ShoppingBag color="#d32f2f" size={20} style={{marginRight: '8px'}} /> Detalhes do Pedido</h3>
            )}
            {checkoutStep === 'resellerSelect' && (
              <h3><Store color="#d32f2f" size={20} style={{marginRight: '8px'}} /> Lojas Parceiras</h3>
            )}
            <button className="close-btn" onClick={closeDrawer}><X size={24} /></button>
          </div>
          <div className="fav-body">
            {drawerMode === 'favorites' && checkoutStep === 'cart' && (
              totalItems === 0 ? (
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
                        <span style={{ display: 'block', color: '#666', fontSize: '13px', marginTop: '4px' }}>Embalagem {fav.size}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f4e8', borderRadius: '16px', padding: '2px 6px' }}>
                        <button onClick={() => updateQuantity(fav.name, fav.size, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#8B4513', padding: '0 5px' }}>-</button>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{fav.quantity}</span>
                        <button onClick={() => updateQuantity(fav.name, fav.size, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#8B4513', padding: '0 5px' }}>+</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            )}
            
            {checkoutStep === 'leadCapture' && (
              <div className="lead-capture-container" style={{ padding: '20px 0' }}>
                <p style={{ marginBottom: '20px', color: '#555' }}>Para continuarmos com seu pedido, por favor informe seus dados:</p>
                <form onSubmit={handleLeadSubmit}>
                  <div className="form-group" style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Nome Completo *</label>
                    <input 
                      type="text" 
                      required 
                      value={leadCode.name}
                      onChange={e => setLeadCode({...leadCode, name: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Telefone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      required 
                      value={leadCode.phone}
                      onChange={e => setLeadCode({...leadCode, phone: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-whatsapp-order" style={{ width: '100%', marginBottom: '15px' }}>
                    Concluir e Selecionar Revenda
                  </button>
                  <button type="button" className="btn-link" onClick={() => setCheckoutStep('cart')} style={{ width: '100%', textAlign: 'center' }}>
                    Voltar para meus itens
                  </button>
                </form>
              </div>
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

            {checkoutStep === 'resellerSelect' && (
              <div className="reseller-select-container">
                <div className="resellers-list">
                  {(() => {
                    const filteredResellers = resellersLocal.filter(r => r.state === selectedStateStr);
                    const grouped = filteredResellers.reduce((acc, r) => {
                      const key = r.city;
                      if (!acc[key]) acc[key] = [];
                      acc[key].push(r);
                      return acc;
                    }, {} as Record<string, typeof resellersLocal>);
                    
                    const sortedCities = Object.keys(grouped).sort();

                    return sortedCities.map(city => (
                      <div key={city}>
                        <h4 style={{ margin: '15px 0 10px 0', fontSize: '18px', color: '#1A1A1A', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>{city}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {grouped[city].sort((a,b) => a.name.localeCompare(b.name)).map((r, i) => (
                            <div key={r.id} className="reseller-card" style={{ marginBottom: 0 }}>
                              <div className="reseller-info">
                                <h4>{r.name}</h4>
                                <span style={{ display: 'inline-block', background: '#FFFDD0', color: '#8B4513', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{r.city} - {r.state}</span>
                                <p className="reseller-address">{r.address}</p>
                              </div>
                              <div className="reseller-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                <a href={r.googleMapsLink} target="_blank" rel="noreferrer" className="btn-whatsapp-reseller" style={{ background: '#f8f4e8', color: '#8B4513', border: '1px solid #e0d5b0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                  <Navigation size={18} /> Ver no Mapa
                                </a>
                                {drawerMode === 'locator' ? (
                                  <button onClick={() => { closeDrawer(); document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-whatsapp-reseller" style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    Fazer Pedido
                                  </button>
                                ) : (
                                  <button onClick={() => sendOrderWhatsApp(r.phone)} className="btn-whatsapp-reseller" style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#25D366' }}>
                                    Enviar Pedido
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                {availableStates.length > 1 && (
                  <button className="btn-link" onClick={() => setCheckoutStep('stateSelect')} style={{marginTop: '20px', width: '100%', textAlign: 'center'}}>Trocar Estado</button>
                )}
              </div>
            )}
            
          </div>
          {drawerMode === 'favorites' && checkoutStep === 'cart' && totalItems > 0 && (
            <div className="fav-footer" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setCheckoutStep('leadCapture')} className="btn btn-whatsapp-order">
                Avançar para Pedido
              </button>
              <button 
                onClick={() => {
                  setFavorites([]);
                  closeDrawer();
                  setViewState('home');
                  setTimeout(() => {
                    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }} 
                style={{ background: 'transparent', border: '1px solid #d32f2f', color: '#d32f2f', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}
              >
                Limpar Lista
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

    if (viewState === 'terms') {
      return <TermsPage onBack={() => setViewState('home')} />;
    }

    if (viewState === 'privacy') {
      return <PrivacyPage onBack={() => setViewState('home')} />;
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
            updateQuantity={updateQuantity}
            setIsFavOpen={openFavoritesMenu}
            isFavOpen={isFavOpen}
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
            {totalItems > 0 && (
              <button 
                onClick={openFavoritesMenu} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', padding: 0 }}
                aria-label="Ver lista de desejos"
              >
                <Heart size={28} fill="#d32f2f" color="#d32f2f" />
                <span style={{ position: 'absolute', top: '-6px', right: '-12px', background: '#1A1A1A', color: '#FFF', fontSize: '11px', padding: '2px 7px', border: '2px solid #FFF', borderRadius: '12px', fontWeight: 'bold' }}>{totalItems}</span>
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
                <option value="falar">Falar com a Shiva Parvati</option>
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
              <img src="https://i.imgur.com/KToueM6.jpeg" alt="Chef da Shiva Parvati preparando pratos artesanais" loading="lazy" referrerPolicy="no-referrer" />
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
                  <img src={activeCategory.image} alt={`Produtos alimentícios e massas artesanais da categoria ${activeCategory.title}`} className="product-main-image" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="product-badge">{getCategoryCountStr(activeCategory.id)}</div>
                </div>
                <div className="product-details">
                  <h3>{activeCategory.title}</h3>
                  <p className="product-desc"><strong>Tipos:</strong> {getCategoryItemsStr(activeCategory.id) || 'Variados'}</p>
                  
                  <div style={{ marginTop: '20px', padding: '20px', background: '#faf9f5', borderRadius: '12px', border: '1px dashed #D4AF37', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 15px 0', color: '#8B4513', fontWeight: 600, fontSize: '16px' }}>
                      👉 Para escolher os sabores desta categoria:
                    </p>
                    <button 
                      className="btn btn-action-pulse" 
                      onClick={() => setViewState('category')}
                      style={{ width: '100%', fontSize: '15px' }}
                    >
                      Explorar Sabores e Criar Lista de Desejos <ChevronRight size={20} />
                    </button>
                  </div>
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

      <section className="faq section-padding" id="faq" style={{ background: '#FFF' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <h2>Dúvidas Frequentes</h2>
            <p>Tudo o que você precisa saber sobre nossos produtos e preparo</p>
          </div>
          <div className="faq-grid" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <details className="faq-item">
              <summary>Como preparo as massas e caldos congelados?</summary>
              <p>Praticidade é o nosso forte! Nossas massas e caldos vão direto do freezer para o micro-ondas, forno ou panela, dependendo do produto. Cada embalagem contém instruções detalhadas de tempo e temperatura para garantir a melhor experiência em casa.</p>
            </details>
            <details className="faq-item">
              <summary>Qual a validade dos produtos?</summary>
              <p>Por serem ultracongelados e elaborados visando preservar o frescor e sabor, nossos produtos têm validade média de 3 a 6 meses se mantidos armazenados no freezer (-18°C). Verifique a etiqueta de cada embalagem.</p>
            </details>
            <details className="faq-item">
              <summary>Vocês têm opções vegetarianas?</summary>
              <p>Com certeza. Temos ótimas opções sem carne: queijos selecionados nas massas, pizzas clássicas, salgados artesanais e caldos, elaborados com carinho para quem aprecia refeições vegetarianas.</p>
            </details>
            <details className="faq-item">
              <summary>Onde posso comprar Shiva Parvati?</summary>
              <p>Você pode explorar nossa rede de parceiros comerciais clicando em "Onde Comprar" para encontrar a loja mais perto de você. Se preferir, também poderá iniciar um pedido direto pelo nosso WhatsApp e montar sua lista de desejos pelo próprio site.</p>
            </details>
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
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setViewState('terms'); }}>Termos & Condições</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setViewState('privacy'); }}>Políticas de Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4>Redes Sociais</h4>
            <div className="social-links">
              <a href="https://www.instagram.com/shivaparvati.com.br/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={24} />
              </a>
            </div>
          </div>
          <div className="contact-info">
            <h4>Informações de Contato</h4>
            <p><strong>WhatsApp / Celular:</strong> (16) 99709-0967</p>
            <p><strong>E-mail:</strong> contato@shivaparvati.com.br</p>
            <p><strong>Endereço:</strong> R Donizete Miola, 623 - Distrito Industrial Ercidio Borgonovi<br />Fernando Prestes, SP - CEP 15.940-000</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Shiva Parvati Produtos Alimentícios Ltda. Todos os direitos reservados.</p>
          <p>CNPJ: 04.897.139/0001-30 | Microempresa (ME) <a href="#" onClick={(e) => { e.preventDefault(); setViewState('admin'); }} style={{color: 'inherit', marginLeft: '10px', textDecoration: 'underline'}}>Área do Lojista/Admin</a></p>
        </div>
      </footer>
      {!isFavOpen && totalItems > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#d32f2f',
          color: '#FFF',
          padding: '16px 24px',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 10px 25px rgba(211, 47, 47, 0.4)',
          zIndex: 1500,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={24} />
            <span style={{ fontWeight: 600, fontSize: '15px' }}>{totalItems} {totalItems === 1 ? 'item' : 'itens'} na lista</span>
          </div>
          <button 
            onClick={() => {
              setDrawerMode('favorites');
              setIsFavOpen(true);
            }}
            style={{
              background: '#FFF',
              color: '#d32f2f',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '13px',
              transition: 'transform 0.2s',
            }}
          >
            Finalizar Pedido
          </button>
        </div>
      )}
      {renderFavDrawer()}
    </>
  );
}
