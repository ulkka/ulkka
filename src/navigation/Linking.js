const config = {
  screens: {
    Main: {
      screens: {
        CreatePost: 'create/post',
        PostDetail: 'postdetail',
        Feed: {
          screens: {
            Home: 'home',
            Popular: 'popular',
          },
        },
        Community: 'community',
        Account: 'account',
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
