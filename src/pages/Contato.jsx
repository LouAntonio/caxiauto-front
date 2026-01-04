import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Contato() {
	useDocumentTitle('Contato - Caxiauto')

	return (
		<main className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-bold">Contato</h1>
			<p className="mt-4 text-gray-700">Entre em contato conosco através do formulário ou telefone.</p>
		</main>
	)
}
