import mainClient from '../client/mainClient';

const POST_URI = '/post';
const COMMENT_URI = '/comment';
const POPULAR_URI = '/popular';

const postApi = {
  post: {
    async create(payload) {
      const client = await mainClient;
      let response = await client.post(POST_URI, payload);
      return response;
    },
    async fetch(page, limit) {
      const client = await mainClient;
      let response = await client.get(
        POST_URI + POPULAR_URI + '?page=' + page + '&limit=' + limit,
      );
      return response;
    },
    async fetchById(id) {
      const client = await mainClient;
      let response = await client.get(POST_URI + '/' + id);
      return response;
    },
    async vote(postId, voteType) {
      const client = await mainClient;
      let response = await client.post(
        POST_URI + '/' + postId + '/vote/' + voteType,
      );
      return response;
    },
    async delete(postId) {
      const client = await mainClient;
      let response = await client.delete(POST_URI + '/' + postId);
      return response;
    },
    async report(postId, reason) {
      const client = await mainClient;
      const data = {
        reason: reason,
      };
      let response = await client.post(
        POST_URI + '/' + postId + '/report',
        data,
      );
      return response;
    },
  },
  comment: {
    async fetch(postId) {
      const client = await mainClient;
      let response = await client.get(POST_URI + '/' + postId + '/comments');
      return response;
    },
    async vote(commentId, voteType) {
      const client = await mainClient;
      let response = await client.post(
        COMMENT_URI + '/' + commentId + '/vote/' + voteType,
      );
      return response;
    },
    async create(comment, postId, parentCommentId) {
      const client = await mainClient;
      var payload = {};
      if (parentCommentId != undefined) {
        payload = {
          text: comment,
          post: postId,
          parent: parentCommentId,
        };
      } else {
        payload = {
          text: comment,
          post: postId,
        };
      }
      let response = await client.post(COMMENT_URI, payload);
      return response;
    },
    async delete(commentId) {
      const client = await mainClient;
      let response = await client.delete(COMMENT_URI + '/' + commentId);
      return response;
    },
    async report(commentId, reason) {
      const client = await mainClient;
      const data = {
        reason: reason,
      };
      let response = await client.post(
        COMMENT_URI + '/' + commentId + '/report',
        data,
      );

      return response;
    },
  },
  users: {},
};

export default postApi;
