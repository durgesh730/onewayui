import api from "src/apiprovider/baseApi";

export async function updateCandidate(data, candidatesId, jobId){
    try {
        const response = await api.patch(`/candidates/${encodeURIComponent(candidatesId)}/`, {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone_number: data.phone_number
            }, {
                params: {
                job_id: encodeURIComponent(jobId)
                },
            })
        return response.data

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function listAllCandidates(companyId){
    try {
        const response =  await api.get(`/candidates/pool/${companyId}/?ordering=-joined_at`)
        return response.data

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function deleteCandidate(candidateId, job_id){
    try {
        const response = await api.delete(`/candidates/${encodeURIComponent(candidateId)}/`, {
            params: {
            job_id: encodeURIComponent(job_id)
            }
        })
        return response
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}



