import React, {memo} from 'react';
import Video from 'react-native-video';

const VideoPostContent = (props) => {
  const {mediaMetadata} = props;
  console.log('video link', mediaMetadata.secure_url);
  return (
    <Video
      style={{
        width: '100%',
        aspectRatio: 1,
      }}
      source={{uri: mediaMetadata.secure_url}}
      resizeMode="contain"
      paused={false}
      showPoster={true}
      playWhenInactive={false}
      muted={true}
      repeat={true}
    />
  );
};

export default memo(VideoPostContent);
