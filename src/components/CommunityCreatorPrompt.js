import React from 'react';
import {View, Text, Platform, Image} from 'react-native';
import {Overlay, Button} from 'react-native-elements';
import {
  resetCommunityCreatorPrompt,
  getCommunityCreatorPromptIsVisble,
  getCommunityCreatorPromptText,
} from '../redux/reducers/CommunityCreatorPromptSlice';
import {useSelector, useDispatch} from 'react-redux';
import {navigate, goBack} from '../navigation/Ref';

export const CommunityCreatorPromptView = (props) => {
  const dispatch = useDispatch();
  const text = props?.text
    ? props.text.trim().replace(' ', '_')
    : useSelector(getCommunityCreatorPromptText);
  const {image, shouldGoBack, title} = props;
  const imageRequirePath =
    image == 'failSearchCommunity'
      ? require('../../assets/failSearchCommunity.jpg')
      : require('../../assets/evide.jpg');

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
          color: '#444',
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {title ? title : 'Oops, this community does not exist yet'}
      </Text>
      <View style={{height: 10}}></View>
      <Text
        style={{
          color: '#555',
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {' '}
        Would you like to create a community on this topic?
      </Text>
      <View style={{height: 20}}></View>
      <Button
        raised
        title="Create Community"
        buttonStyle={{
          width: 180,
          borderRadius: 15,
          backgroundColor: '#2a9df4',
          paddingVertical: 10,
        }}
        titleStyle={{
          textTransform: 'uppercase',
          color: '#fff',
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
          raised
          title="Go Back"
          buttonStyle={{
            width: 180,
            borderRadius: 15,
            backgroundColor: '#ccc',
            paddingVertical: 10,
          }}
          titleStyle={{
            textTransform: 'uppercase',
            color: '#fff',
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
          raised
          title="No Thanks"
          buttonStyle={{
            width: 180,
            borderRadius: 15,
            backgroundColor: '#ccc',
            paddingVertical: 10,
          }}
          titleStyle={{
            textTransform: 'uppercase',
            color: '#fff',
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
  const dispatch = useDispatch();
  const isVisible = useSelector(getCommunityCreatorPromptIsVisble);

  return (
    <Overlay
      isVisible={isVisible}
      statusBarTranslucent={true}
      onBackdropPress={() => dispatch(resetCommunityCreatorPrompt())}
      overlayStyle={{
        position: 'absolute',
        bottom: 0,
        width: '97%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
      backdropStyle={{
        backgroundColor: '#000',
        opacity: 0.2,
      }}>
      <CommunityCreatorPromptView />
    </Overlay>
  );
}
