import api from 'src/apiprovider/baseApi';

export async function fetchCompanies(companyId) {
    try {
    const response = await api.get(`/login/company/${companyId}`)
    return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};


export async function updateCompany(formData, companyId) {
    try {
       
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const response = await api.put(`/user-management/company/${companyId}`, formData, config)

    return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};


export async function fetchCompanyMembers(companyId) {
    try {
        const response = await api.get(`/user-management/company/members/${companyId}`)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

export async function addCompanyMembers(companyId, data) {
    try {
        const response = await api.post(`/user-management/company/members/${companyId}`, data)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};


export async function removeCompanyMembers(companyId, memberId) {
    try {
        const response = await api.delete(`/user-management/company/member/${companyId}/${memberId}`)
        return true
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

export async function updateCompanyMembers(companyId, memberId, data) {
    try {
        const response = await api.put(`/user-management/company/members/${companyId}/${memberId}`, data)
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};



export async function fetchSubscription(companyId) {
    try {
        const response = await api.get(`/user-management/company/subscription/${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}


