import axios from 'axios'

export const baseUrl= 'https://xdev.xinterview.co';

export const baseAPI = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  })



const  api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

function refreshToken() {
  var refreshToken = localStorage.getItem('refreshToken')
  return axios.post(`${baseUrl}/api/token/refresh/`, { refresh: refreshToken })
}

// Add a response interceptor
api.interceptors.response.use(
  response => {
    if (response.status === 204) {
      return response
    } else if (typeof response.data == 'string') {
      response.data = JSON.parse(response.data)
    }
    return response
  },
  error => {
    var originalRequest = error.config
    if (401 === error.response.status) {
      return refreshToken()
        .then(res => {
          const newAccessToken = res.data.access
          localStorage.setItem('accessToken', newAccessToken)
          originalRequest.headers = {
            'Content-Type': 'application/json'
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          // Retry the original request
          return api(originalRequest)
        })
        .catch(err => {
          console.log(err)
          localStorage.removeItem('accessToken')
          window.location.reload()
        })
    } else if (error.response.status === 204) {
        return Promise.resolve({ data: { delete: 'success' } });
      } else {
        console.log(error)
      return Promise.reject(error)
    }
  }
)

export default api
