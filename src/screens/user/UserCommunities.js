import React from 'react';
import {View, Text, FlatList, Platform, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {
  getUserMemberCommunities,
  getUserModeratorCommunities,
} from '../../redux/reducers/CommunitySlice';
import {Divider} from 'react-native-elements';
import CommunityAvatar from '../../components/CommunityAvatar';
import {push} from '../../navigation/Ref';

const CommunityRow = ({community}) => {
  const {_id: communityId, name: communityName} = community;

  return communityName ? (
    <TouchableOpacity
      onPress={() => push('CommunityNavigation', {communityId: communityId})}
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
      }}>
      <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
        <CommunityAvatar communityId={communityId} size="medium" />
        <Text
          style={{
            padding: 10,
            color: '#444',
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          #{communityName}
        </Text>
      </View>
    </TouchableOpacity>
  ) : (
    <View></View>
  );
};

export default function UserCommunities(props) {
  const {type} = props;
  const communities =
    type == 'following'
      ? useSelector(getUserMemberCommunities)
      : useSelector(getUserModeratorCommunities);
  const separator = () => {
    return <Divider style={{backgroundColor: '#fff', height: 20}} />;
  };

  const handlerRenderItem = ({item}) => {
    return <CommunityRow community={item} />;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
      }}>
      {communities?.length ? (
        <FlatList
          listKey="communities"
          renderItem={handlerRenderItem}
          data={communities}
          keyExtractor={(item, index) => item._id}
          windowSize={15}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ItemSeparatorComponent={separator}
          ListHeaderComponent={separator}
          ListFooterComponent={separator}
        />
      ) : (
        <Text
          style={{
            fontWeight: 'bold',
            alignSelf: 'center',
            paddingTop: '50%',
            color: '#555',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          You are not {type} any communities
        </Text>
      )}
    </View>
  );
}
