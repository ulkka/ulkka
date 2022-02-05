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
import {Divider, useTheme} from 'react-native-elements';
import EmailLinkSignIn from './EmailLinkSignin';
import SocialSignin from './SocialSignin';

export default function Login() {
  const {theme} = useTheme();

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
          color: theme.colors.black3,
          fontSize: 20,
        }}>
        {'  '}
        Selamat datang di Omong!{'  '}
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
        color={theme.colors.grey4}
        style={{
          width: '25%',
        }}
      />
      <Text
        style={{
          paddingHorizontal: 10,
          fontWeight: 'bold',
          color: theme.colors.black4,
          fontSize: 14,
        }}>
        {' '}
        Atau{' '}
      </Text>
      <Divider
        color={theme.colors.grey4}
        style={{
          width: '25%',
        }}
      />
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <ImageBackground
        //  blurRadius={1}
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
        source={
          theme.dark
            ? require('../../../assets/doodlebg_dark.jpg')
            : require('../../../assets/doodlebg.jpg')
        }>
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
    </View>
  );
}
