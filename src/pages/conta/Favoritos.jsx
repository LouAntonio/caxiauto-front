import React, { useEffect, useState } from 'react';
import { Heart, X, Car, Key, Wrench, Calendar, MapPin, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api, { getImageUrl, notyf } from '../../services/api';

const Favoritos = () => {
    useDocumentTitle('Favoritos - CaxiAuto');

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            const res = await api.getFavorites();
            if (!res || res.success === false) {
                setItems([]);
                setLoading(false);
                return;
            }

            const favorites = res.data || [];

            // Para cada favorite, buscar detalhe do item conforme itemType
            const detailPromises = favorites.map(async (fav) => {
                try {
                    if (fav.itemType === 'sell') {
                        const r = await api.getVeiculoCompra(fav.itemId);
                        return { ...r.data, _favId: fav._id, itemType: fav.itemType };
                    }
                    if (fav.itemType === 'rent') {
                        const r = await api.getVeiculoAluguel(fav.itemId);
                        return { ...r.data, _favId: fav._id, itemType: fav.itemType };
                    }
                    if (fav.itemType === 'part') {
                        const r = await api.getPeca(fav.itemId);
                        const pecaData = r?.data || {};
                        return {
                            ...pecaData,
                            _favId: fav._id,
                            itemType: fav.itemType,
                            title: pecaData.title || pecaData.name || pecaData.nome || 'Peça sem nome',
                            name: pecaData.name || pecaData.nome || pecaData.title || 'Peça sem nome',
                            images: pecaData.images || pecaData.gallery || (pecaData.image ? [pecaData.image] : []),
                            category: pecaData.category || { name: pecaData.categoria?.nome || null }
                        };
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            });

            const detailed = await Promise.all(detailPromises);
            setItems(detailed.filter(Boolean));
            setLoading(false);
        };

        fetchFavorites();
    }, []);

    const handleRemove = async (itemId) => {
        const res = await api.removeFavorite(itemId);
        if (res && res.success) {
            setItems((prev) => prev.filter((it) => it._id !== itemId));
            notyf.success('Removido dos favoritos');
        } else {
            notyf.error(res?.message || 'Erro ao remover favorito');
        }
    };

    const getItemLink = (item) => {
        if (item.itemType === 'sell') return `/stand/compra/${item._id}`;
        if (item.itemType === 'rent') return `/servicos/aluguel-de-automoveis/${item._id}`;
        if (item.itemType === 'part') return `/stand/pecas-acessorios/${item._id}`;
        return '#';
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'sell':
                return { label: 'Venda', icon: Car, color: 'bg-blue-100 text-blue-700' };
            case 'rent':
                return { label: 'Aluguel', icon: Key, color: 'bg-green-100 text-green-700' };
            case 'part':
                return { label: 'Peça', icon: Wrench, color: 'bg-orange-100 text-orange-700' };
            default:
                return { label: 'Item', icon: Heart, color: 'bg-gray-100 text-gray-700' };
        }
    };

    const renderItemDetails = (item) => {
        if (item.itemType === 'sell') {
            return (
                <>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.year || '—'}</span>
                    </div>
                    {item.location && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.location}</span>
                        </div>
                    )}
                    {item.price && (
                        <div className="mt-3 text-lg font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(item.price)}
                        </div>
                    )}
                </>
            );
        }

        if (item.itemType === 'rent') {
            return (
                <>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.year || '—'}</span>
                    </div>
                    {item.location && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.location}</span>
                        </div>
                    )}
                    {item.dailyPrice && (
                        <div className="mt-3">
                            <span className="text-lg font-bold text-gray-900">
                                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(item.dailyPrice)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">/dia</span>
                        </div>
                    )}
                </>
            );
        }

        if (item.itemType === 'part') {
            return (
                <>
                    {item.condition && (
                        <div className="text-xs text-gray-600 capitalize">
                            {item.condition === 'new' ? 'Novo' : item.condition === 'used' ? 'Usado' : item.condition}
                        </div>
                    )}
                    {item.category?.name && (
                        <div className="text-xs text-gray-500">
                            {item.category.name}
                        </div>
                    )}
                    {item.price && (
                        <div className="mt-3 text-lg font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(item.price)}
                        </div>
                    )}
                </>
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Meus Favoritos</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {items.length > 0 ? `${items.length} ${items.length === 1 ? 'item favoritado' : 'itens favoritados'}` : 'Nenhum item favoritado'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Carregando favoritos...</p>
                        </div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum favorito ainda</h3>
                        <p className="text-gray-600 mb-6">Adicione veículos e peças aos favoritos para vê-los aqui.</p>
                        <Link 
                            to="/stand/compra" 
                            className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Explorar Stand
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => {
                            const badge = getTypeBadge(item.itemType);
                            const BadgeIcon = badge.icon;
                            
                            return (
                                <div key={item._id} className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
                                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                        <Link to={getItemLink(item)}>
                                            <img
                                                src={getImageUrl(item.images?.[0] || item.image)}
                                                alt={item.title || item.name || 'item'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </Link>
                                        
                                        {/* Badge do tipo */}
                                        <div className={`absolute top-3 left-3 ${badge.color} px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm`}>
                                            <BadgeIcon className="w-3.5 h-3.5" />
                                            <span className="text-xs font-semibold">{badge.label}</span>
                                        </div>
                                        
                                        {/* Botão remover */}
                                        <button
                                            onClick={() => handleRemove(item._id)}
                                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors shadow-sm group/btn"
                                            aria-label="Remover dos favoritos"
                                        >
                                            <X className="w-4 h-4 text-gray-700 group-hover/btn:text-red-600" />
                                        </button>
                                    </div>
                                    
                                    <div className="p-5 flex flex-col flex-1">
                                        <Link to={getItemLink(item)} className="block">
                                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                                {item.title || item.name || 'Sem título'}
                                            </h3>
                                        </Link>
                                        
                                        <div className="space-y-2">
                                            {renderItemDetails(item)}
                                        </div>
                                        
                                        <Link 
                                            to={getItemLink(item)}
                                            className="mt-auto block w-full bg-gray-50 text-center text-sm font-medium text-gray-700 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            Ver Detalhes
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favoritos;
