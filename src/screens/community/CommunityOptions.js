import React from 'react';
import {Alert, View} from 'react-native';
import {Button, Icon, useTheme} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getCommunityTitle,
  getUserRoleInCommunity,
  joinCommunity,
  leaveCommunity,
} from '../../redux/reducers/CommunitySlice';
import {navigate} from '../../navigation/Ref';
import CommunityNotifications from './CommunityNotifications';
import {useTranslation} from 'react-i18next';

const CommunityOptions = props => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const {communityId} = props;

  const communityTitle = useSelector(state =>
    getCommunityTitle(state, communityId),
  );
  const userRole = useSelector(state =>
    getUserRoleInCommunity(state, communityId),
  );

  const leaveCommunityAlert = () => {
    Alert.alert(
      t('Leave') + ' ' + communityTitle + ' ?',
      t('Community Leave Confirmation Detail'),
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'default',
          onPress: () => dispatch(leaveCommunity(communityId)),
        },
      ],
      {cancelable: true},
    );
  };

  switch (userRole) {
    case 'banned':
      return <View></View>;
    case 'member':
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CommunityNotifications communityId={communityId} />
          <Button
            title="Joined"
            buttonStyle={{
              height: 30,
              borderWidth: 1,
              borderColor: 'red',
              marginRight: 5,
              borderRadius: 15,
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}
            titleStyle={{color: 'red', fontSize: 11}}
            onPress={() => leaveCommunityAlert()}
          />
        </View>
      );
    case 'admin':
      return (
        <View>
          <Button
            title={t('Settings')}
            containerStyle={{
              marginHorizontal: 10,
            }}
            buttonStyle={{
              borderColor: theme.colors.green,
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}
            icon={
              <Icon
                name="gear"
                type="font-awesome"
                color={theme.colors.green}
                size={13}
                style={{marginRight: 5}}
              />
            }
            titleStyle={{color: theme.colors.green, fontSize: 11}}
            onPress={() => navigate('CommunitySettings')}
          />
          <View style={{height: 15}}></View>
          <Button
            title={t('Grow')}
            buttonStyle={{
              borderWidth: 1,
              borderColor: theme.colors.blue,
              marginHorizontal: 10,
              borderRadius: 15,
              paddingHorizontal: 15,
              paddingVertical: 5,
            }}
            icon={
              <Icon
                name="lightning-bolt"
                type="material-community"
                color={theme.colors.blue}
                size={14}
                style={{marginRight: 5}}
              />
            }
            titleStyle={{color: theme.colors.blue, fontSize: 11}}
            onPress={() =>
              navigate('GrowCommunity', {communityId: communityId})
            }
          />
        </View>
      );

    default:
      return (
        <Button
          title={t('Join')}
          containerStyle={{
            marginHorizontal: 10,
          }}
          buttonStyle={{
            backgroundColor: theme.colors.blue,
            borderRadius: 15,
            paddingHorizontal: 20,
            paddingVertical: 5,
          }}
          titleStyle={{color: theme.colors.primary, fontSize: 12}}
          onPress={() => dispatch(joinCommunity(communityId))}
        />
      );
  }
};

export default CommunityOptions;
