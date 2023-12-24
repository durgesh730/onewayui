import api from 'src/apiprovider/baseApi';
import { CandidateData } from 'src/views/apps/chat2/types';

export async function listJobs() {
    try {
        const response = await api.get('jobs/active/');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

export async function listCandidates(jobId, stage) {
    try {
        const response = await api.get(`candidates/?job_id=${jobId}&stage=${stage}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};


export async function fetchCandidateProfile(candidate_id) {
    try {
        const response = await api.get(`candidates/${candidate_id}/answers/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        //throw error;
    }
};

export const fetchCandidateList = async (job_id) => {
    try {
        const response = await api.get(`candidates/?job_id=${job_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching candidate list:', error);
        throw error;
    }
};

export async function resendEmailCandidate(candidateId) {
    try {
        const response = await api.post(`candidates/resend-email/`, {
            "candidate_id": candidateId
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

export async function addOverAllRating(candidateId, rating: Number, review: string) {
    try {
        const response = await api.post(`candidates/overall_rating/${candidateId}`, {
            "rating": rating,
            "review": review,
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};


export async function fetchComments(candidate_id) {
    try {
        const response = await api.get(`candidates/comments/?candidate_id=${candidate_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        throw error;
    }
}; 

export async function createComments(data) {
    try {
        const response = await api.post('candidates/comments/', data);
        return response.data;
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        throw error;
    }
};

export async function deleteCandidate(id, job_id) {
    try {
        const response = await api.delete(`candidates/${id}/?job_id=${job_id}`);
        return true;
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        throw error;
    }
};

export async function changeStage(id, stage) {
    try {
        const response = await api.patch(`candidates/stages/${id}/`, {
            "stage": stage
            });
        return response.data;
    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
};

export async function disqualifyCandidate(id) {
    try {
        const response = await api.patch(`candidates/stages/${id}/`, {
            "stage": "rejected"
            });
        return response.data;
    } catch (error) {
        console.error('Error :', error);
        throw error;
    }
};


export async function updateCandidate(id, job_id, formData) {
    try {
        const response = await api.patch(`candidates/${id}/?job_id=${job_id}`, formData);
        return response.data;
      } catch (error) {
        console.error('Error updating candidate details:', error);
        throw error;
      }
}


export async function extendDeadline(candidateId, expiryDate) {
    try {
        const response = await api.post('candidates/extend-deadline/', {
            "candidate_id": `${candidateId}`,
            "expiry_date": expiryDate
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        throw error;
    }
};

export async function fetchEval(candidate_id) {
    try {
        const response = await api.get(`candidates/eval/${candidate_id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching candidate profile:', error);
        throw error;
    }
}; 

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
