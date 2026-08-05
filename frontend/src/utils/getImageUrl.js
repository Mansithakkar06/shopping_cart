export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (typeof imagePath !== 'string') return '';

    // If it's already a full HTTP/HTTPS URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Clean leading slashes, backslashes, and any leading 'uploads/' prefix
    let cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    while (cleanPath.startsWith('uploads/')) {
        cleanPath = cleanPath.replace(/^uploads\//, '');
    }
    
    // Get backend base URL from environment or default to localhost:3000
    const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    // Remove '/api/v1' suffix to get server root URL
    const serverRoot = rawApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
    
    return `${serverRoot}/uploads/${cleanPath}`;
};
