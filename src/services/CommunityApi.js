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
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/invite/${userId}`,
      );
      return response;
    },
    async fetchMembers(communityId, page, limit) {
      const client = await mainClient;
      const response = await client.get(
        `${COMMUNITY_URI}/${communityId}/members?page=${page}&limit=${limit}`,
      );
      return response;
    },
    async search(term, page, limit) {
      const client = await mainClient;
      const response = await client.get(
        `${COMMUNITY_URI}/search?text=${term}&page=${page}&limit=${limit}`,
      );
      return response;
    },
    async fetchTopics() {
      const client = await mainClient;
      const response = await client.get(
        `${COMMUNITY_URI}/category?page=1&limit=50`,
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
    async addAsAdmin(communityId, userId) {
      const client = await mainClient;
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/addAsAdmin/${userId}`,
      );
      return response;
    },
    async dismissAsAdmin(communityId, userId) {
      const client = await mainClient;
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/dismissAsAdmin/${userId}`,
      );
      return response;
    },
    async banUser(communityId, userId) {
      const client = await mainClient;
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/ban/${userId}`,
      );
      return response;
    },
    async unbanUser(communityId, userId) {
      const client = await mainClient;
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/unban/${userId}`,
      );
      return response;
    },
    async searchMembers(communityId, text, page, limit) {
      const client = await mainClient;
      const response = await client.get(
        `${COMMUNITY_URI}/${communityId}/searchMembersByName?displayname=${text}&page=${page}&limit=${limit}`,
      );
      return response;
    },
    async bannedMembers(communityId, page, limit) {
      const client = await mainClient;
      const response = await client.get(
        `${COMMUNITY_URI}/${communityId}/bannedMembers?page=${page}&limit=${limit}`,
      );
      return response;
    },
    async searchByName(text) {
      const client = await mainClient;
      const response = await client.get(`${COMMUNITY_URI}/byName/${text}`);
      return response;
    },
    async toggleAdminNotifications(communityId) {
      const client = await mainClient;
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/toggleAdminNotifications/`,
      );
      return response;
    },
  },
};

export default communityApi;
