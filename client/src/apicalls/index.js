import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://mern-deploy-server-wyq0.onrender.com',
    headers: {
        Authorization: `bearer ${localStorage.getItem('token')}`
    }
})

export default axiosInstance;