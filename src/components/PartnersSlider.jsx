import React from 'react';
import PartnerCard from './PartnerCard';
import PartnerCardSkeleton from './PartnerCardSkeleton';
import { Link } from 'react-router-dom';
import { useActivePartners } from '../hooks/queries/usePartners';

export default function PartnersSlider() {
	const { data: partners, isLoading } = useActivePartners({ limit: 4 });

	return (
		<section className="py-16 bg-[#f8f6f2] rounded-2xl my-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef3fa] text-[#154c9a] mb-4">
						<span className="text-sm font-semibold font-body">Empresas</span>
					</div>
					<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-3">
						Empresas
					</h2>
					<p className="font-body text-lg text-[#6b7280] max-w-2xl mx-auto">
						Conheça as empresas que trabalham connosco para oferecer os melhores serviços e produtos.
					</p>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<PartnerCardSkeleton count={4} />
					</div>
				) : partners?.length === 0 ? null : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
							{partners?.map((partner) => (
								<PartnerCard key={partner.id} partner={partner} />
							))}
						</div>

						<div className="text-center">
							<Link
								to="/parceiros"
								className="inline-flex items-center justify-center gap-2 bg-[#154c9a] hover:bg-[#0c2d5e] text-white px-8 py-4 rounded-2xl font-semibold font-body transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
							>
								Ver Todos os Parceiros
							</Link>
						</div>
					</>
				)}
			</div>
		</section>
	);
}
