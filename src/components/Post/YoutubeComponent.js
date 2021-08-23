import React, {memo} from 'react';
import {ImageBackground, Platform, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-elements';
import YouTube, {YouTubeStandaloneAndroid} from 'react-native-youtube';
import {Icon} from 'react-native-elements';

const youtubeApiKeyAndroid = 'AIzaSyBNeBs2j1bztyv1MNSw6ri2Nq798P2zNH8';
const youtubeApiKeyiOS = 'AIzaSyANFC95iCrpKClkzIFJq0hQvsZml4qT_es';

function YoutubeComponent(props) {
  const {theme} = useTheme();

  const {videoId, height, width, imageUrl} = props;
  const playYoutubeVideo = () => {
    YouTubeStandaloneAndroid.playVideo({
      apiKey: youtubeApiKeyAndroid, // Your YouTube Developer API Key
      videoId: videoId, // YouTube video ID
      autoplay: true, // Autoplay the video
      startTime: 0, // Starting point of video (in seconds)
      lightboxMode: true,
    }).catch(errorMessage => console.error(errorMessage));
  };

  const YTiOS = (
    <YouTube
      apiKey={youtubeApiKeyiOS}
      videoId={videoId} // The YouTube video ID
      style={{width: width - 10, height: height - 10}}
    />
  );

  const YTStandaloneAndroid = (
    <TouchableOpacity onPress={() => playYoutubeVideo()}>
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

  return Platform.OS != 'android' ? YTiOS : YTStandaloneAndroid;
}

export default memo(YoutubeComponent);
