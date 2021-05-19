import mainClient from '../client/mainClient';

const FEED_URI = '/feed';
const USER_URI = '/user';
const COMMUNITY_URI = '/community';
const HOME_URI = '/home';
const POPULAR_URI = '/all';

const feedApi = {
  main: {
    async fetch(screen, page, limit, sort) {
      const client = await mainClient;
      const sortPath = sort && `&sort=${sort}`;
      const mainUri = screen == 'popular' ? POPULAR_URI : HOME_URI;
      const path = `${FEED_URI}${mainUri}?page=${page}&limit=${limit}&sort=${sort}`;
      const response = await client.get(path);
      return response;
    },
  },
  user: {
    async fetch(userId, page, limit, sort) {
      const client = await mainClient;
      const path = `${FEED_URI}${USER_URI}/${userId}?page=${page}&limit=${limit}&sort=${sort}`;
      const response = await client.get(path);
      return response;
    },
  },
  community: {
    async fetch(communityId, page, limit, sort) {
      const client = await mainClient;
      const path = `${FEED_URI}${COMMUNITY_URI}/${communityId}?page=${page}&limit=${limit}&sort=${sort}`;
      const response = await client.get(path);
      return response;
    },
  },
};

export default feedApi;
