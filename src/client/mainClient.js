import axios from 'axios';
import {axiosConfig} from './axiosConfig';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import auth from '@react-native-firebase/auth';

// Function that will be called to refresh authorization
// new token will be added to header in idTokenListener.js
const refreshAuthLogic = async (failedRequest) => {
  const failedRequestStatus = failedRequest.response?.status;
  if (failedRequestStatus == 401) {
    // error code 401 means invalid/expired token
    const idToken = await auth().currentUser?.getIdToken(true);
    mainClient.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;
  }
  return Promise.resolve();
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
const mainClient = axios.create({
  baseURL: axiosConfig.baseUrl,
  headers: {
    Accept: 'application/json',
  },
});

createAuthRefreshInterceptor(mainClient, refreshAuthLogic, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});
export default mainClient;

function getUrl(config) {
  if (config.baseURL) {
    return config.url.replace(config.baseURL, '');
  }
  return config.url;
}

// Intercept all requests
/*mainClient.interceptors.request.use(
  (config) => {
    //  console.log('Request Config: ', config);
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercept all responses
mainClient.interceptors.response.use(
  async (response) => {
    //console.log(response.data);
    // console.log(response.status);
    // console.log(response.statusText);
    //console.log(response.headers);
    // console.log(response.config);
    return response;
  },
  (error) => {
    // console.log(error.response.status);
    // console.log(error.response.config);
    // console.log(error);
    return Promise.reject(error);
  },
);
*/
