import React, { useState, useEffect, useRef } from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { notyf } from '../services/api'
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	Send,
	MessageSquare,
	Facebook,
	Instagram,
	Linkedin,
	ArrowRight
} from 'lucide-react'
import { useSendContact } from '../hooks/queries/useContact'

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

export default function Contato() {
	useDocumentTitle('Contactos - Caxiauto')

	const [formData, setFormData] = useState({
		nome: '',
		email: '',
		telefone: '',
		assunto: '',
		mensagem: ''
	})

	const sendContactMutation = useSendContact()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await sendContactMutation.mutateAsync(formData)
			if (response.success) {
				notyf.success(response.msg || 'Mensagem enviada com sucesso!')
				setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
			} else {
				notyf.error(response.msg || 'Erro ao enviar mensagem')
			}
		} catch (error) {
			console.error('Erro ao enviar contacto:', error)
			notyf.error('Erro ao enviar mensagem')
		}
	}

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const contactMethods = [
		{
			icon: Phone,
			title: 'Ligue-nos',
			info: '+244 930 723 503',
			subInfo: 'Segunda a Sexta, 8h às 18h',
			action: 'tel:+244923456789',
			actionLabel: 'Ligar agora'
		},
		{
			icon: Mail,
			title: 'Envie um Email',
			info: 'info@caxiauto.com',
			subInfo: 'Respondemos em até 24 horas',
			action: 'mailto:geral@caxiauto.ao',
			actionLabel: 'Enviar email'
		},
		{
			icon: MapPin,
			title: 'Visite-nos',
			info: 'Rua Principal, Luanda',
			subInfo: 'Angola',
			action: '#map',
			actionLabel: 'Ver no mapa'
		}
	]

	const [heroLineDrawn, setHeroLineDrawn] = useState(
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)

	useEffect(() => {
		if (heroLineDrawn) return
		const timer = setTimeout(() => setHeroLineDrawn(true), 500)
		return () => clearTimeout(timer)
	}, [heroLineDrawn])

	const [cardsRef, cardsVisible] = useScrollReveal()
	const [formRef, formVisible] = useScrollReveal()

	return (
		<main>
			<section className="relative min-h-[calc(100dvh-80px)] flex items-center bg-gradient-to-b from-[#eef3fa] via-white to-white overflow-hidden">
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full border border-[#d41120] opacity-[0.06]" />
				<div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full border border-[#d41120] opacity-[0.04]" />

				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-6">
							<MessageSquare className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Estamos aqui para ajudar</span>
						</div>
						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#111827] leading-[1.08] mb-8 [text-wrap:balance]">
							Fale{' '}
							<span className="text-[#d41120]">Connosco</span>
						</h1>

						<div className="flex justify-center mb-10">
							<div
								className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out ${
									heroLineDrawn ? 'w-40' : 'w-0'
								}`}
							/>
						</div>

						<p className="font-body text-lg sm:text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
							Tem dúvidas sobre os nossos serviços ou quer saber mais sobre uma viatura? Entre em contacto com a nossa equipa.
						</p>
					</div>
				</div>
			</section>

			<section ref={cardsRef} className="bg-white py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
							<MessageSquare className="w-4 h-4" />
							<span className="text-sm font-semibold font-body">Canais de Atendimento</span>
						</div>
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827]">
							Como nos Contactar
						</h2>
						<p className="font-body mt-4 text-lg text-[#6b7280]">
							Escolha o canal mais conveniente para si.
						</p>
					</div>

					<div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
						{contactMethods.map((method, index) => (
							<div
								key={index}
								className={`group relative bg-white p-8 rounded-2xl border border-[#e5e7eb] transition-all duration-500 ease-out hover:border-[#154c9a]/20 ${
									cardsVisible
										? 'opacity-100 translate-y-0'
										: 'opacity-0 translate-y-6'
								}`}
								style={{ transitionDelay: cardsVisible ? `${index * 80}ms` : '0ms' }}
							>
								<div className="w-12 h-12 bg-[#d41120] rounded-xl flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300">
									<method.icon className="h-6 w-6" />
								</div>
								<h3 className="font-display text-lg font-bold text-[#111827] mb-2 group-hover:text-[#154c9a] transition-colors duration-300">
									{method.title}
								</h3>
								<p className="font-body text-[#6b7280] leading-relaxed mb-1 font-semibold text-[#154c9a]">
									{method.info}
								</p>
								<p className="font-body text-sm text-[#6b7280] mb-6">{method.subInfo}</p>
								<a
									href={method.action}
									className="mt-auto inline-flex items-center justify-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-800 transition-all duration-300 text-sm font-body group"
								>
									{method.actionLabel}
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</a>
							</div>
						))}
					</div>
				</div>
			</section>

			<section ref={formRef} className="bg-[#f8f6f2] py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">

						{/* Left: Form Card */}
						<div
							className={`bg-white rounded-2xl p-12 lg:p-16 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-700 ease-out ${
								formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							}`}
						>
							<div className="w-16 h-[3px] bg-[#d41120] rounded-full mb-6" />

							<h2 className="font-display text-3xl font-bold text-[#111827] mb-4">
								Envie uma Mensagem
							</h2>
							<p className="font-body text-[#6b7280] mb-10 max-w-lg">
								Preencha o formulário e a nossa equipa entrará em contacto consigo o mais breve possível.
							</p>

							<form onSubmit={handleSubmit} className="space-y-5">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									<div>
										<label className="block font-body text-sm font-medium text-[#6b7280] mb-2">Nome Completo</label>
										<input
											type="text"
											name="nome"
											value={formData.nome}
											onChange={handleChange}
											required
											className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#d41120] focus:ring-1 focus:ring-[#d41120]/20"
											placeholder="Seu nome"
										/>
									</div>
									<div>
										<label className="block font-body text-sm font-medium text-[#6b7280] mb-2">Email</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#d41120] focus:ring-1 focus:ring-[#d41120]/20"
											placeholder="seu@email.com"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									<div>
										<label className="block font-body text-sm font-medium text-[#6b7280] mb-2">Telefone</label>
										<input
											type="tel"
											name="telefone"
											value={formData.telefone}
											onChange={handleChange}
											required
											className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#d41120] focus:ring-1 focus:ring-[#d41120]/20"
											placeholder="+244 912 345 678"
										/>
									</div>
									<div>
										<label className="block font-body text-sm font-medium text-[#6b7280] mb-2">Assunto</label>
										<select
											name="assunto"
											value={formData.assunto}
											onChange={handleChange}
											required
											className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] outline-none transition-all font-body text-[#111827] bg-white focus:border-[#d41120] focus:ring-1 focus:ring-[#d41120]/20"
										>
											<option value="">Selecione um assunto</option>
											<option value="vendas">Comprar Viatura</option>
											<option value="aluguel">Aluguer</option>
											<option value="pecas">Peças</option>
											<option value="seguro">Seguro</option>
											<option value="financeiro">Financeiro</option>
											<option value="outro">Outro</option>
										</select>
									</div>
								</div>

								<div>
									<label className="block font-body text-sm font-medium text-[#6b7280] mb-2">Mensagem</label>
									<textarea
										name="mensagem"
										value={formData.mensagem}
										onChange={handleChange}
										rows="4"
										required
										className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#d41120] focus:ring-1 focus:ring-[#d41120]/20 resize-none"
										placeholder="Como podemos ajudar?"
									/>
								</div>

								<button
									type="submit"
									disabled={sendContactMutation.isPending}
									className="w-full py-4 bg-[#154c9a] text-white rounded-xl font-semibold font-body text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
								>
									{sendContactMutation.isPending ? (
										<>
											<svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Enviando...
										</>
									) : (
										<>
											<Send className="w-5 h-5 group-hover:text-[#d41120] transition-colors" />
											Enviar Mensagem
										</>
									)}
								</button>
							</form>
						</div>

						{/* Right: Info Cards */}
						<div className="space-y-6">

							<div
								className={`bg-gradient-to-br from-[#eef3fa] to-white rounded-2xl p-8 border border-[#e5e7eb]/60 transition-all duration-700 ease-out ${
									formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
								}`}
								style={{ transitionDelay: formVisible ? '100ms' : '0ms' }}
							>
								<div className="relative pl-5 border-l-[3px] border-[#d41120] mb-6">
									<h3 className="font-display text-lg font-bold text-[#111827]">
										Horário de Funcionamento
									</h3>
								</div>

								<div className="space-y-5">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 rounded-xl bg-[#154c9a] flex items-center justify-center text-white shrink-0">
											<Clock className="w-5 h-5" />
										</div>
										<div>
											<p className="font-body text-sm text-[#6b7280]">Seg - Sex</p>
											<p className="font-body font-semibold text-[#111827]">08:00 - 18:00</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 rounded-xl bg-[#154c9a] flex items-center justify-center text-white shrink-0">
											<Clock className="w-5 h-5" />
										</div>
										<div>
											<p className="font-body text-sm text-[#6b7280]">Sábado</p>
											<p className="font-body font-semibold text-[#111827]">09:00 - 13:00</p>
										</div>
									</div>
								</div>
							</div>

							<div
								className={`bg-gradient-to-br from-[#eef3fa] to-white rounded-2xl p-8 border border-[#e5e7eb]/60 transition-all duration-700 ease-out ${
									formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
								}`}
								style={{ transitionDelay: formVisible ? '200ms' : '0ms' }}
							>
								<div className="relative pl-5 border-l-[3px] border-[#d41120] mb-6">
									<h3 className="font-display text-lg font-bold text-[#111827]">
										Redes Sociais
									</h3>
								</div>

								<p className="font-body text-sm text-[#6b7280] mb-5">Acompanhe-nos nas redes sociais</p>

								<div className="flex gap-3">
									<a
										href="https://www.facebook.com/TeamBuil.ea/"
										className="w-10 h-10 rounded-xl bg-[#154c9a] flex items-center justify-center text-white hover:bg-[#d41120] transition-all duration-300"
									>
										<Facebook size={18} />
									</a>
									<a
										href="https://www.instagram.com/caxiauto.ao/"
										className="w-10 h-10 rounded-xl bg-[#154c9a] flex items-center justify-center text-white hover:bg-[#d41120] transition-all duration-300"
									>
										<Instagram size={18} />
									</a>
									<a
										href="https://www.tiktok.com/@caxiauto5?_r=1&_t=ZS-97KGKjNnijt"
										className="w-10 h-10 rounded-xl bg-[#154c9a] flex items-center justify-center text-white hover:bg-[#d41120] transition-all duration-300"
									>
										<svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
											<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
										</svg>
									</a>
									<a
										href="https://www.linkedin.com/groups/25430014"
										className="w-10 h-10 rounded-xl bg-[#154c9a] flex items-center justify-center text-white hover:bg-[#d41120] transition-all duration-300"
									>
										<Linkedin size={18} />
									</a>
								</div>
							</div>

						</div>

					</div>
				</div>
			</section>

			<section className="bg-[#154c9a] py-20 overflow-hidden">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
							Precisa de Ajuda?
						</h2>
						<p className="font-body text-lg text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
							A nossa equipa está disponível para esclarecer todas as suas dúvidas.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="tel:+244930723503"
								className="inline-flex items-center justify-center gap-2 bg-white text-[#154c9a] px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body group"
							>
								<Phone className="w-5 h-5" />
								Ligar Agora
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</a>
							<a
								href="mailto:info@caxiauto.com"
								className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 font-body group"
							>
								<Mail className="w-5 h-5" />
								Enviar Email
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
