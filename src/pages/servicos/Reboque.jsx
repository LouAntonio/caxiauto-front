import React from 'react'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export default function Reboque() {
	useDocumentTitle('Reboque - Caxiauto')

	return (
		<main className="max-w-7xl mx-auto p-6">
			<h1 className="text-3xl font-bold">Reboque</h1>
			<p className="mt-4 text-gray-700">Serviço de reboque e assistência.</p>
		</main>
	)
}
