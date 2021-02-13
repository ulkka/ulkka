import React from 'react';
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SocialIcon, Divider} from 'react-native-elements';
import {socialAuth} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import EmailLinkSignIn from './EmailLinkSignin';

export default function Login() {
  const dispatch = useDispatch();
  const Title = (
    <View
      style={{
        height: (Dimensions.get('screen').height * 30) / 100,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          width: 280,
          color: '#444',
          fontSize: 18,
        }}>
        Welcome to Vellarikka Pattanam
      </Text>
    </View>
  );

  const DividerView = (
    <View
      style={{
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Divider
        style={{
          width: '25%',
          height: 1,
          backgroundColor: '#888',
        }}
      />
      <Text
        style={{
          paddingHorizontal: 10,
          fontWeight: 'bold',
          color: '#444',
          fontSize: 14,
        }}>
        Or
      </Text>
      <Divider
        style={{
          width: '25%',
          height: 1,
          backgroundColor: '#888',
        }}
      />
    </View>
  );

  const SocialAuth = (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
      }}>
      <SocialIcon
        title="Login With Google"
        button
        type="google"
        onPress={() => dispatch(socialAuth('Google'))}
        iconSize={20}
        style={{
          width: '80%',
          height: 50,
        }}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={-55}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flex: 1,
        }}>
        {Title}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <EmailLinkSignIn />
        {DividerView}
        {SocialAuth}
      </View>
    </KeyboardAvoidingView>
  );
}
