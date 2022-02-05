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
import {useTranslation} from 'react-i18next';

const ShareCommunity = props => {
  const {theme} = useTheme();
  const {t} = useTranslation();

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
        reverse
        reverseColor={'#eee'}
        containerStyle={{
          margin: 0,
        }}
        name="share-outline"
        type="ionicon"
        size={iconSize ? iconSize : 12}
        color={'#444'}
      />
    ) : (
      <Icon
        reverse
        reverseColor={'#eee'}
        containerStyle={{
          margin: 0,
        }}
        name="envelope-open-o"
        type="font-awesome"
        size={iconSize ? iconSize - 2 : 18}
        color={'#444'}
      />
    );

  async function buildLink(communityId) {
    const socialTitle =
      t('Share Community Message1') +
      ' ' +
      communityTitle +
      ' ' +
      t('Share Community Message2');
    const socialDescription =
      communityMemberCount + ' members\n' + communityDescription;
    const config = {
      link: 'https://omong.id/community/' + communityId,
      android: {
        packageName: 'id.omong',
        fallbackUrl: 'https://omong.id/community/' + communityId,
      },
      ios: {
        bundleId: 'id.omong',
        appStoreId: '1601976921',
        fallbackUrl: 'https://omong.id/community/' + communityId,
      },
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://link.omong.id',
      // optional setup which updates Firebase analytics campaign
      analytics: {
        source: Platform.OS == 'ios' ? 'omong_ios' : 'omong_android',
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
        t('Share Community Message1') +
        ' ' +
        communityTitle +
        ' ' +
        t('Share Community Message2'),
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
      {/* <View style={{height: 2}}></View> */}
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
