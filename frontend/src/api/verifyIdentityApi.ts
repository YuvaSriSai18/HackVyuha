// src/api/verifyIdentityApi.ts
import axios from 'axios';

const API_BASE_URL = 'https://your-backend-api.com/api'; // change to your backend URL

export const sendVerificationEmail = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/verify/email`, { email });
  return response.data;
};

export const uploadVerificationDocument = async (p0: string, documentType: string, document: File, formData: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/verify/document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
