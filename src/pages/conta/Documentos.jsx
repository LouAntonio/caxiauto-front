import React from 'react';
import { FileText } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Documentos = () => {
	useDocumentTitle('Documentos - CaxiAuto');

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
				<FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Documentos
				</h2>
				<p className="text-gray-600">
					Funcionalidade em desenvolvimento
				</p>
			</div>
		</div>
	);
};

export default Documentos;
