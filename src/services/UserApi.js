import mainClient from '../client/mainClient';

const USER_URI = '/user';

const userApi = {
  user: {
    async signup(displayname) {
      const client = await mainClient;
      let response = await client.post(`${USER_URI}/signup`, {
        displayname: displayname,
      });
      return response;
    },
    async getUserByEmail(email) {
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
    async registerDeviceTokenForNotifications(userId, token) {
      const client = await mainClient;
      const response = client
        .put('user/' + userId, {
          pushMessageToken: token,
        })
        .catch((error) => {
          console.log('error saving device token for push notification', error);
        });
      return response;
    },
  },
};

export default userApi;
