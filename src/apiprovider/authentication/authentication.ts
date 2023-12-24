import { baseAPI } from 'src/apiprovider/baseApi'
import api from 'src/apiprovider/baseApi'

export async function registerUser(firstName, lastName, workEmail, password, inviteId){
    try {
        if (inviteId) {
            return await baseAPI.post(`/login/register?invite_id=${inviteId}`,  {
                first_name: firstName,
                last_name: lastName,
                email: workEmail,
                password
              });
        } else {
        return await baseAPI.post('/login/register',  {
                    first_name: firstName,
                    last_name: lastName,
                    email: workEmail,
                    password
                  });
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function verifyEmail(email){
    try {
        const response = await baseAPI.post('/login/reset-password/email/', {
            email: email
          })
        return response.data
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function resetPassword(newPassword, confirmNewPassword, token){
    try {
        const response = await baseAPI.post(`/login/reset-password/${token}/`, {
            password: newPassword,
            re_password: confirmNewPassword
          })
        return response.data
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function verifyOTP(otp, email){
    try {
        return await baseAPI.post('/login/rest-password/otp/', {
                    otp,
                    email: email
                  });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function verifyEmailOTP(otp){
    try {

        return await api.post('/login/otp-email-verification',{otp: otp})

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function sendVerificationEmail(){
    try {

        return await api.post('/login/verification-email', {})
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
