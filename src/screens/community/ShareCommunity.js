import React, {memo} from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import Share from 'react-native-share';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useSelector} from 'react-redux';
import {
  getCommunityTitle,
  getCommunityMemberCount,
  getCommunityDescription,
  getCommunityIcon,
} from '../../redux/reducers/CommunitySlice';
import analytics from '@react-native-firebase/analytics';

const ShareCommunity = (props) => {
  const {communityId} = props;
  const os = Platform.OS;

  const communityTitle = useSelector((state) =>
    getCommunityTitle(state, communityId),
  );
  const communityIcon = useSelector((state) =>
    getCommunityIcon(state, communityId),
  );
  const communityDescription = useSelector((state) =>
    getCommunityDescription(state, communityId),
  );
  const communityMemberCount = useSelector((state) =>
    getCommunityMemberCount(state, communityId),
  );

  const shareTitle = communityTitle;
  const type = 'community';

  const platFormIcon =
    os == 'ios' ? (
      <Icon name="share-outline" type="ionicon" size={19} color="#666" />
    ) : (
      <Icon name="share" type="font-awesome" size={18} color="#666" />
    );

  async function buildLink(communityId) {
    const socialTitle = 'Join the ' + communityTitle + ' community on Ulkka !';
    const socialDescription =
      communityMemberCount + ' members\n' + communityDescription;
    const config = {
      link: 'https://ulkka.in/community/' + communityId,
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
        ...(communityIcon && {imageUrl: communityIcon}),
      },
    };
    const link = await dynamicLinks().buildShortLink(
      config,
      dynamicLinks.ShortLinkType.SHORT,
    );

    return link;
  }

  const sharePost = async () => {
    const link = await buildLink(communityId);
    const options = {
      title: 'Share',
      url: link,
    };
    Share.open(options)
      .then((res) => {
        console.log(res);
        analytics().logShare({
          content_type: type,
          item_id: communityTitle,
          method: res.app,
        });
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  return (
    <TouchableOpacity style={{paddingRight: 10}} onPress={sharePost}>
      {platFormIcon}
    </TouchableOpacity>
  );
};

export default memo(ShareCommunity);
