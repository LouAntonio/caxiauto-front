// Extrai o public_id Cloudinary de um secure_url (para rollback de uploads).
export const publicIdFromUrl = (secureUrl) => {
	if (!secureUrl || typeof secureUrl !== 'string') return null;
	const idx = secureUrl.indexOf('/upload/');
	if (idx === -1) return null;
	const segment = secureUrl.slice(idx + '/upload/'.length).replace(/^v\d+\//, '');
	return segment.replace(/\.[a-z0-9]+$/i, '');
};