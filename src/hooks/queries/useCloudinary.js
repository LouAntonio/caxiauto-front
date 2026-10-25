import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import axios from 'axios';
import api from '../../services/api';

/**
 * Hook centralizado para uploads Cloudinary.
 * Substitui código duplicado em 8+ componentes.
 * 
 * Uso:
 *   const { upload, uploadMultiple, isLoading } = useUploadToCloudinary();
 *   const url = await upload({ file, folder: 'sellCar' });
 *   const urls = await uploadMultiple({ files: [...], folder: 'parts' });
 */
export const useUploadToCloudinary = () => {
	// Upload de arquivo único
	const singleUpload = useMutation({
		mutationFn: async ({ file, folder }) => {
			const authResponse = await api.getCloudinarySignature(folder);
			if (!authResponse.success) throw new Error('Falha ao autorizar upload');
			const { timestamp, signature, cloudname, apikey } = authResponse;
			const formData = new FormData();
			formData.append('file', file);
			formData.append('api_key', apikey);
			formData.append('timestamp', timestamp);
			formData.append('signature', signature);
			formData.append('folder', folder);
			const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`, formData);
			return data.secure_url;
		},
	});

	// Upload múltiplo (sequencial para evitar rate limit Cloudinary)
	const uploadMultiple = useCallback(async ({ files, folder }) => {
		const urls = [];
		for (const file of files) {
			const url = await singleUpload.mutateAsync({ file, folder });
			urls.push(url);
		}
		return urls;
	}, [singleUpload]);

	// Upload múltiplo paralelo (mais rápido, mas pode hit rate limit)
	const uploadMultipleParallel = useCallback(async ({ files, folder }) => {
		const promises = files.map(file => singleUpload.mutateAsync({ file, folder }));
		return Promise.all(promises);
	}, [singleUpload]);

	return {
		// Single file
		upload: singleUpload.mutateAsync,
		uploadSync: singleUpload.mutate,
		isUploading: singleUpload.isPending,
		isSuccess: singleUpload.isSuccess,
		isError: singleUpload.isError,
		error: singleUpload.error,
		reset: singleUpload.reset,

		// Multiple files
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