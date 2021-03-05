import React from 'react';
import Video from 'react-native-video';

const VideoPostContent = (props) => {
  const postId = props.postId;
  return (
    <Video
      style={{
        width: '100%',
        aspectRatio: 1,
      }}
      source={{uri: post.link}}
      resizeMode="contain"
      paused={false}
      showPoster={true}
      playWhenInactive={false}
      muted={true}
      repeat={true}
    />
  );
};

export default VideoPostContent;
