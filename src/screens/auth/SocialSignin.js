import React from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import {socialAuth} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';

const SocialAuth = () => {
  const dispatch = useDispatch();

  return (
    <View
      style={{
        width: '80%',
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          console.log('press gauth');
          dispatch(socialAuth('Google'));
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SocialIcon
          title="Sign in With Google"
          button
          type="google"
          iconSize={20}
          style={{
            width: '80%',
            height: 50,
          }}
        />
      </TouchableOpacity>
      {Platform.OS == 'ios' && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            console.log('press apple Auth');
            dispatch(socialAuth('Apple'));
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <SocialIcon
            title="Sign in With Apple"
            button
            type="apple"
            iconSize={20}
            style={{
              backgroundColor: '#0a0a0a',
              width: '80%',
              height: 50,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SocialAuth;
