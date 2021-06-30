import React, {memo} from 'react';
import {
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image'; // delete extra lines from android/app/proguard-rules.pro if uninstalling
import ImageZoom from 'react-native-image-pan-zoom';
import {Icon} from 'react-native-elements';
import {goBack, pop, push} from '../../navigation/Ref';

const ImageZoomer = ({route}) => {
  const {height, width, imageUrl, postId, screen} = route.params;

  console.log('route params image zoomer', route.params);

  const footer = (
    <View
      style={{
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
      }}>
      <View style={{flex: 1}}></View>
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            raised
            name="close"
            type="font-awesome"
            color="#333"
            size={20}
            style={{opacity: 0.8}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        {screen !== 'PostDetail' && (
          <TouchableOpacity
            onPress={() => {
              pop();
              push('PostDetail', {postId: postId});
            }}
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              marginRight: 15,
              borderRadius: 15,
              opacity: 0.8,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              See Post
            </Text>
            <View style={{width: 10}}></View>
            <Icon name="arrow-forward-ios" color="#333" size={14} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#222',
      }}>
      <StatusBar
        animated={true}
        backgroundColor={'#222'}
        showHideTransition="fade"
      />
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height - 125}
        imageWidth={width ? width : '100%'}
        imageHeight={height ? height : '300'}
        useNativeDriver={true}>
        <FastImage
          style={{
            height: height ? height : '300',
            width: width ? width : '100%',
            alignSelf: 'center',
          }}
          source={{
            uri: imageUrl,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </ImageZoom>
      {footer}
    </View>
  );
};

export default memo(ImageZoomer);
