import React, {useEffect, useContext} from 'react';
import {View, Text, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  getUserDisplayname,
  fetchUserById,
  unblockUser,
} from '../../redux/reducers/UserSlice';
import {getBlockedUsers} from '../../redux/reducers/AuthSlice';
import {Button, Divider, ThemeContext} from 'react-native-elements';
import UserAvatar from '../../components/UserAvatar';

const UserRow = ({userId}) => {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();
  const userDisplayname = useSelector(state =>
    getUserDisplayname(state, userId),
  );

  useEffect(() => {
    if (userDisplayname === undefined) {
      dispatch(fetchUserById(userId));
    }
  }, [userDisplayname]);

  return userDisplayname ? (
    <View
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
      }}>
      <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
        <UserAvatar seed={userDisplayname} size={'large'} />
        <Text
          style={{padding: 10, color: theme.colors.black4, fontWeight: 'bold'}}>
          {userDisplayname}
          {'     '}
        </Text>
      </View>
      <View>
        <Button
          title="Unblock"
          titleStyle={{
            fontSize: 13,
            color: theme.colors.blue,
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

export default function BlockedUsers() {
  const {theme} = useContext(ThemeContext);

  const blockedUsers = useSelector(getBlockedUsers);

  const separator = () => {
    return (
      <Divider style={{backgroundColor: theme.colors.primary, height: 5}} />
    );
  };

  const handlerRenderItem = ({item}) => {
    return <UserRow userId={item} />;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
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
            color: theme.colors.black5,
          }}>
          No blocked users{'  '}
        </Text>
      )}
    </View>
  );
}
