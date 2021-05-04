import mainClient from '../client/mainClient';

const NOTIFICATIONS_URI = '/notification';

const notificationsApi = {
  async getAllNotifications(page, limit) {
    const client = await mainClient;
    let response = await client
      .get(`${NOTIFICATIONS_URI}?all=true&page=${page}&limit=${limit}`)
      .catch((error) => console.error(error));
    return response;
  },
  async getUnreadNotifications(page, limit) {
    const client = await mainClient;
    let response = await client
      .get(`${NOTIFICATIONS_URI}?page=${page}&limit=${limit}`)
      .catch((error) => console.error(error));
    return response;
  },
  async markAllRead() {
    const client = await mainClient;
    let response = await client
      .post(`${NOTIFICATIONS_URI}/markAllRead`)
      .catch((error) => console.error(error));
    return response;
  },
  async markRead(id) {
    const client = await mainClient;
    let response = await client
      .post(`${NOTIFICATIONS_URI}/${id}/markRead`)
      .catch((error) => console.error(error));
    return response;
  },
  async unReadCount() {
    const client = await mainClient;
    let response = await client
      .get(`${NOTIFICATIONS_URI}/unReadCount`)
      .catch((error) => console.error(error));
    return response;
  },
};

export default notificationsApi;
