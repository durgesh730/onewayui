import api from 'src/apiprovider/baseApi';

export async function updateUser(form_data) {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
  
        const response = await api.patch('/user-management/', form_data, config)
        
    return response.data

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};