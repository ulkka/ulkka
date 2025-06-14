import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import ImagePostContent from './ImagePostContent';
import VideoPostContent from './VideoPostContent';
import {useSelector} from 'react-redux';
import {getPostOgData, getPostLink} from '../../redux/selectors/PostSelectors';
import {
  scaleHeightAndWidthAccordingToDimensions,
  getHostnameFromRegex,
} from './helpers';
import {navigateToURL} from '../helpers';
import YoutubeComponent from './YoutubeComponent';

const LinkPostContent = props => {
  const {theme} = useTheme();
  const {screen, postId} = props;

  const ogData = useSelector(state => getPostOgData(state, postId));
  const link = useSelector(state => getPostLink(state, postId));

  const title = ogData?.ogTitle;
  const description = ogData?.ogDescription;
  const url = ogData?.ogUrl ? ogData.ogUrl : link;
  const videoUrl = ogData?.ogVideo?.url;
  const imageUrl = ogData?.ogImage?.url;
  const domain = getHostnameFromRegex(url)?.replace('www.', '');
  const type = videoUrl ? 'video' : imageUrl ? 'image' : undefined;

  const {height, width} =
    type == 'video'
      ? scaleHeightAndWidthAccordingToDimensions(ogData, 'link', screen)
      : {
          height: 120,
          width: 120,
        };

  const videoId = domain == 'youtube.com' && url.split('=')[1];

  const LinkVideo = (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.black2,
        width: width - 10,
        height: height - 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {domain == 'youtube.com' ? (
        <YoutubeComponent
          videoId={videoId}
          height={height}
          width={width}
          imageUrl={imageUrl}
        />
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

  const linkImageBorderRadius = 15;
  const LinkImage = (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigateToURL(link, 'image')}
      style={{
        marginRight: 5,
        backgroundColor: theme.colors.black2,
        borderRadius: linkImageBorderRadius,
      }}>
      <ImagePostContent
        {...props}
        ogImageUrl={imageUrl}
        ogHeight={height - 10}
        ogWidth={width - 10}
        type={'link'}
        resizeMode="cover"
        borderRadius={linkImageBorderRadius}
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
          color: theme.colors.black3,
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
          color: theme.colors.black4,
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
        style={{fontSize: 9, color: theme.colors.black5, maxWidth: '70%'}}
        ellipsizeMode="tail"
        numberOfLines={1}>
        {link}
      </Text>
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

  const LinkDetails = (
    <TouchableOpacity
      onPress={() => navigateToURL(link, 'openLinkIcon')}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 2,
          padding: 5,
          alignItems: 'flex-start',
          marginBottom: 5,
        }}>
        {title && LinkTitle}
        {description && LinkDescription}
        {LinkUrl}
      </View>
      {type == 'image' && <View style={{flex: 1}}>{linkMedia}</View>}
    </TouchableOpacity>
  );

  const openLink = (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 20, left: 10, right: 10}}
      onPress={() => navigateToURL(link, 'openLinkIcon')}
      style={{
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: theme.colors.primary,
        padding: 3,
        paddingLeft: 5,
        opacity: 0.7,
        borderRadius: 7,
      }}>
      <Icon
        type="font-awesome"
        name="external-link"
        size={18}
        color={theme.colors.black4}
      />
    </TouchableOpacity>
  );
  return (
    <View
      style={{
        width: '100%',
        minHeight: 40,
        backgroundColor: theme.colors.grey0,
        justifyContent: 'center',
        borderColor: theme.colors.grey2,
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 7,
      }}>
      {type == 'video' && linkMedia}
      {LinkDetails}
      {openLink}
    </View>
  );
};

export default memo(LinkPostContent);
