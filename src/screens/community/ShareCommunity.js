import React, {memo} from 'react';
import {TouchableOpacity, Platform, View} from 'react-native';
import {Icon, Text, useTheme} from 'react-native-elements';
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

const ShareCommunity = props => {
  const {theme} = useTheme();

  const {
    communityId,
    text,
    flexDirection,
    mode,
    shareTextStyle,
    iconSize,
  } = props;
  const os = Platform.OS;

  const communityTitle = useSelector(state =>
    getCommunityTitle(state, communityId),
  );
  const communityIcon = useSelector(state =>
    getCommunityIcon(state, communityId),
  );
  const communityDescription = useSelector(state =>
    getCommunityDescription(state, communityId),
  );
  const communityMemberCount = useSelector(state =>
    getCommunityMemberCount(state, communityId),
  );

  const type = 'community';

  const platFormIcon =
    os == 'ios' ? (
      <Icon
        name="envelope-open-o"
        type="font-awesome"
        size={iconSize ? iconSize : 20}
        color={theme.colors.green}
      />
    ) : (
      <Icon
        name="envelope-open-o"
        type="font-awesome"
        size={iconSize ? iconSize - 2 : 18}
        color={theme.colors.green}
      />
    );

  async function buildLink(communityId) {
    const socialTitle =
      'Join ' +
      communityTitle +
      " community on Ulkka - Kerala's Own Community!";
    const socialDescription =
      communityMemberCount + ' members\n' + communityDescription;
    const config = {
      link: 'https://ulkka.in/community/' + communityId,
      android: {
        packageName: 'in.ulkka',
        fallbackUrl: 'https://ulkka.in/community/' + communityId,
      },
      ios: {
        bundleId: 'in.ulkka',
        appStoreId: '1563474580',
        fallbackUrl: 'https://ulkka.in/community/' + communityId,
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
      title: 'Invite friends to ' + communityTitle + ' community',
      url: link,
      message:
        'Invitation to join ' +
        communityTitle +
        " community on Ulkka - Kerala's Own Community",
    };
    Share.open(options)
      .then(res => {
        analytics().logShare({
          content_type: type,
          item_id: communityTitle,
          method: res.app,
        });
      })
      .catch(err => {
        err && console.warn(err);
      });
  };
  return (
    <TouchableOpacity
      onPress={sharePost}
      style={{
        flexDirection: flexDirection,
        alignItems: 'center',
        paddingRight: 2,
      }}>
      {platFormIcon}
      <View style={{height: 2}}></View>
      {text && (
        <Text
          style={{
            ...shareTextStyle,
            //...{color: mode == 'light' ? theme.colors.primary : theme.colors.black3},
          }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default memo(ShareCommunity);
