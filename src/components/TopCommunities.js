import React, {useEffect, useState, memo} from 'react';
import {View, Text, Platform, Image} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import {Button, useTheme} from 'react-native-elements';
import {
  fetchTopCommunities,
  getUserNonMemberCommunities,
  joinCommunity,
} from '../redux/reducers/CommunitySlice';
import CommunityAvatar from './CommunityAvatar';
import {kFormatter} from './helpers';

export default memo(function TopCommunities(props) {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const [metadata, setMetadata] = useState({page: 0, limit: 10, total: -1});
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    handleFetchTopCommunities();
  }, []);

  const handleFetchTopCommunities = async () => {
    if (!complete && !loading && !error) {
      const {page, limit} = metadata;
      setLoading(true);
      const response = await dispatch(
        fetchTopCommunities({page: page + 1, limit}),
      ).catch(error => {
        setError(true);
        console.error('error fetching top communities ', error);
      });
      const topCommunitiesList = response?.payload?.data?.data;
      if (topCommunitiesList?.length) {
        const mdata = response?.payload?.data?.metadata[0];
        setMetadata(mdata);

        const {page, limit, total} = mdata;
        if (page * limit >= total) {
          setComplete(true);
        }
      }
      setLoading(false);
    }
  };

  const nonMemberCommunities = useSelector(getUserNonMemberCommunities);

  const handlerRenderItem = ({item}) => {
    const {_id: id, name, icon, memberCount} = item;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          padding: 10,
          width: 125,
          borderWidth: 1,
          borderColor: theme.colors.grey3,
          borderRadius: 5,
          margin: 7,
          justifyContent: 'space-evenly',
        }}>
        <CommunityAvatar communityId={id} size="medium" />
        <View style={{height: 15}}></View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: theme.colors.black5,
            fontWeight: 'bold',
            textAlign: 'center',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {name}
        </Text>
        <View style={{height: 8}}></View>
        <Text
          style={{
            color: theme.colors.black5,
            fontSize: 11,
            //fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {kFormatter(memberCount ? memberCount : 1)}{' '}
          {memberCount == 1 ? 'member' : 'members'}
        </Text>
        <View style={{height: 10}}></View>
        <View>
          <Button
            title="Join"
            buttonStyle={{
              borderRadius: 15,
              backgroundColor: theme.colors.blue,
              paddingHorizontal: 25,
              paddingVertical: 2,
            }}
            titleStyle={{color: theme.colors.primary, fontSize: 12}}
            onPress={() => dispatch(joinCommunity(id))}
          />
        </View>
      </View>
    );
  };
  const separator = () => <View style={{width: 20}}></View>;

  const footer = () =>
    loading ? (
      <View
        style={{
          flex: 1,
          width: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/loading.gif')}
          style={{height: 40, width: 40}}
        />
      </View>
    ) : (
      <View />
    );

  return nonMemberCommunities.length ? (
    <View
      style={{
        paddingVertical: 10,
        backgroundColor: 'rgba(52, 52, 52, 0.05)',
        justifyContent: 'space-evenly',
      }}>
      <View style={{paddingHorizontal: 10}}>
        <Text style={{fontWeight: 'bold', color: theme.colors.black6}}>
          Top Communities
        </Text>
      </View>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          listKey="topCommunities"
          renderItem={handlerRenderItem}
          data={nonMemberCommunities}
          keyExtractor={(item, index) => item._id}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReached={handleFetchTopCommunities}
          onEndReachedThreshold={0.5}
          ListFooterComponent={footer}
          //ItemSeparatorComponent={separator}
        />
      </View>
    </View>
  ) : (
    <View></View>
  );
});
