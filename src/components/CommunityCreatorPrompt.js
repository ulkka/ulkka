import React from 'react';
import {View, Text, Platform, Image} from 'react-native';
import {Overlay, Button, useTheme} from 'react-native-elements';
import {
  resetCommunityCreatorPrompt,
  getCommunityCreatorPromptIsVisble,
  getCommunityCreatorPromptText,
} from '../redux/reducers/CommunityCreatorPromptSlice';
import {useSelector, useDispatch} from 'react-redux';
import {navigate, goBack} from '../navigation/Ref';
import {useTranslation} from 'react-i18next';

export const CommunityCreatorPromptView = props => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const text = props?.text
    ? props.text.trim().replace(' ', '_').replace(/#/g, '')
    : useSelector(getCommunityCreatorPromptText);
  const {image, shouldGoBack, title} = props;
  const imageRequirePath = require('../../assets/evide.jpg');
  //  image == 'failSearchCommunity'
  //    ? require('../../assets/failSearchCommunity.jpg')
  //    : require('../../assets/evide.jpg');

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
      <Image
        source={imageRequirePath}
        width={180}
        height={100}
        style={{borderRadius: 15}}
      />
      <View style={{height: 25}}></View>
      <Text
        style={{
          fontSize: 16,
          color: theme.colors.black4,
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {title ? title : 'Oops, this community does not exist yet'}
      </Text>
      <View style={{height: 10}}></View>
      <Text
        style={{
          color: theme.colors.black5,
          fontWeight: 'bold',
          textAlign: 'center',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {' '}
        {t('Interested in creating community')}
      </Text>
      <View style={{height: 20}}></View>
      <Button
        title={t('Create Community')}
        buttonStyle={{
          width: 180,
          borderRadius: 15,
          backgroundColor: theme.colors.blue,
          paddingVertical: 10,
        }}
        titleStyle={{
          textTransform: 'uppercase',
          color: theme.colors.primary,
          fontSize: 13,
          ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
        }}
        onPress={() => {
          dispatch(resetCommunityCreatorPrompt());
          navigate('Create Community', {name: text});
        }}
      />
      <View style={{height: 15}}></View>
      {shouldGoBack ? (
        <Button
          title={t('Back')}
          buttonStyle={{
            width: 180,
            borderRadius: 15,
            backgroundColor: theme.colors.grey4,
            paddingVertical: 10,
          }}
          titleStyle={{
            textTransform: 'uppercase',
            color: theme.colors.primary,
            fontSize: 13,
            ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
          }}
          onPress={() => {
            dispatch(resetCommunityCreatorPrompt());
            goBack();
          }}
        />
      ) : (
        <Button
          title="No Thanks"
          buttonStyle={{
            borderWidth: 1,
            borderColor: theme.colors.grey2,
            width: 180,
            borderRadius: 15,
            backgroundColor: theme.colors.grey4,
            paddingVertical: 10,
          }}
          titleStyle={{
            textTransform: 'uppercase',
            color: theme.colors.primary,
            fontSize: 13,
            ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
          }}
          onPress={() => dispatch(resetCommunityCreatorPrompt())}
        />
      )}
    </View>
  );
};

export function CommunityCreatorPromptOverlay(props) {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const isVisible = useSelector(getCommunityCreatorPromptIsVisble);

  return (
    <Overlay
      isVisible={isVisible}
      statusBarTranslucent={true}
      onBackdropPress={() => dispatch(resetCommunityCreatorPrompt())}
      overlayStyle={{
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        bottom: 0,
        width: '97%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
      backdropStyle={{
        backgroundColor: theme.colors.black0,
        opacity: 0.2,
      }}>
      <CommunityCreatorPromptView />
    </Overlay>
  );
}
