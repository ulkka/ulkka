import mainClient from '../client/mainClient';

const NOTIFICATIONS_URI = '/notification';

const notificationsApi = {
  async getAllNotifications(page, limit) {
    const client = await mainClient;
    let response = await client.get(
      `${NOTIFICATIONS_URI}?all=true&page=${page}&limit=${limit}`,
    );

    return response;
  },
  async getUnreadNotifications(page, limit) {
    const client = await mainClient;
    let response = await client.get(
      `${NOTIFICATIONS_URI}?page=${page}&limit=${limit}`,
    );

    return response;
  },
  async markAllRead() {
    const client = await mainClient;
    let response = await client.post(`${NOTIFICATIONS_URI}/markAllRead`);

    return response;
  },
  async markRead(id) {
    if (id === undefined) throw new Error('Notification ID is undefined');
    const client = await mainClient;
    let response = await client.post(`${NOTIFICATIONS_URI}/${id}/markRead`);

    return response;
  },
  async unReadCount() {
    const client = await mainClient;
    let response = await client.get(`${NOTIFICATIONS_URI}/unReadCount`);

    return response;
  },
};

export default notificationsApi;
