const config = {
  screens: {
    Main: {
      screens: {
        CreatePost: 'create/post',
        PostDetail: 'post/:postId',
        Feed: {
          screens: {
            Home: 'home',
            Popular: 'popular',
          },
        },
        Community: 'community',
        UserDetail: 'user',
      },
    },
    Authentication: 'myaccount',
    'Create Community': 'create/community',
  },
};

export const linking = {
  prefixes: [
    'https://app.vellarikkapattanam.com',
    'https://vellarikkapattanam.com',
    'vellarikkapattanam://',
    'https://vellarikkapattanam.page.link',
    'https://vellarikka-pattanam.firebaseapp.com',
  ],
  config,
};
