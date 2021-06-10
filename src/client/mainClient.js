import axios from 'axios';
import {axiosConfig} from './axiosConfig';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import auth from '@react-native-firebase/auth';
import perf from '@react-native-firebase/perf';

// Function that will be called to refresh authorization
// new token will be added to header in AuthIDTokenListener.js
const refreshAuthLogic = async (failedRequest) => {
  const failedRequestStatus = failedRequest.response?.status;
  if (failedRequestStatus == 401) {
    // error code 401 means invalid/expired token
    const idToken = await auth()
      .currentUser?.getIdToken()
      .catch((error) => console.log('error getting id token', error));
    failedRequest.response.config.headers['Authorization'] =
      'Bearer ' + idToken;
    mainClient.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;
  }
  return Promise.resolve();
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
const mainClient = axios.create({
  baseURL: axiosConfig.baseUrl,
  headers: {
    Accept: 'application/json',
    version: 2,
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

// RNFirebase Perf interceptors start
mainClient.interceptors.request.use(async function (config) {
  try {
    const httpMetric = perf().newHttpMetric(config.url, config.method);
    config.metadata = {httpMetric};

    // add any extra metric attributes, if required
    // httpMetric.putAttribute('userId', '12345678');

    await httpMetric.start();
  } finally {
    return config;
  }
});

mainClient.interceptors.response.use(
  async function (response) {
    try {
      // Request was successful, e.g. HTTP code 200

      const {httpMetric} = response.config.metadata;

      // add any extra metric attributes if needed
      // httpMetric.putAttribute('userId', '12345678');

      httpMetric.setHttpResponseCode(response.status);
      httpMetric.setResponseContentType(response.headers['content-type']);
      await httpMetric.stop();
    } finally {
      return response;
    }
  },
  async function (error) {
    try {
      // Request failed, e.g. HTTP code 500

      const {httpMetric} = error.config.metadata;

      // add any extra metric attributes if needed
      // httpMetric.putAttribute('userId', '12345678');

      httpMetric.setHttpResponseCode(error.response.status);
      httpMetric.setResponseContentType(error.response.headers['content-type']);
      await httpMetric.stop();
    } finally {
      // Ensure failed requests throw after interception
      return Promise.reject(error);
    }
  },
);

// RNFirebase Perf interceptors end
/*
// Intercept all requests
mainClient.interceptors.request.use(
  (config) => {
    console.log('Request Config: ', config);
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
    console.log(error.response.status);
    console.log(error.response.config);
    console.log(error.response);
    console.log(error);
    return Promise.reject(error);
  },
);
*/
