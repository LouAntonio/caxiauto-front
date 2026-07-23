import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Download, Printer } from 'lucide-react';

const SectionBlock = ({ num, title, children }) => (
	<div className="border-t border-[#e5e7eb] py-12 first:border-t-0 first:pt-0">
		<div className="sm:hidden mb-4 flex items-center gap-3">
			<span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#fde8ea] text-[#d41120] font-black font-display text-base">
				{num}
			</span>
			<span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider font-body">Secção</span>
		</div>
		<div className="flex items-start gap-5 sm:gap-8">
			<div className="hidden sm:flex flex-col items-center flex-shrink-0 w-12">
				<span className="font-display text-[#d41120] font-black text-[2.75rem] leading-none tracking-tight select-none">
					{String(num).padStart(2, '0')}
				</span>
				<div className="w-px flex-1 bg-gradient-to-b from-[#d41120]/20 to-transparent mt-4" />
			</div>
			<div className="flex-1 min-w-0">
				<h4 className="font-display text-xl sm:text-2xl font-bold text-[#111827] mb-6 leading-snug">
					{title}
				</h4>
				<div className="text-gray-700 leading-relaxed font-body">
					{children}
				</div>
			</div>
		</div>
	</div>
);

const Legal = () => {
	const location = useLocation();
	const isPrivacy = location.pathname === '/politica-de-privacidade';

	useDocumentTitle(isPrivacy ? 'Política de Privacidade - CaxiAuto' : 'Termos de Uso - CaxiAuto');

	const [heroLineDrawn, setHeroLineDrawn] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setHeroLineDrawn(true), 500);
		return () => clearTimeout(timer);
	}, []);

	const handlePrint = () => {
		window.print();
	};

	const pageTitle = isPrivacy ? 'Política de Privacidade' : 'Termos e Condições de Uso';

	const privacyContent = (
		<>
			<SectionBlock num={1} title="Identificação do Responsável pelo Tratamento de Dados">
				<p className="mb-4">
					A CAXIAUTO é uma plataforma digital de origem angolana, dedicada à comercialização de viaturas, acessórios e serviços relacionados ao sector automóvel. A plataforma está disponível ao público em geral, abrangendo tanto empresas como pessoas singulares domiciliadas na República de Angola e no exterior.
				</p>
				<p>
					Para efeitos da presente política, o responsável pelo tratamento de dados é a entidade gestora da plataforma CAXIAUTO, com sede em Luanda, Angola, podendo ser contactada através dos canais oficiais disponibilizados no sítio electrónico <a href="https://www.caxiauto.ao" className="text-[#154c9a] hover:underline">www.caxiauto.ao</a>.
				</p>
			</SectionBlock>

			<SectionBlock num={2} title="Base Legal e Enquadramento Jurídico">
				<p className="mb-4">A CAXIAUTO pauta a sua actuação em conformidade com a legislação angolana vigente, nomeadamente:</p>
				<ul className="list-disc pl-6 space-y-2 marker:text-[#154c9a] mb-4">
					<li>Lei n.º 22/11, de 17 de Junho — Lei da Protecção de Dados Pessoais de Angola;</li>
					<li>Lei n.º 23/11, de 20 de Junho — Lei das Comunicações Electrónicas e dos Serviços da Sociedade da Informação;</li>
					<li>Lei n.º 10/20, de 15 de Abril — Lei do Comércio Electrónico;</li>
					<li>Lei n.º 15/03, de 22 de Julho — Lei da Defesa do Consumidor;</li>
					<li>Decreto Presidencial n.º 202/11 — Regulamento das Transacções Electrónicas;</li>
					<li>Demais normas e regulamentos aplicáveis emitidos pelo Ministério das Telecomunicações e Tecnologias de Informação (MTTI).</li>
				</ul>
			</SectionBlock>

			<SectionBlock num={3} title="Dados Recolhidos e Finalidades do Tratamento">
				<div className="bg-[#f8f6f2] p-6 rounded-xl border border-[#e5e7eb] mb-6">
					<h5 className="font-bold text-[#111827] mb-3 font-display">3.1. Dados Recolhidos de Pessoas Singulares</h5>
					<p className="mb-3 italic">No momento do registo, são recolhidos:</p>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Nome completo e ID/Passaporte
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Data de nascimento
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Endereço de residência
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Telefone e e-mail
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Fotografia de perfil (opcional)
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Histórico de navegação
						</li>
					</ul>
					<p className="mt-4 text-sm"><strong>Finalidade:</strong> Organização interna, verificação de identidade, comunicação de serviços, facilitação de transacções seguras e localização em situações de litígio.</p>
				</div>

				<div className="bg-[#f8f6f2] p-6 rounded-xl border border-[#e5e7eb]">
					<h5 className="font-bold text-[#111827] mb-3 font-display">3.2. Dados Recolhidos de Empresas</h5>
					<p className="mb-3 italic">Para entidades colectivas, são exigidos:</p>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Denominação social e registo
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							NIF emitido pela AGT
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Alvará ou licença comercial
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Sede e contactos oficiais
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Dados do representante legal
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-[#154c9a]" />
							Comprovativo de actividade
						</li>
					</ul>
					<p className="mt-4 text-sm"><strong>Finalidade:</strong> Garantir conformidade legal, autenticidade e credibilidade dos anunciantes, protegendo utilizadores contra fraudes.</p>
				</div>
			</SectionBlock>

			<SectionBlock num={4} title="Tratamento, Armazenamento e Segurança dos Dados">
				<p className="mb-4">A CAXIAUTO adopta as seguintes práticas:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>Encriptação dos dados em trânsito (SSL/TLS);</li>
					<li>Controlo de acesso restrito aos sistemas de base de dados;</li>
					<li>Realização de auditorias periódicas de segurança;</li>
					<li>Armazenamento em servidores com localização documentada. Os dados são conservados pelo período estritamente necessário ou pelo prazo legalmente exigido.</li>
				</ul>
			</SectionBlock>

			<SectionBlock num={5} title="Partilha de Dados com Terceiros">
				<p className="mb-4">A CAXIAUTO não vende nem aluga dados. A partilha ocorre apenas:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>Com entidades públicas quando legalmente exigido;</li>
					<li>Com prestadores de serviços tecnológicos (subcontratantes) sob sigilo;</li>
					<li>Entre as partes intervenientes numa transacção, no limite do necessário.</li>
				</ul>
			</SectionBlock>

			<SectionBlock num={6} title="Direitos dos Titulares dos Dados">
				<p>Os utilizadores gozam dos direitos de: Acesso, Rectificação, Apagamento (nos casos previstos na lei), Oposição e Portabilidade. Para exercer estes direitos, deve ser enviada solicitação escrita pelos canais oficiais.</p>
			</SectionBlock>

			<SectionBlock num={7} title="Cookies e Tecnologias de Rastreio">
				<p>Utilizados para melhorar a experiência e analisar tráfego. O utilizador pode gerir preferências no browser, mas o uso continuado da plataforma implica aceitação dos mesmos.</p>
			</SectionBlock>
		</>
	);

	const termsContent = (
		<>
			<SectionBlock num={1} title="Objecto e Âmbito de Aplicação">
				<p>Regulam o acesso e utilização por qualquer utilizador (singular ou colectivo). A utilização implica a aceitação integral e incondicional destes termos.</p>
			</SectionBlock>

			<SectionBlock num={2} title="Registo, Elegibilidade e Verificação de Identidade">
				<ul className="list-disc pl-6 space-y-2 mb-4">
					<li><strong>Pessoas Singulares:</strong> Idade ≥ 18 anos, BI/documento equivalente válido, informações verídicas.</li>
					<li><strong>Empresas:</strong> Constituídas sob a lei angolana, NIF activo e documentação válida.</li>
				</ul>
				<p className="bg-red-50 text-red-700 p-4 rounded-lg font-bold border-l-4 border-red-500">
					Aviso Legal: A CAXIAUTO pode suspender ou cancelar contas com informações falsas ou fraudulentas.
				</p>
			</SectionBlock>

			<SectionBlock num={3} title="Regras de Publicidade e Anúncios na Plataforma">
				<p className="mb-4">Regidas pela Lei n.º 9/02 (Lei Geral da Publicidade de Angola):</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>Informações devem ser verdadeiras, claras e precisas;</li>
					<li>Proibida publicidade subliminar ou enganosa;</li>
					<li>Fotos devem reflectir o estado real do veículo;</li>
					<li>Preços devem incluir todos os encargos obrigatórios;</li>
					<li>Proibida a publicação de viaturas roubadas ou sem documentação legal.</li>
				</ul>
			</SectionBlock>

			<SectionBlock num={4} title="Processo de Compra e Venda — Regras de Segurança">
				<p className="bg-[#154c9a] text-white p-6 rounded-xl font-black mb-8 shadow-lg text-center uppercase tracking-wider">
					AVISO IMPORTANTE: A CAXIAUTO funciona como intermediária. Todas as transacções devem ser acompanhadas pela equipa da plataforma.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="border border-[#e5e7eb] p-6 rounded-xl bg-[#f8f6f2]">
						<h5 className="font-black text-[#111827] mb-4 border-b border-[#e5e7eb] pb-2 font-display">11.1. Obrigações do Vendedor</h5>
						<ul className="text-sm space-y-2">
							<li>Disponibilizar histórico verídico;</li>
							<li>Apresentar documentação original;</li>
							<li>Permitir inspecção física;</li>
							<li>Não receber pagamentos sem mediação.</li>
						</ul>
					</div>
					<div className="border border-[#e5e7eb] p-6 rounded-xl bg-[#f8f6f2]">
						<h5 className="font-black text-[#111827] mb-4 border-b border-[#e5e7eb] pb-2 font-display">11.2. Obrigações do Comprador</h5>
						<ul className="text-sm space-y-2">
							<li>Verificar pessoalmente o estado;</li>
							<li>Confirmar autenticidade documental;</li>
							<li>Não transferir valores não verificados;</li>
							<li>Reportar comportamentos suspeitos.</li>
						</ul>
					</div>
				</div>
				<p className="text-sm italic"><strong>11.3. Papel da CAXIAUTO na Mediação:</strong> Actua como facilitadora (verificação de anúncios, apoio jurídico e resolução de litígios). Não se responsabiliza por transacções feitas fora da plataforma ou sem seu acompanhamento.</p>
			</SectionBlock>

			<SectionBlock num={5} title="Pagamentos e Meios de Transacção">
				<ul className="list-disc pl-6 space-y-2">
					<li>Uso de canais seguros e verificados;</li>
					<li>Proibido pagamento em numerário sem recibo oficial;</li>
					<li>Transacções em moeda estrangeira devem respeitar normas do BNA;</li>
					<li>Integração progressiva com sistema EMIS/Multicaixa.</li>
				</ul>
			</SectionBlock>

			<SectionBlock num={6} title="Serviços Adicionais da Plataforma">
				<p>Progressivamente, a plataforma oferecerá: aluguer, peças, manutenção, seguros, financiamento, inspecção técnica e importação/exportação.</p>
			</SectionBlock>

			<SectionBlock num={7} title="Responsabilidades e Limitações">
				<p>A CAXIAUTO não é responsável por danos de informações falsas dos utilizadores, transacções fora da plataforma, falhas técnicas por força maior ou uso indevido de credenciais por terceiros.</p>
			</SectionBlock>

			<SectionBlock num={8} title="Propriedade Intelectual">
				<p>Conteúdos são propriedade exclusiva da empresa Team Build – Comércio e Serviços, protegidos pela lei de direitos de autor. Proibida reprodução sem autorização.</p>
			</SectionBlock>

			<SectionBlock num={9} title="Conduta dos Utilizadores e Actos Proibidos">
				<p className="mb-4 font-bold italic">É proibido:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>Publicar conteúdos obscenos/falsos;</li>
					<li>Actividades ilegais (branqueamento);</li>
					<li>Acesso não autorizado a sistemas;</li>
					<li>Criar múltiplas contas para contornar restrições;</li>
					<li>Assediar outros utilizadores.</li>
				</ul>
			</SectionBlock>

			<SectionBlock num={10} title="Resolução de Litígios e Foro Competente">
				<p>Busca-se primeiro solução amigável. Na ausência de acordo, o foro é a comarca de Luanda. O utilizador pode recorrer ao INADEC para litígios de consumo.</p>
			</SectionBlock>

			<SectionBlock num={11} title="Alterações aos Termos e Condições">
				<p>A CAXIAUTO reserva-se o direito de actualizar os termos. Mudanças serão comunicadas com antecedência mínima de 15 dias.</p>
			</SectionBlock>

			<SectionBlock num={12} title="Contactos e Canais de Apoio">
				<ul className="space-y-2">
					<li><strong>Website:</strong> <a href="https://www.caxiauto.com" className="text-[#154c9a] hover:underline">www.caxiauto.com</a></li>
					<li><strong>Endereço:</strong> Luanda, República de Angola</li>
					<li><strong>DPO:</strong> Disponível na plataforma para questões de privacidade.</li>
				</ul>
			</SectionBlock>
		</>
	);

	return (
		<>
			<section className="relative min-h-[calc(100dvh-80px)] flex items-center bg-gradient-to-b from-[#eef3fa] via-white to-white overflow-hidden">
				<div className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none">
					<div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full border border-[#d41120] opacity-[0.06]" />
					<div className="absolute bottom-12 right-12 w-[250px] h-[250px] rounded-full border border-[#d41120] opacity-[0.04]" />
				</div>

				<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 w-full">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fde8ea] text-[#d41120] mb-6 text-sm font-semibold font-body">
							Documento Oficial
						</div>

						<h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#111827] leading-[1.08] [text-wrap:balance] mb-6">
							{pageTitle}
						</h1>

						<div className={`h-[3px] bg-[#d41120] transition-all duration-1000 ease-out mx-auto mb-8 ${heroLineDrawn ? 'w-40' : 'w-0'}`} />

						<p className="text-lg sm:text-xl text-[#6b7280] font-body mb-8">
							CaxiAuto — A sua Plataforma de Automóvel em Angola
						</p>

						<p className="text-sm text-[#6b7280] font-body italic mb-10">
							Versão 1.0 | Vigente a partir de Maio de 2026
						</p>

						<div className="flex flex-wrap justify-center gap-4 print:hidden">
							<button
								onClick={handlePrint}
								className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e5e7eb] bg-white text-[#6b7280] font-medium font-body hover:text-[#154c9a] hover:border-[#154c9a] transition-all cursor-pointer"
							>
								<Printer size={18} />
								Imprimir
							</button>
							<a
								href="/Caxiauto_Politica_Privacidade_Termos_de_Uso.pdf"
								download
								className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#154c9a] text-white font-bold font-body hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
							>
								<Download size={18} />
								Download PDF
							</a>
						</div>
					</div>
				</div>
			</section>

			<main>
				<div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 sm:py-28">
					<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden print:shadow-none print:border-none">
						<div className="p-8 sm:p-12 lg:p-16">
							{isPrivacy ? privacyContent : termsContent}

							<div className="mt-20 pt-12 border-t border-gray-100 text-center">
								<p className="text-lg font-bold text-gray-900 mb-6 font-body">
									Ao utilizar a plataforma CAXIAUTO, o utilizador declara ter lido, compreendido e aceite integralmente a presente Política de Privacidade e os Termos e Condições de Uso.
								</p>
								<div className="text-[#154c9a] font-black text-2xl italic font-display">
									CAXIAUTO — Feito em Angola, para Angola e para o Mundo.
								</div>
							</div>
						</div>
					</div>

					<div className="mt-12 text-center text-gray-400 text-sm font-body print:hidden">
						&copy; {new Date().getFullYear()} Team Build – Comércio e Serviços. Todos os direitos reservados.
					</div>
				</div>
			</main>
		</>
	);
};

export default Legal;
