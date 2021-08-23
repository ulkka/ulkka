import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import {Divider, useTheme} from 'react-native-elements';
import communityApi from '../../services/CommunityApi';
import UserAvatar from '../../components/UserAvatar';
import {push} from '../../navigation/Ref';
import FeedFooter from '../../components/Feed/FeedFooter';

const UserRow = memo(({user, communityId}) => {
  const {theme} = useTheme();

  const {displayname, _id: userId} = user;

  const [isBanned, setIsBanned] = useState(user.isBanned);

  const unbanUser = async (communityId, userId) => {
    const response = await communityApi.community
      .unbanUser(communityId, userId)
      .catch(error => {
        console.error('error banning user', error);
      });
    return response.status == 200;
  };

  if (!isBanned) return <View></View>;
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
            color: theme.colors.black4,
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {displayname}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Lift ban of ' + displayname + ' from this community?',
              null,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    const res = unbanUser(communityId, userId);
                    res && setIsBanned(false);
                  },
                },
              ],
              {cancelable: true},
            );
          }}
          style={{
            backgroundColor: theme.colors.blue,
            padding: 5,
            borderRadius: 5,
          }}>
          <Text
            style={{
              paddingHorizontal: 5,
              fontSize: 10,
              color: theme.colors.primary,
              fontWeight: 'bold',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            Lift Ban
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ) : (
    <View></View>
  );
});

export default function BannedMembers(props) {
  const {theme} = useTheme();

  const {communityId} = props.route.params;

  const [metadata, setMetadata] = useState({page: 0, limit: 10, total: -1});
  const [members, setMembers] = useState([]);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBannedCommunityMembers();
  }, []);

  const fetchBannedCommunityMembers = async text => {
    if (!complete && !loading && !error) {
      const {page, limit} = metadata;
      setLoading(true);
      const response = await communityApi.community
        .bannedMembers(communityId, page + 1, limit)
        .catch(error => {
          setError(true);
          console.error('error fetching community members', error);
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
    return <Divider color={theme.colors.grey2} />;
  };

  const handlerRenderItem = ({item}) => {
    return <UserRow user={item} communityId={communityId} />;
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
        backgroundColor: theme.colors.primary,
        paddingTop: 10,
      }}>
      {members?.length || loading ? (
        <FlatList
          listKey="bannedMembers"
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
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          No banned users{'  '}
        </Text>
      )}
    </View>
  );
}
