
const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface UploadResponse {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
}

const mockUploadService = {
    uploadImage: async (file: File): Promise<UploadResponse> => {
        return new Promise((resolve) => {
            // Create a fake URL for the file
            const url = URL.createObjectURL(file);
            setTimeout(() => {
                resolve({
                    url,
                    filename: file.name,
                    mimetype: file.type,
                    size: file.size
                });
            }, 500);
        });
    }
};

const apiUploadService = {
    uploadImage: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('authToken');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
            method: 'POST',
            headers, // Content-Type is set automatically for FormData
            body: formData
        });

        if (!response.ok) {
            let errorMsg = 'Failed to upload image';
            try {
                const errorData = await response.json();
                if (typeof errorData.error === 'string') {
                    errorMsg = errorData.error;
                } else {
                    errorMsg = JSON.stringify(errorData);
                }
            } catch (e) {
                const text = await response.text();
                errorMsg = text || response.statusText;
            }
            console.error(`Upload error (${response.status}):`, errorMsg);
            throw new Error(`Upload failed (${response.status}): ${errorMsg}`);
        }

        return await response.json();
    }
};

export const uploadService = isMockEnabled ? mockUploadService : apiUploadService;
