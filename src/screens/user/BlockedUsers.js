import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  getUserBlockedUsers,
  getUserDisplayname,
  fetchUserById,
  unblockUser,
} from '../../redux/reducers/UserSlice';
import {Button, Divider} from 'react-native-elements';
import UserAvatar from '../../components/UserAvatar';

const UserRow = ({userId}) => {
  const dispatch = useDispatch();
  console.log('userid in userrow', userId);
  const userDisplayname = useSelector((state) =>
    getUserDisplayname(state, userId),
  );
  console.log('userdispalyname', userDisplayname);
  if (userDisplayname === undefined) {
    dispatch(fetchUserById(userId));
  }
  return userDisplayname ? (
    <View
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
      }}>
      <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
        <UserAvatar seed={userDisplayname} size={'large'} />
        <Text style={{padding: 10, color: '#444', fontWeight: 'bold'}}>
          {userDisplayname}
          {'     '}
        </Text>
      </View>
      <View>
        <Button
          title="Unblock"
          titleStyle={{
            fontSize: 13,
            color: '#2a9df4',
            padding: 15,
            fontWeight: '600',
          }}
          onPress={() => dispatch(unblockUser(userId))}
        />
      </View>
    </View>
  ) : (
    <View></View>
  );
};

export default function BlockedUsers(props) {
  const {userId} = props.route.params;
  const blockedUsers = useSelector((state) =>
    getUserBlockedUsers(state, userId),
  );
  console.log('blocked users in blockedusers', blockedUsers);

  const separator = () => {
    return <Divider style={{backgroundColor: '#fff', height: 5}} />;
  };

  const handlerRenderItem = ({item}) => {
    return <UserRow userId={item} />;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
      }}>
      {blockedUsers?.length ? (
        <FlatList
          listKey="blockedUsers"
          renderItem={handlerRenderItem}
          data={blockedUsers}
          keyExtractor={(item, index) => item + index}
          windowSize={15}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ItemSeparatorComponent={separator}
        />
      ) : (
        <Text
          style={{
            fontWeight: 'bold',
            alignSelf: 'center',
            paddingTop: '50%',
          }}>
          No blocked users{'  '}
        </Text>
      )}
    </View>
  );
}
