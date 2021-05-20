import React from 'react';
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
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
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#333',
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
    <ImageBackground
      blurRadius={0.5}
      resizeMode="repeat"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height:
          Platform.OS == 'android'
            ? Dimensions.get('window').height - 50
            : '100%',
      }}
      source={require('../../../assets/doodlebg.jpg')}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'android' ? -15 : -80}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,

          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {AppIcon}
          <View style={{height: 50}}></View>
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
    </ImageBackground>
  );
}
