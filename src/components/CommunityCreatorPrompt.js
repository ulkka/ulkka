import React from 'react';
import {View, Text, TouchableOpacity, Platform, Image} from 'react-native';
import {Overlay, Button} from 'react-native-elements';
import {
  resetCommunityCreatorPrompt,
  getCommunityCreatorPromptIsVisble,
  getCommunityCreatorPromptText,
} from '../redux/reducers/CommunityCreatorPromptSlice';
import {useSelector, useDispatch} from 'react-redux';
import {navigate} from '../navigation/Ref';

export default function CommunityCreatorPrompt(props) {
  const dispatch = useDispatch();
  const isVisible = useSelector(getCommunityCreatorPromptIsVisble);
  const text = useSelector(getCommunityCreatorPromptText);

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
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        <Image
          source={require('../../assets/evide.jpg')}
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
          Oops, this community does not exist yet
        </Text>
        <View style={{height: 10}}></View>
        <Text
          style={{
            color: '#555',
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {' '}
          Would you like to create one?
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
      </View>
    </Overlay>
  );
}
