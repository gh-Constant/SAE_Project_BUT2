import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

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

        try {
            const response = await apiClient.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || error.response?.data || error.message || 'Upload failed';
            console.error(`Upload error:`, errorMsg);
            throw new Error(`Upload failed: ${errorMsg}`);
        }
    }
};

export const uploadService = isMockEnabled ? mockUploadService : apiUploadService;
