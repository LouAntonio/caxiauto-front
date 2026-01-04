import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Sobre() {
	useDocumentTitle('Sobre - Caxiauto')

	return (
		<main className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-bold">Sobre</h1>
			<p className="mt-4 text-gray-700">Informações sobre a empresa.</p>
		</main>
	)
}
