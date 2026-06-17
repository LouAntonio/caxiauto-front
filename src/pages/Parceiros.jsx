import React, { useState, useEffect, useRef } from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Handshake, ArrowRight, Car, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import PartnerCard from '../components/PartnerCard'
import PartnerCardSkeleton from '../components/PartnerCardSkeleton'
import api from '../services/api'

function useScrollReveal(threshold = 0.15) {
	const ref = useRef(null)
	const [isVisible, setIsVisible] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (isVisible) return
		const el = ref.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					observer.unobserve(el)
				}
			},
			{ threshold }
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [threshold, isVisible])

	return [ref, isVisible]
}

export default function Parceiros() {
	useDocumentTitle('Parceiros - Caxiauto')

	const [heroLineDrawn, setHeroLineDrawn] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (heroLineDrawn) return
		const timer = setTimeout(() => setHeroLineDrawn(true), 500)
		return () => clearTimeout(timer)
	}, [heroLineDrawn])

	const [partners, setPartners] = useState([])
	const [loading, setLoading] = useState(true)
	const [gridRef, gridVisible] = useScrollReveal()

	useEffect(() => {
		const loadPartners = async () => {
			try {
				const response = await api.listActivePartners()
				if (response.success) {
					setPartners(response.data)
				}
			} catch (error) {
				console.error('Erro ao carregar parceiros:', error)
			} finally {
				setLoading(false)
			}
		}

		loadPartners()
	}, [])

	return (
		<main>
			{/* Hero */}
			<section className="relative min-h-[calc(100dvh-80px)] flex items-center bg-gradient-to-b from-[#eef3fa] via-white to-white overflow-hidden">
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full border border-[#d41120] opacity-[0.06]" />
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full border border-[#d41120] opacity-[0.04]" />

				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-10">
							<Handshake className="w-4 h-4" />
							<span className="text-sm font-semibold tracking-wide font-body">Nossos Parceiros</span>
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#111827] leading-[1.08] mb-8 [text-wrap:balance]">
							Empresas {' '}
							<span className="text-[#d41120]">que confiam na Caxiauto</span>
						</h1>

						<div className="flex justify-center mb-10">
							<div
								className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${
									heroLineDrawn ? 'w-40' : 'w-0'
								}`}
							/>
						</div>

						<p className="font-body text-lg sm:text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
							Conheça as empresas que trabalham connosco para oferecer os melhores serviços e produtos automóveis em Angola.
						</p>
					</div>
				</div>
			</section>

			{/* Partners Grid */}
			<section ref={gridRef} className="bg-white border-t border-[#e5e7eb] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<PartnerCardSkeleton count={8} />
						</div>
					) : partners.length === 0 ? (
						<div className="text-center py-20">
							<div className="w-16 h-16 bg-[#eef3fa] rounded-2xl flex items-center justify-center mx-auto mb-6">
								<Handshake className="w-8 h-8 text-[#154c9a]" />
							</div>
							<p className="font-body text-lg text-[#6b7280]">Nenhum parceiro encontrado</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{partners.map((partner, index) => (
								<div
									key={partner.id}
									className={`transition-all duration-500 ease-out ${
										gridVisible
											? 'opacity-100 translate-y-0'
											: 'opacity-0 translate-y-6'
									}`}
									style={{ transitionDelay: gridVisible ? `${index * 60}ms` : '0ms' }}
								>
									<PartnerCard partner={partner} />
								</div>
							))}
						</div>
					)}
				</div>
			</section>

			{/* CTA */}
			<section className="bg-[#154c9a] py-20 overflow-hidden">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
							Quer fazer parte da nossa rede de parceiros?
						</h2>
						<p className="font-body text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
							Junte-se às empresas que confiam na Caxiauto para crescer e conectar-se com milhares de clientes em Angola.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								to="/contato"
								className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group"
							>
								<Handshake className="w-5 h-5" />
								Fale Connosco
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
							<Link
								to="/servicos/compra-de-viaturas"
								className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 font-body group"
							>
								<Car className="w-5 h-5" />
								Explorar Veículos
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
