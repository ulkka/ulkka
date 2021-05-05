import axios from 'axios';
import mainClient from '../client/mainClient';

const UTILITY_URI = '/utility';
const OGPREVIEW = '/ogPreview';

const utilityApi = {
  og: {
    async preview(link) {
      const client = await mainClient;
      let result = {};
      result = await client
        .post(UTILITY_URI + OGPREVIEW, {
          url: link,
        })
        .catch((error) => ({error: error}));
      return result;
    },
  },
  media: {
    async upload(data, callback, cancelToken, type) {
      const client = await mainClient;

      let result = {};
      result = client
        .post('media/' + type + '/upload', data, {
          onUploadProgress: callback,
          cancelToken: cancelToken,
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log('axios is cancel error', error);
            return {
              message: error.message,
              error: error,
              type: 'mediaUploadCancelled',
            };
          }
          return {
            error: error,
          };
        });
      return result;
    },
  },
};

export default utilityApi;
