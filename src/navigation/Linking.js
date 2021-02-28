const config = {
  screens: {
    Main: {
      screens: {
        Home: {
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
        'Create Community': 'create/community',
        'My Account': 'myaccount',
        'Login / Register': 'login',
      },
    },
    Signup: 'signup',
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
