import api from 'src/apiprovider/baseApi';

export async function fetchQuestionTemplate(companyId) {
    try {
    const response = await api.get(`/jobs/question-templates/?company_id=${companyId}`)
    return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function 
    }
};
