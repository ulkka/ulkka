import React, {useState, useRef} from 'react';
import {Alert, Button, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Icon} from 'react-native-elements';
import {openInbox} from 'react-native-email-link';

const EmailLinkSignIn = () => {
  const emailFieldRef = useRef(null);
  const [email, setEmail] = useState('');
  const renderErrorMessage = false;
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const sendSignInLink = async (email) => {
    const actionCodeSettings = {
      handleCodeInApp: true,
      // URL must be whitelisted in the Firebase Console.
      url: 'https://vellarikkapattanam.page.link/naxz',
      iOS: {
        bundleId: 'org.reactjs.native.example.VellarikkaPattanam',
      },
      android: {
        packageName: 'com.dubiousknight.vellarikkapattanam',
        installApp: true,
        //  minimumVersion: '12',
      },
    };

    // Save the email for latter usage
    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('emailForSignIn', value);
      } catch (e) {
        // saving error
        console.log('error saving email in async storage', e);
      }
    };

    storeData(email);

    await auth()
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(async () => {
        await openInbox({
          title: `Login link sent to ${email}`,
          message:
            'Please check your email and click on the link to login/register',
        }).catch((error) => {
          Alert.alert(
            `Login link sent to ${email}.`,
            'Please check your email and click on the link to login/register',
          );
        });
      })
      .catch((error) => {
        console.log(error);
        setEmailErrorMessage('Invalid Email');
      });
  };

  return (
    <View>
      <Input
        ref={emailFieldRef}
        placeholder="Email"
        containerStyle={{width: 300}}
        inputContainerStyle={{borderBottomColor: '#ddd'}}
        inputStyle={{fontSize: 14, marginLeft: 10}}
        leftIcon={<Icon name="mail" size={20} color="green" />}
        errorStyle={{color: 'red'}}
        errorMessage={emailErrorMessage}
        renderErrorMessage={renderErrorMessage}
        onFocus={() => {
          setEmailErrorMessage('');
        }}
        onChangeText={(text) => {
          setEmail(text);
        }}
        value={email}
      />
      <Button
        title="Send Login Link"
        onPress={() => {
          emailFieldRef.current.blur();
          sendSignInLink(email);
        }}
      />
    </View>
  );
};

export default EmailLinkSignIn;
