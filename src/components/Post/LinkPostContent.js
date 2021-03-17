import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Image} from 'react-native-elements';
import Video from 'react-native-video';
import {scaleHeightAndWidthAccordingToDimensions} from './helpers';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getFeedPostFieldSelector} from '../../redux/selectors/FeedSelectors';
import {Icon} from 'react-native-elements';

const LinkPostContent = (props) => {
  const {ogData, link, screen, postId} = props;

  const [paused, setPaused] = useState(true);
  const [loading, setLoading] = useState(true);

  const title = ogData?.ogTitle;
  const description = ogData?.ogDescription;
  const url = ogData?.ogUrl;

  const videoUrl = ogData?.ogVideo?.url;
  const videoHeight = ogData?.ogVideo?.height;
  const videoWidth = ogData?.ogVideo?.width;

  const imageUrl = ogData?.ogImage?.url;
  const imageHeight = ogData?.ogImage?.height;
  const imageWidth = ogData?.ogImage?.width;

  const type = videoUrl ? 'video' : imageUrl ? 'image' : undefined;

  const metadata = type
    ? type == 'video'
      ? {height: videoHeight, width: videoWidth}
      : {height: imageHeight, width: imageWidth}
    : undefined;

  const {height, width} = scaleHeightAndWidthAccordingToDimensions(metadata);

  const getHostnameFromRegex = (url) => {
    // run against regex
    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    // extract hostname (will be null if no match is found)
    return matches && matches[1];
  };

  const domain = getHostnameFromRegex(url).replace('www.', '');

  const videoId =
    domain == 'youtube.com'
      ? videoUrl.substring(videoUrl.lastIndexOf('/') + 1, videoUrl.length)
      : null;

  const getFeedPostField = getFeedPostFieldSelector();
  const isViewable =
    screen == 'PostDetail'
      ? true
      : useSelector((state) =>
          getFeedPostField(state.feed.screens[screen], postId, 'isViewable'),
        );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setPaused(true);
    }
  }, [isFocused]);

  useEffect(() => {
    console.log(' link post viewabality', postId, isViewable);
    if (!isViewable && !paused) {
      console.log(' link post viewabality going to pause', postId, isViewable);

      setPaused(true);
    }
  }, [isViewable]);

  const videoPlayer = (
    <Video
      style={{
        width: width - 27,
        height: height,
      }}
      source={{uri: ogData.ogVideo.url}}
      resizeMode="cover"
      paused={paused}
      onLoad={() => setLoading(false)}
      poster={ogData.ogImage.url}
      showPoster={true}
      playWhenInactive={false}
      muted={false}
      repeat={true}
      controls={Platform.OS == 'ios' ? true : false}
    />
  );

  const PlayerControls = loading ? (
    <View
      style={{
        position: 'absolute',
      }}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  ) : (
    <TouchableOpacity
      hitSlop={{
        top: height / 4,
        bottom: height / 4,
        left: width / 2,
        right: width / 2,
      }}
      style={{position: 'absolute'}}
      onPress={() => setPaused(!paused)}>
      {paused &&
        Platform.OS != 'ios' && ( // dot show play button when on ios
          <Icon name="play" type="font-awesome-5" size={50} color="#fff" />
        )}
    </TouchableOpacity>
  );

  const LinkVideo = (
    <View>
      {domain == 'youtube.com' ? (
        <YoutubePlayer
          height={height}
          width={width - 21}
          play={false}
          videoId={videoId}
          // onChangeState={onStateChange}
        />
      ) : (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {videoPlayer}
          {PlayerControls}
        </View>
      )}
    </View>
  );

  const LinkImage = (
    <TouchableOpacity
      onPress={() => console.log('click link')}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
      }}>
      <Image
        source={{
          uri: ogData.ogImage.url,
        }}
        style={{
          width: width - 21,
          height: height,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );

  const LinkTitle = (
    <View
      style={{
        margin: 5,
      }}>
      <Text style={{fontWeight: 'bold', fontSize: 13, color: '#333'}}>
        {ogData.ogTitle}
      </Text>
    </View>
  );

  const LinkDescription = (
    <View style={{marginHorizontal: 5}}>
      <Text style={{fontSize: 11, color: '#444'}}>{ogData.ogDescription}</Text>
    </View>
  );

  const LinkUrl = (
    <View style={{marginVertical: 10, marginHorizontal: 5}}>
      <Text style={{fontSize: 9, color: '#555'}}>
        {ogData ? (ogData.ogUrl ? ogData.ogUrl : link) : link}
      </Text>
    </View>
  );

  const LinkDetails = (
    <View
      style={{
        justifyContent: 'center',
        padding: 5,
      }}>
      {title && LinkTitle}
      {description && LinkDescription}
      {LinkUrl}
    </View>
  );

  const linkMedia = (
    <View
      style={{
        height: height,
        width: width - 21,
      }}>
      {type == 'image' ? LinkImage : LinkVideo}
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderColor: '#ccc',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
      }}>
      {type && linkMedia}
      {LinkDetails}
    </View>
  );
};

export default memo(LinkPostContent);
