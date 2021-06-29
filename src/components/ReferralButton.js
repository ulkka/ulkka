import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import Share from 'react-native-share';

import analytics from '@react-native-firebase/analytics';

const ReferralButton = (props) => {
  const sharePost = async () => {
    const link = 'https://ulkka.page.link/xi6d';
    const options = {
      title: 'Invite Friends to Ulkka',
      url: link,
      message:
        "Invitation to join Ulkka - Kerala's own Social Media!\nഅടിപൊളി മലയാളം കമ്മ്യൂണിറ്റികളുടെ ഭാഗമാകാൻ കേരളത്തിന്റെ സ്വന്തം സോഷ്യൽ മീഡിയയായ Ulkka ഇൻസ്റ്റാൾ ചെയ്യൂ",
    };
    Share.open(options)
      .then((res) => {
        console.log(res);
        analytics().logShare({
          content_type: 'referral-link',
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
        alignItems: 'center',
        paddingRight: 3,
      }}>
      <Icon
        name="envelope-open"
        type="font-awesome"
        size={18}
        color={'#02862a'}
      />
      <Text
        style={{
          color: '#333',
          fontSize: 10,
        }}>
        Invite
      </Text>
    </TouchableOpacity>
  );
};

export default memo(ReferralButton);
