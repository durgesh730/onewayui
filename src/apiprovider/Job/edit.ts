import api from 'src/apiprovider/baseApi';

export async function retrieveJob(jobID){
    try {
        const response = await api.get(`/jobs/job/${jobID}/`)
        return response.data

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function editJob(postData, jobID){
    try {
        const response = await api.patch(`/jobs/job/${jobID}/`, postData)
        return await response.data

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function retrieveJobQuestions(jobID){
    try {
        const response = await api.get(`/jobs/question/?job_id=${jobID}`)
        return response.data

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function listAvailableMembers(jobID){
    try {
        const response = await api.get(`/jobs/team/${jobID}/available/`)
        return response.data

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}