import React, {memo} from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useSelector} from 'react-redux';
import {
  getPostTitle,
  getPostDescription,
  getPostMediaMetadata,
  getPostType,
} from '../../redux/selectors/PostSelectors';

const SharePost = (props) => {
  const {postId} = props;
  const os = Platform.OS;

  const title = useSelector((state) => getPostTitle(state, postId));
  const description = useSelector((state) => getPostDescription(state, postId));
  const mediaMetadata = useSelector((state) =>
    getPostMediaMetadata(state, postId),
  );
  const type = useSelector((state) => getPostType(state, postId));

  const platFormIcon =
    os == 'ios' ? (
      <Icon name="share-outline" type="ionicon" size={19} color="#888" />
    ) : (
      <Icon name="share" type="font-awesome" size={18} color="#888" />
    );

  async function buildLink(postId) {
    const mediaUrl = mediaMetadata?.secure_url;

    const link = await dynamicLinks().buildShortLink(
      {
        link: 'https://vellarikkapattanam.com/post/' + postId,
        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: 'https://vellarikkapattanam.page.link',
        // optional setup which updates Firebase analytics campaign
        // "banner". This also needs setting up before hand
        analytics: {
          campaign: 'banner',
        },
        social: {
          title: title,
          descriptionText: description,
          imageUrl:
            type == 'video'
              ? mediaUrl.substring(0, mediaUrl.lastIndexOf('.')) + '.jpg'
              : mediaUrl,
        },
      },
      dynamicLinks.ShortLinkType.UNGUESSABLE,
    );

    return link;
  }

  const sharePost = async () => {
    const postDescription = description ? description : '';
    const message = title + '\n' + postDescription;
    console.log('sharing with image media ', mediaMetadata);
    const link = await buildLink(postId);
    const options = {
      title: 'Share',
      message: message,
      subject: title,
      url: link,
    };
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
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
          color: '#777',
        }}>
        Share
      </Text>
    </TouchableOpacity>
  );
};

export default memo(SharePost);
