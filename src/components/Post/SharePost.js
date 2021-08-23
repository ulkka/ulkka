import React, {memo} from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import {Icon, Text, useTheme} from 'react-native-elements';
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useSelector} from 'react-redux';
import {
  getPostTitle,
  getPostDescription,
  getPostMediaMetadata,
  getPostType,
  getPostOgData,
  getPostCommentCount,
  getPostVoteCount,
  getPostAuthorDisplayname,
  getPostCommunityName,
} from '../../redux/selectors/PostSelectors';
import {mediaUrlWithWidth} from './helpers';
import analytics from '@react-native-firebase/analytics';

function getShareOGImageUrl(type, mediaUrl, ogData) {
  switch (type) {
    case 'video':
      return mediaUrl.substring(0, mediaUrl.lastIndexOf('.')) + '.jpg';
    case 'image':
      return mediaUrlWithWidth(mediaUrl);
    case 'gif':
      return mediaUrlWithWidth(mediaUrl).split('.gif')[0] + '.png';
    case 'link':
      return ogData?.ogImage?.url;
  }
}

const SharePost = props => {
  const {theme} = useTheme();

  const {postId} = props;
  const os = Platform.OS;

  const title = useSelector(state => getPostTitle(state, postId));
  const description = useSelector(state => getPostDescription(state, postId));
  const mediaMetadata = useSelector(state =>
    getPostMediaMetadata(state, postId),
  );
  const ogData = useSelector(state => getPostOgData(state, postId));
  const type = useSelector(state => getPostType(state, postId));
  const voteCount = useSelector(state => getPostVoteCount(state, postId));
  const commentCount = useSelector(state => getPostCommentCount(state, postId));
  const postAuthorDisplayname = useSelector(state =>
    getPostAuthorDisplayname(state, postId),
  );

  const postCommunityName = useSelector(state =>
    getPostCommunityName(state, postId),
  );

  const shareTitle = title.substring(0, 150);

  const platFormIcon =
    os == 'ios' ? (
      <Icon name="share-outline" type="ionicon" size={19} color="#888" />
    ) : (
      <Icon name="share" type="font-awesome" size={18} color="#888" />
    );

  async function buildLink(postId) {
    const mediaUrl = mediaMetadata?.secure_url;

    const socialTitle =
      'Posted by ' +
      postAuthorDisplayname +
      ' on ' +
      postCommunityName +
      ': "' +
      shareTitle +
      '"';
    const socialDescription =
      "Ulkka - Kerala's Own Community!\n" +
      voteCount +
      ' votes, ' +
      commentCount +
      ' comments - ' +
      socialTitle;

    const config = {
      link: 'https://ulkka.in/post/' + postId,
      android: {
        packageName: 'in.ulkka',
      },
      ios: {
        bundleId: 'in.ulkka',
        appStoreId: '1563474580',
      },
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://link.ulkka.in',
      // optional setup which updates Firebase analytics campaign
      analytics: {
        source: Platform.OS == 'ios' ? 'ulkka_ios' : 'ulkka_android',
        medium: 'organic_social',
        campaign: 'share',
        content: type,
      },
      social: {
        title: socialTitle,
        descriptionText: socialDescription,
        imageUrl: getShareOGImageUrl(type, mediaUrl, ogData),
      },
    };
    const link = await dynamicLinks().buildShortLink(
      config,
      dynamicLinks.ShortLinkType.SHORT,
    );

    return link;
  }

  const sharePost = async () => {
    const postDescription = description ? description : '';
    const message = title + '\n' + postDescription;
    const link = await buildLink(postId);
    const options = {
      title: 'Share this Post',
      message: message,
      subject: shareTitle,
      url: link,
    };
    Share.open(options)
      .then(res => {
        analytics().logShare({
          content_type: type,
          item_id: postId,
          method: res.app,
        });
      })
      .catch(err => {
        err && console.error(err);
      });
  };
  return (
    <TouchableOpacity
      style={{flex: 3, flexDirection: 'row'}}
      onPress={sharePost}>
      {platFormIcon}
      <Text
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          paddingLeft: os == 'ios' ? 8 : 12,
          paddingTop: os == 'ios' ? 4 : 0,
          color: theme.colors.black6,
        }}>
        Share
      </Text>
    </TouchableOpacity>
  );
};

export default memo(SharePost);
