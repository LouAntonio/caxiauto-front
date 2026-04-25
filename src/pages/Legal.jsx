import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { ShieldCheck, Scale, FileText, Download, Printer } from 'lucide-react';

const Legal = () => {
	useDocumentTitle('Políticas e Termos - CaxiAuto');

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
			<div className="max-w-4xl mx-auto">
				{/* Top Actions - Hidden on Print */}
				<div className="flex justify-between items-center mb-8 print:hidden">
					<div className="flex items-center gap-2 text-blue-600 font-bold">
						<ShieldCheck size={24} />
						<span className="text-xl">CaxiAuto Legal</span>
					</div>
					<div className="flex gap-4">
						<button 
							onClick={handlePrint}
							className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer"
						>
							<Printer size={18} />
							Imprimir
						</button>
						<a 
							href="/Caxiauto_Politica_Privacidade_Termos_de_Uso.pdf" 
							download
							className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
						>
							<Download size={18} />
							PDF
						</a>
					</div>
				</div>

				{/* Document Content */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden print:shadow-none print:border-none">
					<div className="p-8 sm:p-12">
						{/* Document Header */}
						<div className="text-center border-b border-gray-100 pb-12 mb-12">
							<h1 className="text-4xl font-extrabold text-gray-900 mb-2">CAXIAUTO</h1>
							<p className="text-xl text-blue-600 font-bold mb-8 tracking-wide">A sua Plataforma de Automóvel em Angola</p>
							
							<div className="inline-block px-6 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm uppercase tracking-widest mb-4">
								Documento Oficial
							</div>
							
							<h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase">POLÍTICA DE PRIVACIDADE E TERMOS DE USO</h2>
							<p className="text-gray-500 font-medium italic">Versão 1.0 | Vigente a partir de Maio de 2026</p>
						</div>

						{/* Part I: Privacy Policy */}
						<section className="mb-16">
							<div className="flex items-center gap-3 mb-8 border-l-4 border-blue-600 pl-4">
								<span className="text-3xl font-black text-blue-600/20">I</span>
								<h3 className="text-2xl font-black text-gray-900 uppercase">PARTE I — POLÍTICA DE PRIVACIDADE</h3>
							</div>

							<div className="space-y-10 text-gray-700 leading-relaxed">
								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
										Identificação do Responsável pelo Tratamento de Dados
									</h4>
									<p className="mb-4">
										A CAXIAUTO é uma plataforma digital de origem angolana, dedicada à comercialização de viaturas, acessórios e serviços relacionados ao sector automóvel. A plataforma está disponível ao público em geral, abrangendo tanto empresas como pessoas singulares domiciliadas na República de Angola e no exterior.
									</p>
									<p>
										Para efeitos da presente política, o responsável pelo tratamento de dados é a entidade gestora da plataforma CAXIAUTO, com sede em Luanda, Angola, podendo ser contactada através dos canais oficiais disponibilizados no sítio electrónico <a href="https://www.caxiauto.ao" className="text-blue-600 hover:underline">www.caxiauto.ao</a>.
									</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
										Base Legal e Enquadramento Jurídico
									</h4>
									<p className="mb-4">A CAXIAUTO pauta a sua actuação em conformidade com a legislação angolana vigente, nomeadamente:</p>
									<ul className="list-disc pl-6 space-y-2 marker:text-blue-600">
										<li>Lei n.º 22/11, de 17 de Junho — Lei da Protecção de Dados Pessoais de Angola;</li>
										<li>Lei n.º 23/11, de 20 de Junho — Lei das Comunicações Electrónicas e dos Serviços da Sociedade da Informação;</li>
										<li>Lei n.º 10/20, de 15 de Abril — Lei do Comércio Electrónico;</li>
										<li>Lei n.º 15/03, de 22 de Julho — Lei da Defesa do Consumidor;</li>
										<li>Decreto Presidencial n.º 202/11 — Regulamento das Transacções Electrónicas;</li>
										<li>Demais normas e regulamentos aplicáveis emitidos pelo Ministério das Telecomunicações e Tecnologias de Informação (MTTI).</li>
									</ul>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
										Dados Recolhidos e Finalidades do Tratamento
									</h4>
									
									<div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
										<h5 className="font-bold text-gray-900 mb-3">3.1. Dados Recolhidos de Pessoas Singulares</h5>
										<p className="mb-3 italic">No momento do registo, são recolhidos:</p>
										<ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Nome completo e ID/Passaporte
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Data de nascimento
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Endereço de residência
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Telefone e e-mail
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Fotografia de perfil (opcional)
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Histórico de navegação
											</li>
										</ul>
										<p className="mt-4 text-sm"><strong>Finalidade:</strong> Organização interna, verificação de identidade, comunicação de serviços, facilitação de transacções seguras e localização em situações de litígio.</p>
									</div>

									<div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
										<h5 className="font-bold text-gray-900 mb-3">3.2. Dados Recolhidos de Empresas</h5>
										<p className="mb-3 italic">Para entidades colectivas, são exigidos:</p>
										<ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Denominação social e registo
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												NIF emitido pela AGT
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Alvará ou licença comercial
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Sede e contactos oficiais
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Dados do representante legal
											</li>
											<li className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
												Comprovativo de actividade
											</li>
										</ul>
										<p className="mt-4 text-sm"><strong>Finalidade:</strong> Garantir conformidade legal, autenticidade e credibilidade dos anunciantes, protegendo utilizadores contra fraudes.</p>
									</div>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
										Tratamento, Armazenamento e Segurança dos Dados
									</h4>
									<p className="mb-4">A CAXIAUTO adopta as seguintes práticas:</p>
									<ul className="list-disc pl-6 space-y-2">
										<li>Encriptação dos dados em trânsito (SSL/TLS);</li>
										<li>Controlo de acesso restrito aos sistemas de base de dados;</li>
										<li>Realização de auditorias periódicas de segurança;</li>
										<li>Armazenamento em servidores com localização documentada. Os dados são conservados pelo período estritamente necessário ou pelo prazo legalmente exigido.</li>
									</ul>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
										Partilha de Dados com Terceiros
									</h4>
									<p className="mb-4">A CAXIAUTO não vende nem aluga dados. A partilha ocorre apenas:</p>
									<ul className="list-disc pl-6 space-y-2">
										<li>Com entidades públicas quando legalmente exigido;</li>
										<li>Com prestadores de serviços tecnológicos (subcontratantes) sob sigilo;</li>
										<li>Entre as partes intervenientes numa transacção, no limite do necessário.</li>
									</ul>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">6</span>
										Direitos dos Titulares dos Dados
									</h4>
									<p>Os utilizadores gozam dos direitos de: Acesso, Rectificação, Apagamento (nos casos previstos na lei), Oposição e Portabilidade. Para exercer estes direitos, deve ser enviada solicitação escrita pelos canais oficiais.</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">7</span>
										Cookies e Tecnologias de Rastreio
									</h4>
									<p>Utilizados para melhorar a experiência e analisar tráfego. O utilizador pode gerir preferências no browser, mas o uso continuado da plataforma implica aceitação dos mesmos.</p>
								</div>
							</div>
						</section>

						{/* Part II: Terms of Use */}
						<section>
							<div className="flex items-center gap-3 mb-8 border-l-4 border-blue-600 pl-4">
								<span className="text-3xl font-black text-blue-600/20">II</span>
								<h3 className="text-2xl font-black text-gray-900 uppercase">PARTE II — TERMOS E CONDIÇÕES DE USO</h3>
							</div>

							<div className="space-y-10 text-gray-700 leading-relaxed">
								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">8</span>
										Objecto e Âmbito de Aplicação
									</h4>
									<p>Regulam o acesso e utilização por qualquer utilizador (singular ou colectivo). A utilização implica a aceitação integral e incondicional destes termos.</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">9</span>
										Registo, Elegibilidade e Verificação de Identidade
									</h4>
									<ul className="list-disc pl-6 space-y-2 mb-4">
										<li><strong>Pessoas Singulares:</strong> Idade ≥ 18 anos, BI/documento equivalente válido, informações verídicas.</li>
										<li><strong>Empresas:</strong> Constituídas sob a lei angolana, NIF activo e documentação válida.</li>
									</ul>
									<p className="bg-red-50 text-red-700 p-4 rounded-lg font-bold border-l-4 border-red-500">
										Aviso Legal: A CAXIAUTO pode suspender ou cancelar contas com informações falsas ou fraudulentas.
									</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">10</span>
										Regras de Publicidade e Anúncios na Plataforma
									</h4>
									<p className="mb-4">Regidas pela Lei n.º 9/02 (Lei Geral da Publicidade de Angola):</p>
									<ul className="list-disc pl-6 space-y-2">
										<li>Informações devem ser verdadeiras, claras e precisas;</li>
										<li>Proibida publicidade subliminar ou enganosa;</li>
										<li>Fotos devem reflectir o estado real do veículo;</li>
										<li>Preços devem incluir todos os encargos obrigatórios;</li>
										<li>Proibida a publicação de viaturas roubadas ou sem documentação legal.</li>
									</ul>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">11</span>
										Processo de Compra e Venda — Regras de Segurança
									</h4>
									<p className="bg-blue-600 text-white p-6 rounded-xl font-black mb-8 shadow-lg text-center uppercase tracking-wider">
										AVISO IMPORTANTE: A CAXIAUTO funciona como intermediária. Todas as transacções devem ser acompanhadas pela equipa da plataforma.
									</p>
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="border border-gray-100 p-6 rounded-xl bg-gray-50">
											<h5 className="font-black text-gray-900 mb-4 border-b pb-2">11.1. Obrigações do Vendedor</h5>
											<ul className="text-sm space-y-2">
												<li>Disponibilizar histórico verídico;</li>
												<li>Apresentar documentação original;</li>
												<li>Permitir inspecção física;</li>
												<li>Não receber pagamentos sem mediação.</li>
											</ul>
										</div>
										<div className="border border-gray-100 p-6 rounded-xl bg-gray-50">
											<h5 className="font-black text-gray-900 mb-4 border-b pb-2">11.2. Obrigações do Comprador</h5>
											<ul className="text-sm space-y-2">
												<li>Verificar pessoalmente o estado;</li>
												<li>Confirmar autenticidade documental;</li>
												<li>Não transferir valores não verificados;</li>
												<li>Reportar comportamentos suspeitos.</li>
											</ul>
										</div>
									</div>
									<p className="mt-6 text-sm italic"><strong>11.3. Papel da CAXIAUTO na Mediação:</strong> Actua como facilitadora (verificação de anúncios, apoio jurídico e resolução de litígios). Não se responsabiliza por transacções feitas fora da plataforma ou sem seu acompanhamento.</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">12</span>
										Pagamentos e Meios de Transacção
									</h4>
									<ul className="list-disc pl-6 space-y-2">
										<li>Uso de canais seguros e verificados;</li>
										<li>Proibido pagamento em numerário sem recibo oficial;</li>
										<li>Transacções em moeda estrangeira devem respeitar normas do BNA;</li>
										<li>Integração progressiva com sistema EMIS/Multicaixa.</li>
									</ul>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">13</span>
										Serviços Adicionais da Plataforma
									</h4>
									<p>Progressivamente, a plataforma oferecerá: aluguer, peças, manutenção, seguros, financiamento, inspecção técnica e importação/exportação.</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">14</span>
										Responsabilidades e Limitações
									</h4>
									<p>A CAXIAUTO não é responsável por danos de informações falsas dos utilizadores, transacções fora da plataforma, falhas técnicas por força maior ou uso indevido de credenciais por terceiros.</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">15</span>
										Propriedade Intelectual
									</h4>
									<p>Conteúdos são propriedade exclusiva da empresa Team Build – Comércio e Serviços, protegidos pela lei de direitos de autor. Proibida reprodução sem autorização.</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">16</span>
										Conduta dos Utilizadores e Actos Proibidos
									</h4>
									<p className="mb-4 font-bold italic">É proibido:</p>
									<ul className="list-disc pl-6 space-y-2">
										<li>Publicar conteúdos obscenos/falsos;</li>
										<li>Actividades ilegais (branqueamento);</li>
										<li>Acesso não autorizado a sistemas;</li>
										<li>Criar múltiplas contas para contornar restrições;</li>
										<li>Assediar outros utilizadores.</li>
									</ul>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">17</span>
										Resolução de Litígios e Foro Competente
									</h4>
									<p>Busca-se primeiro solução amigável. Na ausência de acordo, o foro é a comarca de Luanda. O utilizador pode recorrer ao INADEC para litígios de consumo.</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">18</span>
										Alterações aos Termos e Condições
									</h4>
									<p>A CAXIAUTO reserva-se o direito de actualizar os termos. Mudanças serão comunicadas com antecedência mínima de 15 dias.</p>
								</div>

								<div>
									<h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
										<span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold">19</span>
										Contactos e Canais de Apoio
									</h4>
									<ul className="space-y-2">
										<li><strong>Website:</strong> <a href="https://www.caxiauto.com" className="text-blue-600 hover:underline">www.caxiauto.com</a></li>
										<li><strong>Endereço:</strong> Luanda, República de Angola</li>
										<li><strong>DPO:</strong> Disponível na plataforma para questões de privacidade.</li>
									</ul>
								</div>
							</div>
						</section>

						{/* Final Declaration */}
						<div className="mt-20 pt-12 border-t border-gray-100 text-center">
							<p className="text-lg font-bold text-gray-900 mb-6">
								Ao utilizar a plataforma CAXIAUTO, o utilizador declara ter lido, compreendido e aceite integralmente a presente Política de Privacidade e os Termos e Condições de Uso.
							</p>
							<div className="text-blue-600 font-black text-2xl italic">
								CAXIAUTO — Feito em Angola, para Angola e para o Mundo.
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Footer - Hidden on Print */}
				<div className="mt-12 text-center text-gray-400 text-sm print:hidden">
					&copy; {new Date().getFullYear()} Team Build – Comércio e Serviços. Todos os direitos reservados.
				</div>
			</div>
		</div>
	);
};

export default Legal;
