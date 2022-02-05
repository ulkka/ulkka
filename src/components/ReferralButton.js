import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text, useTheme} from 'react-native-elements';
import Share from 'react-native-share';
import analytics from '@react-native-firebase/analytics';
import {useTranslation} from 'react-i18next';

const ReferralButton = props => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const sharePost = async () => {
    const link = 'https://link.omong.id/BnhH';
    const options = {
      title: 'Invite Friends to Omong',
      url: link,
      message: t('Share Omong Message'),
    };
    Share.open(options)
      .then(res => {
        analytics().logShare({
          content_type: 'referral-link',
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
        alignItems: 'center',
        paddingRight: 3,
      }}>
      <Icon
        name="envelope-open-o"
        type="font-awesome"
        size={18}
        color={theme.colors.green}
      />
      <Text
        style={{
          color: theme.colors.black3,
          fontSize: 10,
          marginTop: 5,
        }}>
        Invite
      </Text>
    </TouchableOpacity>
  );
};

export default memo(ReferralButton);
