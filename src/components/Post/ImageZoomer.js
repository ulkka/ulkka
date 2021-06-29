import React, {memo} from 'react';
import {View, Dimensions, StatusBar, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image'; // delete extra lines from android/app/proguard-rules.pro if uninstalling
import ImageZoom from 'react-native-image-pan-zoom';
import {Icon} from 'react-native-elements';
import {goBack} from '../../navigation/Ref';

const ImageZoomer = ({route}) => {
  const {height, width, imageUrl} = route.params;

  const closeButton = (
    <TouchableOpacity
      onPress={() => {
        goBack();
      }}
      style={{
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon raised name="close" type="font-awesome" color="#333" size={25} />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#222',
      }}>
      {closeButton}
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
    </View>
  );
};

export default memo(ImageZoomer);
