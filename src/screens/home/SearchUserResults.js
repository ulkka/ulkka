import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {getSearchTerm} from '../../redux/reducers/SearchSlice';
import {Icon, Divider} from 'react-native-elements';
import UserAvatar from '../../components/UserAvatar';
import {push, pop} from '../../navigation/Ref';
import userApi from '../../services/UserApi';
import FeedFooter from '../../components/Feed/FeedFooter';
import analytics from '@react-native-firebase/analytics';

const UserRow = ({user}) => {
  const {displayname, _id: userId} = user;
  return displayname ? (
    <TouchableOpacity
      onPress={() => {
        pop();
        push('UserDetail', {userId: userId});
      }}
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

export default memo(function SearchUserResults(props) {
  const term = useSelector(getSearchTerm);

  const [metadata, setMetadata] = useState({page: 0, limit: 10, total: -1});
  const [members, setMembers] = useState([]);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    analytics().logEvent('search', {
      type: 'user',
      value: term,
    });
    searchUsers();
  }, []);

  const searchUsers = async () => {
    if (!complete && !loading && !error) {
      const {page, limit} = metadata;
      setLoading(true);
      const response = await userApi.user
        .search(term, page + 1, limit)
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
      } else {
        setComplete(true);
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
      searchUsers();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
      }}>
      {members?.length || loading ? (
        <FlatList
          listKey="searchusersresult"
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
        complete && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../../assets/failSearchUsers.jpg')}
              width={180}
              height={100}
              style={{borderRadius: 15}}
            />
            <Text
              style={{
                fontWeight: 'bold',
                alignSelf: 'center',
                paddingTop: '10%',
                color: '#555',
                fontSize: 18,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              No users found
            </Text>
          </View>
        )
      )}
    </View>
  );
});
