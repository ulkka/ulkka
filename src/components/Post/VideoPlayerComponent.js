import React, {memo} from 'react';
import {Platform} from 'react-native';
import Video from 'react-native-video';

const VideoComponent = (props) => {
  const {paused, onLoad, posterUrl, height, width, url} = props;
  return (
    <Video
      style={{
        width: width,
        height: height,
      }}
      source={{uri: url}}
      resizeMode="contain"
      paused={paused}
      onLoad={onLoad}
      poster={posterUrl}
      showPoster={Platform.OS == 'ios' ? false : true}
      playWhenInactive={false}
      muted={true}
      repeat={true}
      controls={false}
    />
  );
};

export default memo(VideoComponent);
