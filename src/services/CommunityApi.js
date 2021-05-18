import mainClient from '../client/mainClient';

const COMMUNITY_URI = '/community';

const communityApi = {
  community: {
    async create(payload) {
      const client = await mainClient;
      const response = await client.post(COMMUNITY_URI, payload);
      return response;
    },
    async communityTitleExists(title) {
      const client = await mainClient;
      let response = await client.get(
        `${COMMUNITY_URI}?query={"name":"${title}"}`,
      );
      return response;
    },
    async join(communityId) {
      const client = await mainClient;
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/join`,
      );
      return response;
    },
    async leave(communityId) {
      const client = await mainClient;
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/leave`,
      );
      return response;
    },
    async fetchById(communityId) {
      const client = await mainClient;
      const response = await client.get(`${COMMUNITY_URI}/${communityId}`);
      return response;
    },
    async fetchTop() {
      const client = await mainClient;
      const response = await client.get(`${COMMUNITY_URI}/top`);
      return response;
    },
    async inviteUser(communityId, userId) {
      const client = await mainClient;
      const response = await client.get(
        `${COMMUNITY_URI}/${communityId}/invite/${userId}`,
      );
      return response;
    },
    async updateField(communityId, field, value) {
      const client = await mainClient;
      let payload = {};
      payload[field] = value;
      const response = await client
        .put(`${COMMUNITY_URI}/${communityId}`, payload)
        .catch((error) => {
          console.log('error updating community rule', error);
        });
      return response;
    },
  },
};

export default communityApi;
