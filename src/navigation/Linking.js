import {Linking} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import auth from '@react-native-firebase/auth';

const config = {
  screens: {
    Main: {
      screens: {
        CreatePost: 'create/post',
        PostDetail: 'post/:postId/:commentId?',
        Feed: {
          screens: {
            Home: '',
            Popular: 'popular',
          },
        },
        CommunityNavigation: 'community/:communityId',
        UserDetail: 'user',
      },
    },
    Authentication: 'myaccount',
    'Create Community': 'create/community',
  },
};
export const linking = {
  prefixes: [
    'https://app.ulkka.in',
    'https://ulkka.in',
    'ulkka://',
    'https://ulkka.page.link',
    'https://ulkka-in.firebaseapp.com',
  ],
  config,
  async getInitialURL() {
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }
  },
  subscribe(listener) {
    const onReceiveURL = link => {
      if (auth().isSignInWithEmailLink(link.url)) {
        //let email link auth handler handle this from screens/auth/EmailLinkHandler
      } else {
        listener(link.url);
      }
    };

    const unsubscribe = dynamicLinks().onLink(onReceiveURL);

    dynamicLinks()
      .getInitialLink()
      .then(link => link && onReceiveURL(link));

    return () => unsubscribe();
  },
};
