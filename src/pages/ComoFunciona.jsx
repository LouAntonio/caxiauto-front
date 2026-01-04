import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function ComoFunciona() {
	useDocumentTitle('Como Funciona - Caxiauto')

	return (
		<main className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-bold">Como Funciona</h1>
			<p className="mt-4 text-gray-700">Descrição do funcionamento dos serviços.</p>
		</main>
	)
}
