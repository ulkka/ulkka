import React, {useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {SocialIcon, Button, Divider, Input, Icon} from 'react-native-elements';
import * as AuthNavigation from '../auth/AuthNavigation';

GoogleSignin.configure({
  scopes: ['openid', 'email', 'profile'],
  iosClientId:
    '125095692098-59niqmb4q23se9im25r19rcous61iotk.apps.googleusercontent.com',
  webClientId:
    '125095692098-jvns3h2vfqkf3ufrb0kcqhf1k2abicog.apps.googleusercontent.com',
});

export default function SignIn(props) {
  var authFlag = true;

  const onGoogleButtonPress = async () => {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  };

  const onEmailButtonPress = async () => {
    var credential = auth.EmailAuthProvider.credential(
      'arjunswarrier@gmail.com',
      'kuttettan',
    );
    return auth().signInWithCredential(credential);
  };

  async function onAuthStateChanged(user) {
    if (authFlag) {
      authFlag = false;
      if (user) {
        await auth()
          .currentUser.getIdToken(false)
          .then((id_token) => {
            props.addAuth(user, id_token);
            console.log('in user', user);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log('null user');
      }
    }
    authFlag = true;
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 20,
        }}>
        <Text style={{fontWeight: 'bold', color: '#444'}}>
          Login to Vellarikka Pattanam
        </Text>
      </View>
      <View
        style={{
          flex: 3,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          borderColor: '#ddd',
          borderRadius: 10,
        }}>
        <View style={{width: 300}}>
          <Input
            placeholder="Email"
            inputContainerStyle={{
              borderBottomColor: '#ddd',
            }}
            inputStyle={{
              fontSize: 16,
            }}
            leftIcon={<Icon name="mail" size={18} />}
            leftIconContainerStyle={{
              paddingRight: 10,
            }}
          />
          <Input
            placeholder="Password"
            secureTextEntry={true}
            inputContainerStyle={{
              borderBottomColor: '#ddd',
            }}
            inputStyle={{
              fontSize: 16,
            }}
            leftIcon={<Icon name="key" size={18} type="font-awesome-5" />}
            leftIconContainerStyle={{
              paddingRight: 10,
            }}
          />
        </View>
        <View style={{width: '30%', marginTop: 10}}>
          <Button
            title="Login"
            buttonStyle={{
              backgroundColor: 'green',
              borderRadius: 10,
              width: '100%',
              height: 35,
            }}
            titleStyle={{
              fontSize: 14,
              fontWeight: 'bold',
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
          padding: 10,
        }}>
        <TouchableOpacity>
          <Text style={{color: '#333', textDecorationLine: 'underline'}}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => AuthNavigation.navigate('CreateAccount')}>
          <Text style={{color: '#333', textDecorationLine: 'underline'}}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
        }}>
        <SocialIcon
          title="Login With Google"
          button
          type="google"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
          iconSize={20}
          style={{
            width: '80%',
          }}
        />
        <SocialIcon
          title="Login With Facebook"
          button
          type="facebook"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
          iconSize={20}
          style={{
            width: '80%',
          }}
        />
      </View>
    </View>
  );
}
