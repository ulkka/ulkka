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
  const {
    communityId,
    text,
    flexDirection,
    mode,
    shareTextStyle,
    iconSize,
  } = props;
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

  const type = 'community';

  const platFormIcon =
    os == 'ios' ? (
      <Icon
        name="ios-share"
        size={iconSize ? iconSize : 20}
        color={mode == 'light' ? '#fff' : '#666'}
      />
    ) : (
      <Icon
        name="share"
        type="font-awesome"
        size={iconSize ? iconSize - 2 : 18}
        color={mode == 'light' ? '#fff' : '#666'}
      />
    );

  async function buildLink(communityId) {
    const socialTitle =
      'Join ' + communityTitle + " community on Ulkka - God's Own Community!";
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
      message:
        'Invitation to join ' +
        communityTitle +
        ' community on Ulkka !\nഅടിപൊളി മലയാളം കമ്മ്യൂണിറ്റികളുടെ ഭാഗമാകാൻ കേരളത്തിന്റെ സ്വന്തം സോഷ്യൽ മീഡിയയായ Ulkka ഇൻസ്റ്റാൾ ചെയ്യൂ',
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
    <TouchableOpacity
      onPress={sharePost}
      style={{
        flexDirection: flexDirection,
        alignItems: 'center',
      }}>
      {platFormIcon}
      {text && (
        <Text
          style={{
            ...shareTextStyle,
            ...{color: mode == 'light' ? '#fff' : '#555'},
          }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default memo(ShareCommunity);
