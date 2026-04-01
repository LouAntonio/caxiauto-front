import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Layers, Plus, Loader2 } from 'lucide-react';
import { notyf } from '../../services/api';

const AdminClasses = () => {
	const { listClasses, createClass } = useAdmin();
	const [loading, setLoading] = useState(true);
	const [classes, setClasses] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({ name: '' });

	const loadClasses = async () => {
		setLoading(true);
		try {
			const response = await listClasses();
			if (response.success) setClasses(response.data);
		} catch (error) {
			console.error('Erro ao carregar classes:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadClasses();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await createClass(formData.name);
			if (response.success) {
				notyf.success('Classe criada!');
				setShowModal(false);
				setFormData({ name: '' });
				loadClasses();
			}
		} catch (error) {
			notyf.error('Erro ao criar classe');
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Classes de Veículos</h1>
					<p className="text-gray-600 mt-1">Gerencie as classes de veículos</p>
				</div>
				<button onClick={() => setShowModal(true)} className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2">
					<Plus className="w-5 h-5" /> Nova Classe
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
				) : classes.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Layers className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhuma classe encontrada</p>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículos</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{classes.map((cls) => (
								<tr key={cls.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 font-medium text-gray-900">{cls.name}</td>
									<td className="px-6 py-4 text-sm text-gray-600">{cls._count?.vehicles || 0} veículos</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-6 w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">Nova Classe</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ name: e.target.value })}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
									required
								/>
							</div>
							<div className="flex gap-3">
								<button type="submit" className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80]">Criar</button>
								<button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminClasses;
