import { baseAPI } from 'src/apiprovider/baseApi';

export async function fetchInterviewStatus(token) {
  try {
    const response = await baseAPI.get(`/candidates/interview/${token}/`);

    if (response.status === 200) {

      return await response.data;

    } else {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


export async function createCandidate(formData, token) {
  try {
    const data = {
      "first_name": formData.firstName,
      "last_name": formData.lastName,
      "email": formData.email,
      "job": formData.job
    }
    const response = await baseAPI.post(`/candidates/interview/${token}/`, data);
    return response.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    //throw error; // Rethrow the error to handle it in the calling function
  }
};


export async function fetchQuestions(token) {
  try {

    const response = await baseAPI.get(`/candidates/question/${token}`);
    return await response.data;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function saveAnswer(data, token){
  try {

    const config = {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      }

    const videoBlob = await fetch(data?.video).then((r) => r.blob());
    const videoFile = new File([videoBlob], 'answer.mp4');

    const formData = new FormData()
    formData.append('video',  videoFile)
    formData.append('takes',  data?.takes)
    formData.append('video_length',  data?.video_length)
    formData.append('question',  data?.question)


    const response = await baseAPI.post(
        `/candidates/interview/answer/${token}/`, 
        formData, 
        config
      );

    return response.data;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}