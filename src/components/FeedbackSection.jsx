import React from 'react'
import { Star, Quote } from 'lucide-react'

const reviews = [
	{
		name: 'João M.',
		initials: 'JM',
		rating: 5,
		date: 'há 3 dias',
		text: 'Comprei o meu primeiro carro pela Caxiauto e foi uma experiência incrível. A equipa ajudou-me em todo o processo, desde a escolha até à documentação. Recomendo de olhos fechados!',
	},
	{
		name: 'Maria A.',
		initials: 'MA',
		rating: 4,
		date: 'há 1 semana',
		text: 'Aluguei uma viatura para uma viagem em família e correu tudo bem. O processo foi simples e o carro estava em óptimo estado. Só acho que podiam ter mais opções de SUV.',
	},
	{
		name: 'Pedro S.',
		initials: 'PS',
		rating: 5,
		date: 'há 2 semanas',
		text: 'Vendi o meu carro em menos de uma semana e por um preço justo. A Caxiauto cuidou de toda a papelada e ainda me ajudou a encontrar o próximo. Serviço completo e sem dores de cabeça.',
	},
	{
		name: 'Ana C.',
		initials: 'AC',
		rating: 4,
		date: 'há 3 semanas',
		text: 'Comprei peças para o meu carro e chegaram rápido. O site é fácil de usar e o suporte foi rápido a responder às minhas dúvidas. Vou repetir a experiência.',
	},
]

function Stars({ rating }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map(star => (
				<Star
					key={star}
					size={14}
					fill={star <= rating ? '#d41120' : 'none'}
					className={star <= rating ? 'text-[#d41120]' : 'text-[#e5e7eb]'}
				/>
			))}
		</div>
	)
}

function Avatar({ initials, rating }) {
	const bg = rating === 5 ? 'bg-[#154c9a]' : 'bg-[#6b7280]'
	return (
		<div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-white text-xs font-semibold font-body flex-shrink-0`}>
			{initials}
		</div>
	)
}

function getBorderStyle(rating) {
	const opacity = rating === 5 ? 1 : 0.4
	return { borderLeft: `3px solid rgba(212, 17, 32, ${opacity})` }
}

export default function FeedbackSection() {
	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="text-center">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef3fa] text-[#154c9a] text-xs font-semibold font-body tracking-wide">
						<Quote size={14} />
						Testemunhos
					</div>
					<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mt-4">
						O que dizem quem já <span className="text-[#154c9a]">rodou</span> connosco
					</h2>
					<p className="font-body text-[#6b7280] max-w-2xl mx-auto text-lg mt-3">
						De quem comprou a quem vendeu, de quem alugou a quem encontrou a peça certa — a opinião de quem usa a Caxiauto
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
					{reviews.map((review) => (
						<div
							key={review.name}
							style={getBorderStyle(review.rating)}
							className="relative bg-white border border-[#e5e7eb] p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
						>
							<div
								className="absolute top-4 right-6 text-[#e5e7eb] select-none pointer-events-none"
								aria-hidden="true"
							>
								<Quote size={48} />
							</div>

							<div className="flex items-start gap-4 mb-4 relative z-10">
								<Avatar initials={review.initials} rating={review.rating} />
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between gap-2">
										<h3 className="font-display font-semibold text-[#111827] text-sm truncate">
											{review.name}
										</h3>
										<Stars rating={review.rating} />
									</div>
									<span className="font-body text-xs text-[#9ca3af]">
										{review.date}
									</span>
								</div>
							</div>

							<p className="font-body text-sm text-[#6b7280] leading-relaxed relative z-10">
								&ldquo;{review.text}&rdquo;
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
