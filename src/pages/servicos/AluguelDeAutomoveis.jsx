import React, { useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
	Search,
	GitCompare,
	CheckCircle2,
	Key,
	Gauge,
	Calendar,
	MapPin,
	Droplet
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import VehicleFilter from '../../components/VehicleFilter';
import Pagination from '../../components/Pagination';

export default function AluguelDeAutomoveis() {
	useDocumentTitle('Aluguel de Automóveis - Caxiauto');
	const navigate = useNavigate();

	const [filters, setFilters] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const vehiclesPerPage = 16;

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
		setCurrentPage(1);
		console.log('Filtros aplicados:', newFilters);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Dados de exemplo dos veículos
	const vehicles = [
		{ id: 1, title: 'Toyota Corolla 2024', price: '150.000', image: './images/i10.jpg', km: '15.000', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 2, title: 'Honda CR-V 2023', price: '200.000', image: './images/i10.jpg', km: '28.500', year: 2023, location: 'Luanda', fuel: 'Gasolina', condition: 'Usado' },
		{ id: 3, title: 'Ford Ranger 2024', price: '250.000', image: './images/i10.jpg', km: '10.200', year: 2024, location: 'Luanda', fuel: 'Diesel', condition: 'Novo' },
		{ id: 4, title: 'Chevrolet Onix 2023', price: '120.000', image: './images/i10.jpg', km: '32.400', year: 2023, location: 'Benguela', fuel: 'Gasolina', condition: 'Usado' },

		{ id: 5, title: 'Toyota RAV4 2024', price: '220.000', image: './images/i10.jpg', km: '8.900', year: 2024, location: 'Luanda', fuel: 'Híbrido', condition: 'Novo' },
		{ id: 6, title: 'Nissan Kicks 2023', price: '140.000', image: './images/i10.jpg', km: '25.600', year: 2023, location: 'Luanda', fuel: 'Gasolina', condition: 'Usado' },
		{ id: 7, title: 'Hyundai Tucson 2024', price: '190.000', image: './images/i10.jpg', km: '12.300', year: 2024, location: 'Huambo', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 8, title: 'Ford EcoSport 2023', price: '160.000', image: './images/i10.jpg', km: '38.700', year: 2023, location: 'Luanda', fuel: 'Gasolina', condition: 'Usado' },

		{ id: 9, title: 'Mercedes-Benz Classe A', price: '280.000', image: './images/i10.jpg', km: '18.200', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 10, title: 'BMW X1 2024', price: '320.000', image: './images/i10.jpg', km: '5.400', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 11, title: 'Volkswagen T-Cross 2023', price: '170.000', image: './images/i10.jpg', km: '29.800', year: 2023, location: 'Benguela', fuel: 'Gasolina', condition: 'Usado' },
		{ id: 12, title: 'Kia Sportage 2024', price: '210.000', image: './images/i10.jpg', km: '11.500', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },

		{ id: 13, title: 'Toyota Hilux 2024', price: '300.000', image: './images/i10.jpg', km: '7.800', year: 2024, location: 'Luanda', fuel: 'Diesel', condition: 'Novo' },
		{ id: 14, title: 'Honda Civic 2023', price: '180.000', image: './images/i10.jpg', km: '35.200', year: 2023, location: 'Huambo', fuel: 'Gasolina', condition: 'Usado' },
		{ id: 15, title: 'Mazda CX-5 2024', price: '230.000', image: './images/i10.jpg', km: '14.600', year: 2024, location: 'Luanda', fuel: 'Gasolina', condition: 'Novo' },
		{ id: 16, title: 'Audi A3 2023', price: '290.000', image: './images/i10.jpg', km: '22.100', year: 2023, location: 'Luanda', fuel: 'Gasolina', condition: 'Usado' }
	];

	// Cálculos de paginação
	const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
	const indexOfLastVehicle = currentPage * vehiclesPerPage;
	const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
	const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

	const steps = [
		{
			number: '01',
			label: 'PASSO',
			title: 'Pesquise Disponibilidade',
			description: 'Indique as datas e a localização para ver todas as viaturas disponíveis na sua zona.',
			icon: Search,
		},
		{
			number: '02',
			label: 'PASSO',
			title: 'Compare Ofertas',
			description: 'Analise preços, características e condições de diferentes fornecedores para encontrar a melhor opção.',
			icon: GitCompare,
		},
		{
			number: '03',
			label: 'PASSO',
			title: 'Reserve com Segurança',
			description: 'Entre em contacto direto com o parceiro e finalize a sua reserva de forma rápida e segura.',
			icon: Key,
		},
		{
			number: '04',
			label: 'PASSO',
			title: 'Levante e Conduza',
			description: 'Receba a viatura no local combinado e desfrute da sua viagem com total tranquilidade.',
			icon: CheckCircle2,
		}
	];

	return (
		<main className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
			{/* Hero Section */}
			<section className="px-6 bg-[#154c9a] text-white relative overflow-hidden isolate h-[calc(100vh-80px)] flex items-center">
				<div
					className="absolute inset-0 -z-10 opacity-10"
					style={{
						backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
					}}
				></div>

				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>

				<div className="max-w-4xl mx-auto text-center relative z-10 w-full">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 mb-6 backdrop-blur-sm">
						<Key className="w-5 h-5" />
						<span className="font-medium">Rent-a-Car Simplificado</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
						Aluguer de Viaturas
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
						Encontre o carro perfeito para a sua viagem, negócios ou eventos. Flexibilidade e os melhores preços numa só plataforma.
					</p>
				</div>
			</section>

			<div className='max-w-7xl mx-auto'>
				{/* Timeline Steps */}
				<section className="pt-8 pb-4 px-6 overflow-hidden">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-10">
							<span className="text-[#154c9a] font-bold tracking-wider uppercase text-sm mb-2 block">Como Funciona</span>
							<h2 className="text-3xl font-bold text-gray-900">Alugar nunca foi tão fácil</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							{steps.map((step, index) => (
								<div key={step.number} className="relative group">
									<div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-[0_8px_30px_rgb(21,76,154,0.12)] p-8 border-2 border-blue-100/50 hover:shadow-2xl hover:border-[#154c9a]/30 hover:from-white hover:to-blue-50 transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden h-full flex flex-col">
										<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -m-10 opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>

										<div className="relative mb-6 flex flex-col items-center text-center">
											<div className="w-20 h-20 bg-gradient-to-br from-white to-blue-50 rounded-full shadow-[0_4px_20px_rgba(21,76,154,0.25)] flex flex-col items-center justify-center border-[5px] border-[#154c9a] group-hover:border-[6px] group-hover:scale-110 group-hover:shadow-[0_6px_25px_rgba(21,76,154,0.35)] transition-all duration-300 mb-4">
												<span className="text-[10px] font-bold text-[#154c9a] uppercase tracking-widest">{step.label}</span>
												<span className="text-3xl font-black bg-gradient-to-br from-[#154c9a] to-blue-700 bg-clip-text text-transparent leading-none">{step.number}</span>
											</div>

											<div className="w-16 h-16 bg-gradient-to-br from-[#154c9a] to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(21,76,154,0.3)] text-white transform group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-[0_6px_20px_rgba(21,76,154,0.4)] transition-all duration-300 mb-5">
												<step.icon size={30} strokeWidth={2.5} />
											</div>

											<h3 className="text-xl font-bold text-gray-800 group-hover:text-[#154c9a] transition-colors mb-1">{step.title}</h3>
										</div>

										<p className="text-base text-gray-600 leading-relaxed font-medium text-center mt-auto">
											{step.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Seção de Veículos com Sidebar Filter */}
				<section className="py-8 px-6">
					<div className="max-w-7xl mx-auto">
						<div className="flex flex-col lg:flex-row gap-8">
							{/* Sidebar - Filtros */}
							<aside className="w-full lg:w-80 flex-shrink-0">
								<div className="sticky top-6">
									<h2 className="text-xl font-bold text-gray-800 mb-4">Filtrar Veículos</h2>
									<VehicleFilter onFilterChange={handleFilterChange} />
								</div>
							</aside>

							{/* Main Content - Grid de Veículos */}
							<main className="flex-1">
								<div className="mb-6 flex items-center justify-between">
									<p className="text-gray-600">
										<span className="font-semibold text-gray-900">{vehicles.length} veículos</span> disponíveis
									</p>
									<select className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
										<option>Ordenar por: Relevância</option>
										<option>Preço: Menor para Maior</option>
										<option>Preço: Maior para Menor</option>
										<option>Mais Recentes</option>
									</select>
								</div>

								<div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-6">
									{currentVehicles.map((car) => (
										<article
											key={car.id}
											className="flex-shrink-0 w-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
										>
											{/* Imagem */}
											<div className="relative h-40 overflow-hidden" onclick={() => navigate(`/servicos/aluguel-de-automoveis/${car.id}`)}>
												<img
													src={car.image}
													alt={car.title}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
													onError={(e) => { e.target.src = '/images/i10.jpg'; }}
												/>

												{/* Badge de condição (Novo / Usado) */}
												<div className="absolute top-4 left-4">
													<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${car.condition === 'Novo' ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white'}`}>
														{car.condition}
													</span>
												</div>

												{/* Gradiente inferior */}
												<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
											</div>

											{/* Conteúdo */}
											<div className="p-5">
												<h3 className="text-1xl font-bold text-gray-900 mb-3 line-clamp-1 text-center">
													{car.title}
												</h3>

												{/* Preço */}
												<div
													style={{ color: 'var(--primary)' }}
													className="text-1xl font-bold mb-4 text-center"
												>
													{car.price},00 akz
												</div>

												{/* Especificações (duas colunas) */}
												<div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
													<div className="flex items-center justify-end gap-2">
														<span className="text-right">{car.km}</span>
														<Gauge className="w-4 h-4 text-gray-400" />
													</div>
													<div className="flex items-center gap-2">
														<Calendar className="w-4 h-4 text-gray-400" />
														<span>{car.year}</span>
													</div>
													<div className="flex items-center justify-end gap-2">
														<span className="text-right">{car.location}</span>
														<MapPin className="w-4 h-4 text-gray-400" />
													</div>
													<div className="flex items-center gap-2">
														<Droplet className="w-4 h-4 text-gray-400" />
														<span>{car.fuel}</span>
													</div>
												</div>

												{/* Botão */}
												<button
													onClick={() => navigate(`/servicos/aluguel-de-automoveis/${car.id}`)}
													style={{ backgroundColor: 'var(--secondary)' }}
													className="w-full mt-4 py-2 text-sm text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm cursor-pointer"
												>
													Ver Detalhes
												</button>
											</div>
										</article>
									))}
								</div>

								{/* Pagination */}
								<div className="mt-12">
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={handlePageChange}
									/>
								</div>
							</main>
						</div>
					</div>
				</section>
			</div>

		</main>
	);
}
