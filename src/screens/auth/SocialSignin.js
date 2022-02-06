import React from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {SocialIcon, useTheme} from 'react-native-elements';
import {socialAuth} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

const SocialAuth = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const dispatch = useDispatch();

  return (
    <View
      style={{
        width: '80%',
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(socialAuth('Google'));
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SocialIcon
          title={
            Platform.OS == 'android'
              ? t('Continue with Google')
              : t('Sign in with Google')
          }
          button
          type="google"
          iconSize={20}
          style={{
            width: '80%',
          }}
        />
      </TouchableOpacity>
      {Platform.OS == 'ios' && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            dispatch(socialAuth('Apple'));
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <SocialIcon
            title={t('Sign in with Apple')}
            button
            type="apple"
            iconSize={20}
            fontStyle={{color: theme.colors.grey1}}
            iconStyle={{color: theme.colors.grey1}}
            style={{
              backgroundColor: theme.colors.black2,
              width: '80%',
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SocialAuth;
