import mainClient from '../client/mainClient';

const POST_URI = '/post';
const COMMENT_URI = '/comment';
const POPULAR_URI = '/popular';

const postApi = {
  post: {
    async fetch(page, limit) {
      const client = await mainClient;
      let response = await client.get(
        POST_URI + POPULAR_URI + '?page=' + page + '&limit=' + limit,
      );
      return response;
    },
    async vote(postId, voteType) {
      const client = await mainClient;
      let response = await client.post(
        POST_URI + '/' + postId + '/vote/' + voteType,
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
  },
  users: {},
};

export default postApi;
