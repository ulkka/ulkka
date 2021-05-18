import React, {useEffect, memo} from 'react';
import {View, Text, Platform} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import {Button} from 'react-native-elements';
import {
  fetchTopCommunities,
  getUserNonMemberCommunities,
  joinCommunity,
} from '../redux/reducers/CommunitySlice';
import CommunityAvatar from './CommunityAvatar';
import {kFormatter} from './helpers';

export default memo(function TopCommunities(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTopCommunities());
  }, []);

  const nonMemberCommunities = useSelector(getUserNonMemberCommunities);

  const handlerRenderItem = ({item}) => {
    const {_id: id, name, icon, memberCount} = item;
    return (
      <View
        style={{
          minHeight: 160,
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          //padding: 10,
          width: 125,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 5,
          margin: 7,
          justifyContent: 'space-evenly',
        }}>
        <CommunityAvatar communityId={id} size="medium" />
        <Text
          style={{
            color: '#555',
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {name}
        </Text>
        <Text
          style={{
            color: '#555',
            fontSize: 11,
            //fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {kFormatter(memberCount ? memberCount : 1)}{' '}
          {memberCount == 1 ? 'member' : 'members'}
        </Text>
        <View>
          <Button
            raised
            title="Join"
            buttonStyle={{
              borderRadius: 15,
              backgroundColor: '#2a9df4',
              paddingHorizontal: 25,
              paddingVertical: 2,
            }}
            titleStyle={{color: '#fff', fontSize: 12}}
            onPress={() => dispatch(joinCommunity(id))}
          />
        </View>
      </View>
    );
  };
  const separator = () => <View style={{width: 20}}></View>;
  return nonMemberCommunities.length ? (
    <View style={{paddingVertical: 10, backgroundColor: '#f5f5f5'}}>
      <View style={{paddingHorizontal: 10}}>
        <Text style={{fontWeight: 'bold', color: '#777'}}>
          Suggested for You
        </Text>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        listKey="topCommunities"
        renderItem={handlerRenderItem}
        data={nonMemberCommunities}
        keyExtractor={(item, index) => item._id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        //ItemSeparatorComponent={separator}
      />
    </View>
  ) : (
    <View></View>
  );
});
