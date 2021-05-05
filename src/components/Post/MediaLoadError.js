import React, {memo} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {downloadMedia} from '../../redux/actions/PostActions';

const MediaLoadError = (props) => {
  const dispatch = useDispatch();
  const {type, postId} = props;
  return type == 'Image' ? (
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 5,
        opacity: 0.7,
        borderRadius: 10,
      }}>
      <Icon type="font-awesome" name="warning" color="red" size={22} />
      <Text style={{padding: 5}}>Image not available</Text>
    </View>
  ) : (
    <TouchableOpacity
      onPress={() => dispatch(downloadMedia(postId))}
      style={{
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 10,
        opacity: 0.7,
        borderRadius: 10,
      }}>
      <Icon type="font-awesome" name="warning" color="#222" size={22} />
      <Text style={{padding: 5, fontSize: 13}}>Error loading</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Tap to retry
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(MediaLoadError);
