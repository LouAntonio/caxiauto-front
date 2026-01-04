import React from 'react'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default function VendaDePecas() {
	useDocumentTitle('Venda de Peças e Acessórios - Caxiauto')

	return (
		<main className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-bold">Venda de Peças e Acessórios</h1>
			<p className="mt-4 text-gray-700">Página de venda de peças e acessórios.</p>
		</main>
	)
}
