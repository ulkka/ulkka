import React from 'react';
import {Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getCommunityTitle,
  getUserRoleInCommunity,
  joinCommunity,
  leaveCommunity,
} from '../../redux/reducers/CommunitySlice';
import {navigate} from '../../navigation/Ref';

const CommunityOptions = (props) => {
  const dispatch = useDispatch();
  const {communityId} = props;

  const communityTitle = useSelector((state) =>
    getCommunityTitle(state, communityId),
  );
  const userRole = useSelector((state) =>
    getUserRoleInCommunity(state, communityId),
  );

  const leaveCommunityAlert = () => {
    Alert.alert(
      'Leave ' + communityTitle + ' ?',
      "Posts from this community won't show up in your home feed",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'default',
          onPress: () => dispatch(leaveCommunity(communityId)),
        },
      ],
      {cancelable: true},
    );
  };

  switch (userRole) {
    case 'member':
      return (
        <Button
          raised
          title="Joined"
          containerStyle={{
            borderWidth: 1,
            borderColor: '#ff000055',
            marginHorizontal: 10,
          }}
          buttonStyle={{
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}
          titleStyle={{color: 'red', fontSize: 11}}
          onPress={() => leaveCommunityAlert()}
        />
      );
    case 'admin':
      return (
        <Button
          raised
          title="Settings"
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
          titleStyle={{color: '#02862ad6', fontSize: 11}}
          onPress={() => navigate('CommunitySettings')}
        />
      );

    default:
      return (
        <Button
          raised
          title="Join"
          containerStyle={{
            marginHorizontal: 10,
          }}
          buttonStyle={{
            backgroundColor: '#2a9df4',
            borderRadius: 15,
            paddingHorizontal: 20,
            paddingVertical: 5,
          }}
          titleStyle={{color: '#fff', fontSize: 12}}
          onPress={() => dispatch(joinCommunity(communityId))}
        />
      );
  }
};

export default CommunityOptions;
