import axios from 'axios';
import { axiosConfig } from '../config/axiosConfig';

const mainClient = axios.create({
    baseURL: axiosConfig.baseUrl,
    headers: {
        Accept: 'application/json'
    }
});

export default mainClient;

function getUrl(config) {
    if (config.baseURL) {
        return config.url.replace(config.baseURL, '');
    }
    return config.url;
}

// Intercept all requests
mainClient.interceptors.request.use(
    config => {
       // console.log("Config: ", config);
        return config;
    }, error => Promise.reject(error));

// Intercept all responses
mainClient.interceptors.response.use(
    async response => {
      //  console.log(response.data);
      //  console.log(response.status);
       // console.log(response.statusText);
     //   console.log(response.headers);
     //   console.log(response.config);
        return response;
    }, error => {
      //  console.log(error.response.status);
      //  console.log(error.response.config);
       // console.log(error.response);
        return Promise.reject(error);
    },
);

