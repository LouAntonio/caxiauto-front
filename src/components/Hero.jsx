import React from 'react'

export default function Hero() {
	return (
		<header className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-transparent text-white overflow-hidden">
			<div
				className="absolute inset-0 bg-cover bg-center opacity-60"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1650&q=80')",
				}}
				aria-hidden="true"
			/>

			<div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
				<div className="max-w-3xl">
					<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-md">
						Escolha o seu carro online.
						<br />
						Nós inspecionamos e entregamos em Angola.
					</h1>
					<p className="mt-6 text-indigo-100">Encontre o seu próximo carro sem sair de casa — inspecionado e entregue em Luanda e em todo o país.</p>
				</div>

				<div className="mt-10 max-w-2xl bg-white/80 text-gray-800 rounded-lg p-6 shadow-lg">
					<form className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
						<div>
							<label className="sr-only">Fabricante</label>
							<select className="w-full border rounded px-3 py-2">
								<option disabled>Fabricante</option>
								<option>Toyota</option>
								<option>Ford</option>
								<option>Chevrolet</option>
								<option>Honda</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Combustível</label>
							<select className="w-full border rounded px-3 py-2">
								<option disabled>Combustível</option>
								<option>Gasolina</option>
								<option>Diesel</option>
								<option>Elétrico</option>
								<option>Híbrido</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Preço até</label>
							<select className="w-full border rounded px-3 py-2">
								<option>Preço até (Kz)</option>
								<option>Até 5.000.000 Kz</option>
								<option>Até 10.000.000 Kz</option>
								<option>Até 20.000.000 Kz</option>
							</select>
						</div>

						<div className="flex gap-3 items-center">
							<button
								type="button"
								className="ml-auto text-white font-semibold px-4 py-2 rounded"
								style={{ backgroundColor: 'var(--primary)' }}
							>
								Pesquisar
							</button>
						</div>
					</form>

					<div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<span className="text-yellow-400">★★★★☆</span>
							<span className="font-semibold text-gray-800">4.8</span>
							<span className="text-gray-500">1894 avaliações</span>
						</div>
					</div>
				</div>

				<div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
					<div className="bg-white/90 rounded-lg p-6 text-gray-800 shadow">
						<h3 className="font-semibold">Garantia de devolução</h3>
						<p className="mt-2 text-sm text-gray-600">Se não ficar satisfeito com o veículo, devolva-o dentro do prazo e reembolsamos.</p>
					</div>
					<div className="bg-white/90 rounded-lg p-6 text-gray-800 shadow">
						<h3 className="font-semibold">Compra segura</h3>
						<p className="mt-2 text-sm text-gray-600">Garantimos a condição técnica de cada veículo vendido em Angola.</p>
					</div>
					<div className="bg-white/90 rounded-lg p-6 text-gray-800 shadow">
						<h3 className="font-semibold">Garantia de 6 meses</h3>
						<p className="mt-2 text-sm text-gray-600">Receba uma garantia estendida de 6 meses com cada carro.</p>
					</div>
				</div>
			</div>
		</header>
	)
}
