import React, {useState, useEffect} from 'react';
import {View, Alert} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getUserDisplayname} from '../../redux/reducers/UserSlice';
import SearchableDropdown from '../../components/SearchableDropdown';
import communityApi from '../../services/CommunityApi';
import Snackbar from 'react-native-snackbar';

export default function InviteUserToCommunity(props) {
  const {userId} = props;
  const [
    selectCommunityModalVisible,
    setSelectCommunityModalVisible,
  ] = useState(false);

  const [community, setCommunity] = useState();

  const userDisplayname = useSelector((state) =>
    getUserDisplayname(state, userId),
  );

  useEffect(() => {
    if (community) {
      inviteHandler();
    }
  }, [community]);

  const inviteHandler = async () => {
    Alert.alert(
      'Invite ' + userDisplayname + ' to ' + community.name + '?',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => inviteUser(),
        },
      ],
      {cancelable: true},
    );
  };

  const inviteUser = async () => {
    const response = await communityApi.community
      .inviteUser(community._id, userId)
      .catch((error) => console.log('error inviting user to community', error));
    Snackbar.show({
      text: userDisplayname + ' invited to ' + community.name,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  return (
    <View>
      <Button
        raised
        title="Invite to Community"
        containerStyle={{
          borderWidth: 1,
          borderColor: '#02862ad6',
          marginHorizontal: 10,
        }}
        buttonStyle={{
          borderRadius: 15,
          paddingHorizontal: 15,
          paddingVertical: 5,
        }}
        icon={
          <Icon
            name="envelope-o"
            type="font-awesome"
            size={13}
            color="#02862ad6"
            style={{marginRight: 10}}
          />
        }
        titleStyle={{color: '#02862ad6', fontSize: 11}}
        onPress={() => setSelectCommunityModalVisible(true)}
      />
      <SearchableDropdown
        selectCommunityModalVisible={selectCommunityModalVisible}
        setSelectCommunityModalVisible={setSelectCommunityModalVisible}
        setCommunity={setCommunity}
        allowOnlyModeratorCommunities={true}
      />
    </View>
  );
}
