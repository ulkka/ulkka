import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Platform, FlatList} from 'react-native';
import {Icon, Divider} from 'react-native-elements';
import communityApi from '../../services/CommunityApi';
import UserAvatar from '../../components/UserAvatar';
import {push} from '../../navigation/Ref';
import FeedFooter from '../../components/Feed/FeedFooter';

const UserRow = ({user}) => {
  const {displayname, _id: userId} = user;
  return displayname ? (
    <TouchableOpacity
      onPress={() => push('UserDetail', {userId: userId})}
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <UserAvatar seed={displayname} size={'large'} />
        <Text
          style={{
            padding: 10,
            color: '#444',
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {displayname}
        </Text>
      </View>
      <View>
        <Icon name="arrow-right" type="font-awesome" size={16} color="#555" />
      </View>
    </TouchableOpacity>
  ) : (
    <View></View>
  );
};

export default function CommunityMembers(props) {
  const {communityId} = props.route.params;

  const [metadata, setMetadata] = useState({page: 0, limit: 10, total: -1});
  const [members, setMembers] = useState([]);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCommunityMembers();
  }, []);

  const fetchCommunityMembers = async () => {
    if (!complete && !loading && !error) {
      const {page, limit} = metadata;
      setLoading(true);
      const response = await communityApi.community
        .fetchMembers(communityId, page + 1, limit)
        .catch((error) => {
          setError(true);
          console.log('error fetching community members', error);
        });
      const memberList = response?.data?.data;
      if (memberList?.length) {
        setMembers([...members, ...memberList]);

        const mdata = response?.data?.metadata[0];
        setMetadata(mdata);

        const {page, limit, total} = mdata;
        if (page * limit >= total) {
          setComplete(true);
        }
      }
      setLoading(false);
    }
  };

  const separator = () => {
    return <Divider style={{backgroundColor: '#fff', height: 5}} />;
  };

  const handlerRenderItem = ({item}) => {
    return <UserRow user={item} />;
  };

  const handleLoadMore = () => {
    if (!complete && !loading && !error) {
      fetchCommunityMembers();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
      }}>
      {members?.length || loading ? (
        <FlatList
          listKey="blockedUsers"
          renderItem={handlerRenderItem}
          data={members}
          keyExtractor={(item, index) => item + index}
          windowSize={15}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ItemSeparatorComponent={separator}
          ListFooterComponent={() => (
            <FeedFooter complete={complete} loading={loading} text={' '} />
          )}
        />
      ) : (
        <Text
          style={{
            fontWeight: 'bold',
            alignSelf: 'center',
            paddingTop: '50%',
            color: '#555',
          }}>
          No members yet{'  '}
        </Text>
      )}
    </View>
  );
}
