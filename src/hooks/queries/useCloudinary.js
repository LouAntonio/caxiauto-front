import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import axios from 'axios';
import api from '../../services/api';

// O Cloudinary só valida a assinatura se o POST reenviar exatamente os mesmos
// parâmetros assinados pelo backend (ver authentication_signatures).
// Por isso o backend devolve `paramsToSign` e o hook limita-se a reenvia-lo.
const MAX_MB = (bytes) => Math.round(bytes / 1024 / 1024);

export const useUploadToCloudinary = () => {
	const singleUpload = useMutation({
		mutationFn: async ({ file, folder, admin = false }) => {
			const auth = await api.getCloudinarySignature(folder, admin);
			if (!auth?.success) throw new Error(auth?.message || 'Falha ao autorizar upload');

			const { signature, cloudname, apikey, maxBytes, paramsToSign } = auth;

			if (maxBytes && file.size > maxBytes) {
				throw new Error(`O ficheiro "${file.name}" excede ${MAX_MB(maxBytes)}MB`);
			}

			const formData = new FormData();
			formData.append('file', file);
			formData.append('api_key', apikey);
			formData.append('signature', signature);

			// Parâmetros assinados (folder, allowed_formats, timestamp).
			Object.entries(paramsToSign || {}).forEach(([key, value]) => {
				formData.append(key, value);
			});

			const { data } = await axios.post(
				`https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`,
				formData
			);

			if (!data?.secure_url) throw new Error('Cloudinary não devolveu o URL do ficheiro');
			return data.secure_url;
		},
	});

	// Upload múltiplo sequencial (evita rate limit do Cloudinary)
	const uploadMultiple = useCallback(async ({ files, folder, admin = false }) => {
		const urls = [];
		for (const file of files) {
			const url = await singleUpload.mutateAsync({ file, folder, admin });
			urls.push(url);
		}
		return urls;
	}, [singleUpload]);

	// Upload múltiplo paralelo (mais rápido, mas pode atingir o rate limit)
	const uploadMultipleParallel = useCallback(async ({ files, folder, admin = false }) => {
		const promises = files.map((file) => singleUpload.mutateAsync({ file, folder, admin }));
		return Promise.all(promises);
	}, [singleUpload]);

	return {
		upload: singleUpload.mutateAsync,
		uploadSync: singleUpload.mutate,
		isUploading: singleUpload.isPending,
		isSuccess: singleUpload.isSuccess,
		isError: singleUpload.isError,
		error: singleUpload.error,
		reset: singleUpload.reset,
		uploadMultiple,
		uploadMultipleParallel,
	};
};

// Helper para validação de arquivos antes do upload
export const validateFiles = (files, options = {}) => {
	const {
		maxSize = 10 * 1024 * 1024, // 10MB default
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
		maxCount = 10
	} = options;

	const fileArray = Array.from(files);
	const errors = [];

	if (fileArray.length === 0) {
		errors.push('Nenhum arquivo selecionado');
	}
	if (fileArray.length > maxCount) {
		errors.push(`Máximo de ${maxCount} arquivos permitidos`);
	}

	const invalidType = fileArray.find(f => !allowedTypes.includes(f.type));
	if (invalidType) {
		errors.push(`Tipo inválido: ${invalidType.type}. Permitidos: ${allowedTypes.join(', ')}`);
	}

	const oversized = fileArray.find(f => f.size > maxSize);
	if (oversized) {
		errors.push(`Arquivo "${oversized.name}" excede ${maxSize / 1024 / 1024}MB`);
	}

	return {
		valid: errors.length === 0,
		errors,
		files: fileArray
	};
};
