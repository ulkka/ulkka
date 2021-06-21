import React, {memo} from 'react';
import {View, Text, FlatList, Platform, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {getUserMemberCommunities} from '../../../redux/reducers/CommunitySlice';
import {Divider, Button, Icon} from 'react-native-elements';
import CommunityAvatar from '../../../components/CommunityAvatar';
import {push, navigate} from '../../../navigation/Ref';
import TopCommunities from '../../../components/TopCommunities';

const CommunityRow = memo(({community}) => {
  const {_id: communityId, name: communityName, role} = community;

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
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <CommunityAvatar communityId={communityId} size="medium" />
        <Text
          style={{
            padding: 10,
            color: '#444',
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {communityName}
        </Text>
        {role == 'admin' && (
          <Icon
            raised={false}
            name="shield"
            type="font-awesome"
            size={20}
            style={{
              ...(Platform.OS == 'ios' && {paddingTop: 5, paddingLeft: 10}),
            }}
            color="#02862acc"
          />
        )}
      </View>
    </TouchableOpacity>
  ) : (
    <View></View>
  );
});

export default memo(function UserCommunities(props) {
  const {type} = props;
  const memberCommunities = useSelector(getUserMemberCommunities);

  const separator = () => {
    return <Divider style={{backgroundColor: '#fff', height: 20}} />;
  };

  const handlerRenderItem = ({item, index}) => {
    return <CommunityRow community={item} />;
  };

  const listHeader = (
    <View style={{paddingVertical: 10}}>
      <View style={{paddingHorizontal: 20, paddingBottom: 15}}>
        <Button
          raised
          title="Create Community"
          buttonStyle={{
            borderRadius: 15,
            backgroundColor: '#2a9df4',
            paddingVertical: 7,
            alignItems: 'center',
          }}
          titleStyle={{
            paddingLeft: 10,
            color: '#fff',
            fontSize: 14,
            ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
          }}
          icon={<Icon name="plus" size={17} color="#fff" type="font-awesome" />}
          onPress={() => navigate('Create Community')}
        />
      </View>
      <TopCommunities />
    </View>
  );

  const sortComparer = (a, b) =>
    b.role == 'admin'
      ? a.role == 'admin'
        ? a.name > b.name
          ? 1
          : -1
        : 1
      : a.role == 'admin'
      ? -1
      : a.name > b.name
      ? 1
      : -1;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
      }}>
      <FlatList
        listKey="communities"
        renderItem={handlerRenderItem}
        data={memberCommunities.sort(sortComparer)}
        keyExtractor={(item, index) => item._id}
        windowSize={15}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        ItemSeparatorComponent={separator}
        ListHeaderComponent={listHeader}
        ListFooterComponent={separator}
      />
    </View>
  );
});
