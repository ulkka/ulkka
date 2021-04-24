import React from 'react';
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {Divider} from 'react-native-elements';
import EmailLinkSignIn from './EmailLinkSignin';
import SocialSignin from './SocialSignin';

export default function Login() {
  const AppIcon = (
    <Image
      source={require('../../../assets/ulkka_transparent_512x512.png')}
      style={{height: 100, width: 100}}
      resizeMode="contain"
    />
  );
  const Title = (
    <View
      style={{
        height: (Dimensions.get('screen').height * 15) / 100,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#555',
          fontSize: 20,
        }}>
        {'  '}
        Welcome to Ulkka{'  '}
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
        {' '}
        Or{' '}
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
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {AppIcon}
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
        <SocialSignin />
      </View>
    </KeyboardAvoidingView>
  );
}
