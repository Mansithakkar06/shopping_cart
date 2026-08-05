export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Clean path backslashes and strip leading 'uploads/' if present
    const cleanPath = imagePath.replace(/\\/g, '/').replace(/^uploads\//, '');
    
    // Get backend base URL from environment or default to localhost:3000
    const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    // Remove '/api/v1' suffix to get server root URL
    const serverRoot = rawApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
    
    return `${serverRoot}/uploads/${cleanPath}`;
};
