import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import auth from '@react-native-firebase/auth';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {emailLinkAuth} from '../../redux/actions/AuthActions';

const EmailLinkHandler = () => {
  const {loading, error} = useEmailLinkEffect();

  // Show an overlay with a loading indicator while the email link is processed
  if (loading || error) {
    return <View></View>;
  }

  // Hide otherwise. Or show some content if you are using this as a separate screen
  return null;
};

const useEmailLinkEffect = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getData = async () => {
    try {
      const email = await AsyncStorage.getItem('emailForSignIn');
      return email;
    } catch (e) {
      console.log('error getting email from async storage', e);
    }
  };
  useEffect(() => {
    const handleDynamicLink = async (link) => {
      // Check and handle if the link is a email login link
      if (auth().isSignInWithEmailLink(link.url)) {
        setLoading(true);
        try {
          // use the email we saved earlier
          const email = await getData();
          dispatch(emailLinkAuth({email: email, link: link}));
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      }
    };
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    /* When the app is not running and is launched by a magic link the `onLink`
        method won't fire, we can handle the app being launched by a magic link like this */
    dynamicLinks()
      .getInitialLink()
      .then((link) => link && handleDynamicLink(link));

    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  return {error, loading};
};

export default EmailLinkHandler;
