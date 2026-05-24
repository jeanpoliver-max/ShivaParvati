import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Heart, ShoppingBag, Search, X } from 'lucide-react';
import { getProducts, Product } from '../services/products';

export default function CategoryPage({ 
  category, 
  onBack,
  favorites,
  updateQuantity,
  setIsFavOpen
}: { 
  category: any, 
  onBack: () => void,
  favorites: {name: string, size: string, quantity: number}[],
  updateQuantity: (name: string, size: string, delta: number) => void,
  setIsFavOpen: (val: boolean) => void
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    setData(getProducts().filter(p => p.categoryId === category.id));
  }, [category.id]);

  const types = ['Todos', ...Array.from(new Set(data.map(i => i.type)))].sort();

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activeFilter === 'Todos' || item.type === activeFilter;
      return matchesSearch && matchesType;
    });
  }, [data, searchTerm, activeFilter]);

  const getQuantity = (name: string, size: string) => {
    const fav = favorites.find(f => f.name === name && f.size === size);
    return fav ? fav.quantity : 0;
  };

  const totalItems = favorites.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="category-page-wrapper">
      <div className="cat-header" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${category.image})` }}>
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={24} /> Voltar para Linhas de Produtos
        </button>
        <div className="cat-title-area">
          <h1>{category.title}</h1>
          <p>{category.count}</p>
        </div>
      </div>

      <div className="cat-content container">
        <div className="cat-toolbar">
          <div className="search-bar">
            <Search size={20} color="#777" />
            <input 
              type="text" 
              placeholder="Buscar sabor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="fav-toggle-btn" onClick={() => setIsFavOpen(true)}>
            <Heart size={20} fill={totalItems > 0 ? '#d32f2f' : 'transparent'} color={totalItems > 0 ? '#d32f2f' : '#333'} />
            Lista de Desejos ({totalItems})
          </button>
        </div>

        {types.length > 1 && (
          <div className="type-filters">
            {types.map(t => (
              <button 
                key={t} 
                className={`type-chip ${activeFilter === t ? 'active' : ''}`}
                onClick={() => setActiveFilter(t as string)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="items-grid">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div key={idx} className="item-card fade-in visible">
                <div className="item-info">
                  <span className="item-type">{item.type}</span>
                  <h3>{item.name}</h3>
                </div>
                <div className="item-actions">
                  {item.embalagem.map(size => {
                    const quantity = getQuantity(item.name, size);
                    return (
                      <div key={size} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '8px 12px', background: '#f8f4e8', borderRadius: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Embalagem {size}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF', borderRadius: '16px', padding: '2px 6px', border: '1px solid #e0d8c3' }}>
                          <button onClick={() => updateQuantity(item.name, size, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#8B4513', padding: '0 8px', fontWeight: 'bold' }}>-</button>
                          <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{quantity}</span>
                          <button onClick={() => updateQuantity(item.name, size, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#8B4513', padding: '0 8px', fontWeight: 'bold' }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="no-items">
              <p>Nenhum sabor encontrado para a sua busca. 😢</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <button className="back-btn" style={{ position: 'relative', top: 'auto', left: 'auto', background: '#8B4513', border: 'none' }} onClick={onBack}>
            <ChevronLeft size={24} /> Voltar para Linhas de Produtos
          </button>
        </div>
      </div>
    </div>
  );
}
