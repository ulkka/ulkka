import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import {Icon} from 'react-native-elements';
import YoutubePlayer from 'react-native-youtube-iframe';
import ImagePostContent from './ImagePostContent';
import VideoPostContent from './VideoPostContent';
import {YouTubeStandaloneAndroid} from 'react-native-youtube';
import {useSelector} from 'react-redux';
import {getPostOgData, getPostLink} from '../../redux/selectors/PostSelectors';
import {
  scaleHeightAndWidthAccordingToDimensions,
  getHostnameFromRegex,
} from './helpers';
import {navigateToURL} from '../helpers';

const LinkPostContent = (props) => {
  const {screen, postId} = props;

  const ogData = useSelector((state) => getPostOgData(state, postId));
  const link = useSelector((state) => getPostLink(state, postId));

  const {height, width} = scaleHeightAndWidthAccordingToDimensions(
    ogData,
    'link',
    screen,
  );

  const title = ogData?.ogTitle;
  const description = ogData?.ogDescription;
  const url = ogData?.ogUrl ? ogData.ogUrl : link;
  const videoUrl = ogData?.ogVideo?.url;
  const imageUrl = ogData?.ogImage?.url;
  const type = videoUrl ? 'video' : imageUrl ? 'image' : undefined;

  const domain = getHostnameFromRegex(url)?.replace('www.', '');

  const videoId =
    domain == 'youtube.com'
      ? videoUrl.substring(videoUrl.lastIndexOf('/') + 1, videoUrl.length)
      : null;

  const playYoutubeVideo = (videoId) => {
    YouTubeStandaloneAndroid.playVideo({
      apiKey: 'AIzaSyDfmMGyNCTSqRonVxD5s484jOP8ByT1IP', // Your YouTube Developer API Key
      videoId: videoId, // YouTube video ID
      autoplay: true, // Autoplay the video
      startTime: 0, // Starting point of video (in seconds)
      lightboxMode: true,
    })
      .then(() => console.log('Standalone Player Exited'))
      .catch((errorMessage) => console.error(errorMessage));
  };

  const YTWebView = (
    <YoutubePlayer
      height={height - 10}
      width={width - 10}
      contentScale={1}
      play={false}
      videoId={videoId}
      modestbranding={true}
      onShouldStartLoadWithRequest={false}
      startInLoadingState={true}
      shouldStartLoad={false}
    />
  );

  const YTStandaloneAndroid = (
    <TouchableOpacity onPress={() => playYoutubeVideo(videoId)}>
      <ImageBackground
        source={{uri: imageUrl}}
        style={{
          height: height - 10,
          width: width - 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name="youtube-play"
          type="font-awesome"
          color="#ff0000"
          size={45}
        />
      </ImageBackground>
    </TouchableOpacity>
  );

  const YoutubeVideo =
    Platform.OS != 'android' ? YTWebView : YTStandaloneAndroid;

  const LinkVideo = (
    <View
      style={{
        flex: 1,
        backgroundColor: '#222',
        width: width - 10,
        height: height - 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {domain == 'youtube.com' ? (
        YoutubeVideo
      ) : (
        <VideoPostContent
          {...props}
          ogVideoUrl={videoUrl}
          ogHeight={height - 10}
          ogWidth={width - 10}
          type={'link'}
          ogImageUrl={imageUrl}
        />
      )}
    </View>
  );

  const LinkImage = (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigateToURL(link, 'image')}
      style={{
        backgroundColor: '#222',
        height: height - 10,
        width: width - 10,
      }}>
      <ImagePostContent
        {...props}
        ogImageUrl={imageUrl}
        ogHeight={height - 10}
        ogWidth={width - 10}
        type={'link'}
      />
    </TouchableOpacity>
  );

  const LinkTitle = (
    <View
      style={{
        margin: 5,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 13,
          color: '#333',
        }}
        ellipsizeMode="tail"
        numberOfLines={3}>
        {ogData?.ogTitle}
      </Text>
    </View>
  );

  const LinkDescription = (
    <View style={{marginHorizontal: 5}}>
      <Text
        style={{
          fontSize: 11,
          color: '#444',
          //textAlign: 'left'
        }}
        ellipsizeMode="tail"
        numberOfLines={3}>
        {ogData?.ogDescription}
      </Text>
    </View>
  );

  const LinkUrl = (
    <View style={{marginVertical: 10, marginHorizontal: 5}}>
      <Text
        style={{fontSize: 9, color: '#555', maxWidth: '70%'}}
        ellipsizeMode="tail"
        numberOfLines={1}>
        {link}
      </Text>
    </View>
  );

  const LinkDetails = (
    <View
      style={{
        padding: 5,
        alignItems: 'flex-start',
        marginBottom: 5,
      }}>
      {title && LinkTitle}
      {description && LinkDescription}
      {LinkUrl}
    </View>
  );

  const linkMedia = (
    <View
      style={{
        height: height - 10,
        width: width - 10,
        alignSelf: 'center',
        alignItems: 'center',
      }}>
      {type && type == 'image' ? LinkImage : LinkVideo}
    </View>
  );

  const openLink = (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 20, left: 10, right: 10}}
      onPress={() => navigateToURL(link, 'openLinkIcon')}
      style={{
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#fff',
        padding: 3,
        paddingLeft: 5,
        opacity: 0.7,
        borderRadius: 7,
      }}>
      <Icon type="font-awesome" name="external-link" size={18} color="#444" />
    </TouchableOpacity>
  );
  return (
    <View
      style={{
        width: '100%',
        minHeight: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderColor: '#eee',
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 7,
      }}>
      {type && linkMedia}
      {LinkDetails}
      {openLink}
    </View>
  );
};

export default memo(LinkPostContent);
