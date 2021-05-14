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
        communityId,
      );
      return response;
    },
    async leave(communityId) {
      const client = await mainClient;
      const response = await client.post(
        `${COMMUNITY_URI}/${communityId}/leave`,
        communityId,
      );
      return response;
    },
  },
};

export default communityApi;
