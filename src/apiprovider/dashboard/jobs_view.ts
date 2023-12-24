import api from 'src/apiprovider/baseApi';

export async function activeJobs() {
    try {
      const response = await api.get('/jobs/active/');
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      //throw error; // Rethrow the error to handle it in the calling function
    }
  };
  

export async function archiveJob(jobId, status) {
    try {
      const response = await api.post(
        `/jobs/archived/`,
        {
          job: jobId,
          status: status
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error posting status:', error);
      // Handle error, e.g., show an error message
    }
  };

  export async function archiveJobList() {
    try {
      const response = await api.get('/jobs/archived/');
      return response.data;

    } catch (error) {
      console.error('Error fetching data:', error);
      //throw error; // Rethrow the error to handle it in the calling function
    }
  };
  