import mainClient from '../client/mainClient';

const USER_URI = '/user';
const POST_URI = '/posts';
const COMMENT_URI = '/comments';
const BLOCKUSER_URI = '/blockUser';
const UNBLOCKUSER_URI = '/unblockUser';

const userApi = {
  user: {
    async signup(displayname) {
      const client = await mainClient;
      let response = await client.post(`${USER_URI}/signup`, {
        displayname: displayname,
      });
      return response;
    },
    async self() {
      const client = await mainClient;
      let response = await client.get(`${USER_URI}/self`);
      return response;
    },
    async logout(pushMessageToken) {
      const client = await mainClient;
      let response = await client.post(`${USER_URI}/logout`, {
        pushMessageToken: pushMessageToken,
      });
      return response;
    },
    async getUserByEmail(email) {
      const client = await mainClient;
      let response = await client.get(`${USER_URI}?query={"email":"${email}"}`);
      const userExists = response.data?.length;
      console.log('userby email response', response);
      if (userExists) {
        const userId = response.data[0]._id;
        response = await this.getUserById(userId);
        console.log('userbyid response', response);
        return response;
      } else {
        return 0;
      }
    },
    async getUserById(id) {
      const client = await mainClient;
      let response = await client.get(`${USER_URI}/${id}`);
      return response;
    },
    async search(term, page, limit) {
      const client = await mainClient;
      let response = await client.get(
        `${USER_URI}/search?text=${term}&page=${page}&limit=${limit}`,
      );
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
    async updateUserBio(userId, bio) {
      const client = await mainClient;
      const response = client.put('user/' + userId, {
        bio: bio,
      });
      return response;
    },
    async updateUserDisplayname(userId, displayname) {
      const client = await mainClient;
      const response = client.put('user/' + userId, {
        displayname: displayname,
      });
      return response;
    },
    async blockUser(userId) {
      const client = await mainClient;
      const response = client.post(USER_URI + BLOCKUSER_URI + '/' + userId);
      return response;
    },
    async unblockUser(userId) {
      const client = await mainClient;
      const response = client.post(USER_URI + UNBLOCKUSER_URI + '/' + userId);
      return response;
    },
  },
  post: {
    async fetchUserPosts(userId, page, limit) {
      const client = await mainClient;
      let response = await client.get(
        USER_URI +
          '/' +
          userId +
          POST_URI +
          '?page=' +
          page +
          '&limit=' +
          limit,
      );
      return response;
    },
  },
  comment: {
    async fetchUserComments(userId, page, limit) {
      const client = await mainClient;
      let response = await client.get(
        USER_URI +
          '/' +
          userId +
          COMMENT_URI +
          '?page=' +
          page +
          '&limit=' +
          limit,
      );
      return response;
    },
  },
};

export default userApi;
