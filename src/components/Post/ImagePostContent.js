import React, {memo} from 'react';
import {View, Dimensions, ActivityIndicator} from 'react-native';
import {Image} from 'react-native-elements';

const ImagePostContent = (props) => {
  const {mediaMetadata} = props;

  const height = Math.ceil(
    (mediaMetadata.height * Dimensions.get('window').width) /
      mediaMetadata.width,
  );

  return (
    <View>
      <Image
        style={{
          height: height,
          width: '100%',
          resizeMode: 'contain',
          alignSelf: 'center',
        }}
        source={{
          uri: mediaMetadata.secure_url,
        }}
        placeholderStyle={{
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        PlaceholderContent={<ActivityIndicator size="large" color="#4285f4" />}
      />
    </View>
  );
};

export default memo(ImagePostContent);
