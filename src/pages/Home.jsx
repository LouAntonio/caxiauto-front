import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Hero from '../components/Hero'
import TrustedVehicles from '../components/TrustedVehicles'
import FeaturedCars from '../components/FeaturedCars'

export default function Home() {
	useDocumentTitle('Página Inicial - Caxiauto')

	return (
		<>
			<Hero />
			<main className="max-w-7xl mx-auto p-6">
				<TrustedVehicles />
				<FeaturedCars />
			</main>
		</>
	)
}
