import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../services/api';

export const useUploadToCloudinary = () => {
	return useMutation({
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
};
