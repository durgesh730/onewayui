import api from 'src/apiprovider/baseApi'

export const Fetch_company = () => {
    return api.get('/user-management/companies')
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const List_timezones = () => {
    return api.get('/login/timezones/')
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const Create_job = (postData) => {
    return api.post('/jobs/', postData)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const Direct_invite = (jobid) => {
    return api.post('/candidates/direct-invite/', jobid)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const Bulk_upload_candidate = (jobId, file) => {
    return api.post(`/candidates/bulk-upload/${jobId}/`, file, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const Create_candidate = (data) => {
    return api.post(`/candidates/`, data)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const Remove_job_team_member = async (jobId, data) => {
    try {
        const response = await api.put(`/jobs/team/${jobId}/`, data);
        return response.data;
    } catch (error) {
        console.error("Error removing team member:", error.message || error);
        throw error;
    }
}


export const List_company_members = (company_id) => {
    return api.get(`/user-management/company/members/${company_id}`)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const Add_job_team_member = (jobId, data) => {
    return api.patch(`/jobs/team/${jobId}/`, data)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const Retrieve_job_team = (jobId) => {
    return api.get(`/jobs/team/${jobId}/`)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const Create_job_question = (requestData) => {
    return api.post(`/jobs/question/`, requestData)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export async function  updateJobQuestion(jobId, questionId, requestData) {
    try {
        const response = await api.patch(`/jobs/question/${questionId}/?job_id=${jobId}`, requestData)
    return  response.data
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function deleteQuestion(jobId, questionId) {
    try {
        return await api.delete(`/jobs/question/${questionId}/?job_id=${jobId}`);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export const List_job_questions = (jobId) => {
    const queryParams = {
        job_id: jobId,
    };
    return api.get(`/jobs/question/`, {
        params: queryParams,
    })
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

export const List_question_templates = (companyId) => {
    const queryParams = {
        company_id: companyId,
    };
    return api.get(`/jobs/question-templates`, {
        params: queryParams,
    })
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
}