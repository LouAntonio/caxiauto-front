import React, { useEffect, useState } from 'react';
import { Heart, Car, Wrench, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api, { getImageUrl, notyf } from '../../services/api';

const Favoritos = () => {
    useDocumentTitle('Favoritos - CaxiAuto');

    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState([]);
    const [pecas, setPecas] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const res = await api.getWishlist();
                if (res && res.success) {
                    setVehicles(res.data?.vehicles || []);
                    setPecas(res.data?.pecas || []);
                } else {
                    setVehicles([]);
                    setPecas([]);
                }
            } catch {
                setVehicles([]);
                setPecas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveVehicle = async (vehicleId) => {
        try {
            const res = await api.removeVehicleFromWishlist(vehicleId);
            if (res && res.success) {
                setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
                notyf.success('Veículo removido dos favoritos');
            } else {
                notyf.error(res?.message || 'Erro ao remover veículo');
            }
        } catch {
            notyf.error('Erro ao remover veículo dos favoritos');
        }
    };

    const handleRemovePeca = async (pecaId) => {
        try {
            const res = await api.removePecaFromWishlist(pecaId);
            if (res && res.success) {
                setPecas((prev) => prev.filter((p) => p.id !== pecaId));
                notyf.success('Peça removida dos favoritos');
            } else {
                notyf.error(res?.message || 'Erro ao remover peça');
            }
        } catch {
            notyf.error('Erro ao remover peça dos favoritos');
        }
    };

    const totalItems = vehicles.length + pecas.length;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Meus Favoritos</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {totalItems > 0
                                ? `${totalItems} ${totalItems === 1 ? 'item favoritado' : 'itens favoritados'}`
                                : 'Nenhum item favoritado'}
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
                ) : totalItems === 0 ? (
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
                    <div className="space-y-8">
                        {/* Veículos */}
                        {vehicles.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Car className="w-5 h-5 text-blue-600" />
                                    Veículos ({vehicles.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vehicles.map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
                                        >
                                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                                <Link to={`/stand/compra/${vehicle.id}`}>
                                                    <img
                                                        src={getImageUrl(vehicle.image, '/images/i10.jpg')}
                                                        alt={vehicle.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => { e.target.src = '/images/i10.jpg'; }}
                                                    />
                                                </Link>

                                                <div className="absolute top-3 left-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                                    <Car className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-semibold">Veículo</span>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveVehicle(vehicle.id)}
                                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors shadow-sm group/btn"
                                                    aria-label="Remover dos favoritos"
                                                >
                                                    <Heart className="w-4 h-4 text-red-500 fill-red-500 group-hover/btn:text-red-700" />
                                                </button>
                                            </div>

                                            <div className="p-5 flex flex-col flex-1">
                                                <Link to={`/stand/compra/${vehicle.id}`} className="block">
                                                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                                        {vehicle.name}
                                                    </h3>
                                                </Link>

                                                <div className="space-y-2">
                                                    {vehicle.year && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>{vehicle.year}</span>
                                                        </div>
                                                    )}
                                                    {vehicle.provincia && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span>{vehicle.provincia}</span>
                                                        </div>
                                                    )}
                                                    {vehicle.priceSale && (
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {Number(vehicle.priceSale).toLocaleString('pt-AO')} Kz
                                                        </div>
                                                    )}
                                                </div>

                                                <Link
                                                    to={`/stand/compra/${vehicle.id}`}
                                                    className="mt-auto block w-full bg-gray-50 text-center text-sm font-medium text-gray-700 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    Ver Detalhes
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Peças */}
                        {pecas.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Wrench className="w-5 h-5 text-orange-600" />
                                    Peças ({pecas.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pecas.map((peca) => (
                                        <div
                                            key={peca.id}
                                            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
                                        >
                                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                                <Link to={`/stand/pecas-acessorios/${peca.id}`}>
                                                    <img
                                                        src={getImageUrl(peca.image, '/images/i10.jpg')}
                                                        alt={peca.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => { e.target.src = '/images/i10.jpg'; }}
                                                    />
                                                </Link>

                                                <div className="absolute top-3 left-3 bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                                    <Wrench className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-semibold">Peça</span>
                                                </div>

                                                <button
                                                    onClick={() => handleRemovePeca(peca.id)}
                                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors shadow-sm group/btn"
                                                    aria-label="Remover dos favoritos"
                                                >
                                                    <Heart className="w-4 h-4 text-red-500 fill-red-500 group-hover/btn:text-red-700" />
                                                </button>
                                            </div>

                                            <div className="p-5 flex flex-col flex-1">
                                                <Link to={`/stand/pecas-acessorios/${peca.id}`} className="block">
                                                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                                        {peca.name}
                                                    </h3>
                                                </Link>

                                                <div className="space-y-2">
                                                    {peca.Categoria?.name && (
                                                        <div className="text-xs text-gray-500">
                                                            {peca.Categoria.name}
                                                        </div>
                                                    )}
                                                    {peca.provincia && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span>{peca.provincia}</span>
                                                        </div>
                                                    )}
                                                    {peca.price && (
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {Number(peca.price).toLocaleString('pt-AO')} Kz
                                                        </div>
                                                    )}
                                                </div>

                                                <Link
                                                    to={`/stand/pecas-acessorios/${peca.id}`}
                                                    className="mt-auto block w-full bg-gray-50 text-center text-sm font-medium text-gray-700 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    Ver Detalhes
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favoritos;
