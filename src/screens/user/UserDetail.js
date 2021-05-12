import React, {useEffect, memo} from 'react';
import {View, Text, FlatList} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Posts from './tabs/Posts';
import Comments from './tabs/Comments';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserById} from '../../redux/reducers/UserSlice';
import {getBlockedUsers} from '../../redux/reducers/AuthSlice';
import {Button} from 'react-native-elements';
import {goBack} from '../../navigation/Ref';
import AccountDetail from './AccountDetail';

const Tab = createMaterialTopTabNavigator();

const AccountTabbedNavigation = memo((props) => {
  const {userId} = props;
  return (
    <Tab.Navigator
      animationEnabled={false}
      tabBarOptions={{
        animationEnabled: false,
        activeTintColor: '#444',
        inactiveTintColor: 'grey',
        labelStyle: {
          fontWeight: 'bold',
          fontSize: 13,
        },
      }}>
      <Tab.Screen
        name=" Posts "
        component={Posts}
        initialParams={{userId: userId}}
      />
      <Tab.Screen
        name=" Comments "
        component={Comments}
        initialParams={{userId: userId}}
      />
    </Tab.Navigator>
  );
});

function UserDetail(props) {
  const dispatch = useDispatch();
  const {route} = props;
  const userId = route.params.userId;
  const blockedUsers = useSelector(getBlockedUsers);
  const isUserBlocked = blockedUsers?.includes(userId);
  useEffect(() => {
    if (!isUserBlocked) {
      dispatch(fetchUserById(userId));
    }
  }, []);

  console.log('running userdetail ', userId);

  return isUserBlocked ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#fafafa',
      }}>
      <Text style={{fontWeight: 'bold', fontSize: 20, color: '#555'}}>
        {'  '}
        User not available{'  '}
      </Text>
      <Button
        title="Go Back"
        type="outline"
        raised
        titleStyle={{fontSize: 15, color: '#2a9df4', padding: 4}}
        onPress={() => goBack()}
      />
    </View>
  ) : (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        keyboardShouldPersistTaps="always"
        onEndReachedThreshold={0.9}
        ListHeaderComponent={<AccountDetail userId={userId} />}
        ListFooterComponent={<AccountTabbedNavigation userId={userId} />}
      />
    </View>
  );
}

export default UserDetail;
