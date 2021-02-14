import mainClient from '../client/mainClient';

const USER_URI = '/user';

const userApi = {
  user: {
    async signup(data) {
      const client = await mainClient;
      let response = await client.post(`${USER_URI}/signup`, {data: data});
      return response;
    },
    async accountExists(email) {
      const client = await mainClient;
      let response = await client.get(`${USER_URI}?query={"email":"${email}"}`);
      return response;
    },
    async displaynameExists(displayname) {
      const client = await mainClient;
      let response = await client.get(
        `${USER_URI}?query={"displayname":"${displayname}"}`,
      );
      return response;
    },
  },
};

export default userApi;
