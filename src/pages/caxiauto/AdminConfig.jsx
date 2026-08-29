import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { queryClient } from '../../services/queryClient';
import { notyf } from '../../services/axios';
import { Save, Landmark, Loader2 } from 'lucide-react';

const defaultForm = {
	bankName: '',
	iban: '',
	holderName: '',
	mcxPhone: ''
};

const AdminConfig = () => {
	const [form, setForm] = useState(defaultForm);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [saverWarning, setSaverWarning] = useState(false);
	const [others, setOthers] = useState([]);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const res = await api.getAdminConfigs();
				if (res.success) {
					const bank = res.data.find((c) => c.key === 'bankDetails');
					if (bank) {
						try {
							const parsed = JSON.parse(bank.value);
							setForm({ ...defaultForm, ...parsed });
						} catch {
							setForm({ ...defaultForm, bankName: bank.value });
						}
					}
					setOthers(res.data.filter((c) => c.key !== 'bankDetails'));
				} else {
					notyf.error(res.message || 'Erro ao carregar configurações');
				}
			} catch (error) {
				notyf.error(error?.message || 'Erro ao carregar configurações');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	const handleSave = async () => {
		if (!form.bankName.trim() || !form.iban.trim() || !form.holderName.trim()) {
			notyf.error('Preencha pelo menos banco, IBAN e titular da conta');
			return;
		}
		setSaving(true);
		setSaverWarning(false);
		try {
			const res = await api.updateConfig('bankDetails', { ...form, bankName: form.bankName.trim(), iban: form.iban.trim(), holderName: form.holderName.trim(), mcxPhone: form.mcxPhone.trim() });
			if (res.success) {
				setSaverWarning(true);
				notyf.success('Dados bancários atualizados. O novo valor aparece nos pagamentos.');
				queryClient.invalidateQueries({ queryKey: ['config'] });
			} else {
				notyf.error(res.message || 'Erro ao guardar dados bancários');
			}
		} catch (error) {
			notyf.error(error?.message || 'Erro ao guardar dados bancários');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<div className="w-12 h-12 bg-[#154c9a] rounded-lg flex items-center justify-center">
					<Landmark className="w-6 h-6 text-white" />
				</div>
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
					<p className="text-sm text-gray-500 mt-0.5">Dados exibidos nos fluxos de pagamento.</p>
				</div>
			</div>

			{loading ? (
				<div className="bg-white rounded-xl border border-gray-200 p-10 flex items-center justify-center text-gray-400">
					<Loader2 className="w-6 h-6 animate-spin mr-2" /> A carregar...
				</div>
			) : (
				<>
					<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
						<h3 className="font-bold text-gray-900 text-lg mb-1">Dados bancários para transferência</h3>
						<p className="text-sm text-gray-600 mb-5">
							Mostrados aos vendedores quando criam um pagamento (assinaturas e destaques). O IBAN e o titular têm de estar corretos antes de pedir comprovativos.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
								<input
									type="text"
									name="bankName"
									value={form.bankName}
									onChange={handleChange}
									placeholder="Ex.: Banco BAI"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Titular da conta</label>
								<input
									type="text"
									name="holderName"
									value={form.holderName}
									onChange={handleChange}
									placeholder="Nome do titular"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
								<input
									type="text"
									name="iban"
									value={form.iban}
									onChange={handleChange}
									placeholder="AO06 0000 0000 0000 0000 0000 0000"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none font-mono"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">MCX Express (telefone)</label>
								<input
									type="text"
									name="mcxPhone"
									value={form.mcxPhone}
									onChange={handleChange}
									placeholder="+244 9XX XXX XXX"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none"
								/>
							</div>
						</div>

						{saverWarning && (
							<p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
								Guardado! Confirme que os dados ficaram corretos antes de continuar a aceitar comprovativos.
							</p>
						)}

						<div className="mt-6 flex items-center gap-3">
							<button
								onClick={handleSave}
								disabled={saving}
								className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#154c9a] text-white rounded-lg hover:bg-[#123f80] disabled:opacity-60 font-medium transition-colors text-sm"
							>
								{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
								Guardar dados bancários
							</button>
						</div>
					</div>

					{others.length > 0 && (
						<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
							<h3 className="font-bold text-gray-900 text-lg mb-4">Outras configurações</h3>
							<div className="space-y-2 text-sm">
								{others.map((c) => (
									<div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
										<span className="font-medium text-gray-700">{c.key}</span>
										<span className="text-gray-500 break-all text-right ml-4">{c.value}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AdminConfig;