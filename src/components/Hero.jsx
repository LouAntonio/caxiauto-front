import React from 'react'

export default function Hero() {
	return (
		<header className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-transparent text-white overflow-hidden h-[calc(100vh-80px)]">
			<div
				className="absolute inset-0 bg-cover bg-center opacity-60"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1650&q=80')",
				}}
				aria-hidden="true"
			/>

			<div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center gap-8">
				<div className="max-w-3xl">
					<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-md">
						Escolha o seu carro online.
					</h1>
					<p className="mt-6 text-indigo-100">Encontre o seu próximo carro sem sair de casa — inspecionado e entregue em Luanda e em todo o país.</p>
				</div>

				<div className="w-full max-w-xl bg-white/80 text-gray-800 rounded-lg p-4 shadow-lg">
					<form className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
						<div>
							<label className="sr-only">Marca</label>
							<select className="w-full max-w-[220px] mx-auto border rounded px-3 py-2 bg-white">
								<option disabled selected>Marca</option>
								<option>Toyota</option>
								<option>Ford</option>
								<option>Chevrolet</option>
								<option>Honda</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Combustível</label>
							<select className="w-full max-w-[220px] mx-auto border rounded px-3 py-2 bg-white">
								<option disabled selected>Combustível</option>
								<option>Gasolina</option>
								<option>Diesel</option>
								<option>Elétrico</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Transmissão</label>
							<select className="w-full max-w-[220px] mx-auto border rounded px-3 py-2 bg-white">
								<option disabled selected>Transmissão</option>
								<option>Manual</option>
								<option>Automática</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Quilômetros até</label>
							<select className="w-full max-w-[220px] mx-auto border rounded px-3 py-2 bg-white">
								<option disabled selected>Quilômetros até</option>
								<option>50.000 km</option>
								<option>100.000 km</option>
								<option>200.000 km</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Ano até</label>
							<select className="w-full max-w-[220px] mx-auto border rounded px-3 py-2 bg-white">
								<option disabled selected>Ano até</option>
								<option>2024</option>
								<option>2020</option>
								<option>2015</option>
							</select>
						</div>

						<div>
							<label className="sr-only">Preço</label>
							<select className="w-full max-w-[220px] mx-auto border rounded px-3 py-2 bg-white">
								<option disabled selected>Preço até (Kz)</option>
								<option>Até 5.000.000 Kz</option>
								<option>Até 10.000.000 Kz</option>
								<option>Até 20.000.000 Kz</option>
							</select>
						</div>

					</form>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
