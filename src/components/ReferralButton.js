import React, {memo, useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text, ThemeContext} from 'react-native-elements';
import Share from 'react-native-share';

import analytics from '@react-native-firebase/analytics';

const ReferralButton = props => {
  const {theme} = useContext(ThemeContext);

  const sharePost = async () => {
    const link = 'https://ulkka.page.link/xi6d';
    const options = {
      title: 'Invite Friends to Ulkka',
      url: link,
      message:
        "Invitation to join Ulkka - Kerala's own Social Media!\nഅടിപൊളി മലയാളം കമ്മ്യൂണിറ്റികളുടെ ഭാഗമാകാൻ കേരളത്തിന്റെ സ്വന്തം സോഷ്യൽ മീഡിയയായ Ulkka ഇൻസ്റ്റാൾ ചെയ്യൂ",
    };
    Share.open(options)
      .then(res => {
        analytics().logShare({
          content_type: 'referral-link',
          method: res.app,
        });
      })
      .catch(err => {
        err && console.error(err);
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
        }}>
        Invite
      </Text>
    </TouchableOpacity>
  );
};

export default memo(ReferralButton);
