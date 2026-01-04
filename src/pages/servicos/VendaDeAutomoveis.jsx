import React from 'react'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default function VendaDeAutomoveis() {
	useDocumentTitle('Venda de Automóveis - Caxiauto')

	return (
		<main className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-bold">Venda de Automóveis</h1>
			<p className="mt-4 text-gray-700">Página de venda de automóveis.</p>
		</main>
	)
}
