import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import {Divider, SearchBar, useTheme} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import communityApi from '../../services/CommunityApi';
import {
  addAdmin,
  getIsUserAdminOfCommunity,
} from '../../redux/reducers/CommunitySlice';
import UserAvatar from '../../components/UserAvatar';
import {push} from '../../navigation/Ref';
import FeedFooter from '../../components/Feed/FeedFooter';

const UserRow = memo(({user, communityId}) => {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const {displayname, _id: userId} = user;
  const isAdmin = useSelector(state =>
    getIsUserAdminOfCommunity(state, communityId, userId),
  );
  const [isBanned, setIsBanned] = useState(user.isBanned);

  const makeAdmin = async (communityId, user) => {
    dispatch(addAdmin({communityId, user}));
  };

  const banUser = async (communityId, userId) => {
    const response = await communityApi.community
      .banUser(communityId, userId)
      .catch(error => {
        console.error('error banning user', error);
      });

    return response.status == 200;
  };

  if (isBanned) return <View></View>;

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
        {!isAdmin && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Make ' + displayname + ' an admin of this community?',
                'Admins can add/remove users and other admins, remove posts/comments from this community',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: async () => {
                      const res = await makeAdmin(communityId, user);
                      res && setIsAdmin(res);
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
            <Text style={{fontSize: 10, color: theme.colors.primary}}>
              Make Admin
            </Text>
          </TouchableOpacity>
        )}
        <View style={{width: 15}}></View>
        {!isAdmin && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Ban ' + displayname + ' from this community?',
                'Banned users cannot join, post or comment on this community.',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      const res = banUser(communityId, userId);
                      res && setIsBanned(true);
                    },
                  },
                ],
                {cancelable: true},
              );
            }}
            style={{
              backgroundColor: 'red',
              padding: 5,
              borderRadius: 5,
            }}>
            <Text style={{fontSize: 10, color: theme.colors.primary}}>
              Ban User
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  ) : (
    <View></View>
  );
});

export default function CommunityMembers(props) {
  const {theme} = useTheme();

  const {communityId} = props.route.params;

  const [metadata, setMetadata] = useState({page: 0, limit: 10, total: -1});
  const [members, setMembers] = useState([]);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommunityMembers(searchTerm);
  }, [searchTerm]);

  const fetchCommunityMembers = async text => {
    if (!complete && !loading && !error) {
      const {page, limit} = metadata;
      setLoading(true);
      const response = await communityApi.community
        .searchMembers(communityId, text, page + 1, limit)
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
      fetchCommunityMembers(searchTerm);
    }
  };

  const resetState = () => {
    setMembers([]);
    setMetadata({page: 0, limit: 10, total: -1});
    setLoading(false);
    setComplete(false);
    setError(false);
  };
  const handleSearch = async text => {
    resetState();
    setSearchTerm(text);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        paddingTop: 10,
      }}>
      <SearchBar
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
        placeholderTextColor={theme.colors.black7}
        lightTheme={true}
        placeholder="Search Members"
        containerStyle={{
          backgroundColor: theme.colors.primary,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
        value={searchTerm}
        onChangeText={text => handleSearch(text)}
        inputContainerStyle={{
          height: 40,
          backgroundColor: theme.colors.grey2,
        }}
        inputStyle={{
          fontSize: 12,
          color: theme.colors.black4,
        }}
        round={true}
        searchIcon={{size: 15, color: theme.colors.black7}}
        showCancel={true}
      />
      {members?.length || loading ? (
        <FlatList
          listKey="communityMembers"
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
          }}>
          No members yet{'  '}
        </Text>
      )}
    </View>
  );
}
