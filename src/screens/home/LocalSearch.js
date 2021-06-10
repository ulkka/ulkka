import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getSearchTerm, setServerSearch} from '../../redux/reducers/SearchSlice';
import {searchCommunityTitle} from '../../redux/reducers/CommunitySlice';
import {searchUserDisplayname} from '../../redux/reducers/UserSlice';
import CommunityAvatar from '../../components/CommunityAvatar';
import UserAvatar from '../../components/UserAvatar';
import {push, pop} from '../../navigation/Ref';

export default function LocalSearch(props) {
  const dispatch = useDispatch();

  const term = useSelector(getSearchTerm);

  const [results, setResults] = useState([]);

  const communityResults = useSelector((state) =>
    searchCommunityTitle(state, term.toLowerCase()),
  );
  const userResults = useSelector((state) =>
    searchUserDisplayname(state, term.toLowerCase()),
  );

  useEffect(() => {
    let eachArraySize = 3;
    let reducedResults = [];
    if (!!term.length) {
      const reducedCommunities = communityResults
        .slice(0, eachArraySize)
        .map((item, index) => {
          const reducedCommunity = {
            type: 'community',
            _id: item._id,
            name: item.name,
          };
          return reducedCommunity;
        });
      const reducedUsers = userResults
        .slice(0, eachArraySize)
        .map((item, index) => {
          const reducedUser = {
            type: 'user',
            _id: item._id,
            displayname: item.displayname,
          };
          return reducedUser;
        });
      reducedResults = [...reducedCommunities, ...reducedUsers];
    } else {
      const reducedCommunities = communityResults.map((item, index) => {
        const reducedCommunity = {
          type: 'community',
          _id: item._id,
          name: item.name,
        };
        return reducedCommunity;
      });
      reducedResults = reducedCommunities;
    }
    setResults(reducedResults);
  }, [term]);

  const CommunityRow = ({community}) => {
    const {_id: communityId, name: communityName} = community;
    return (
      <TouchableOpacity
        onPress={() => {
          pop();
          push('CommunityNavigation', {communityId: communityId});
        }}
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
        }}>
        <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 45, alignItems: 'center'}}>
            <CommunityAvatar communityId={communityId} size="small" />
          </View>
          <Text
            style={{
              padding: 10,
              color: '#444',
              fontWeight: 'bold',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {communityName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const UserRow = ({user}) => {
    const {displayname, _id: userId} = user;
    return (
      <TouchableOpacity
        onPress={() => push('UserDetail', {userId: userId})}
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <View style={{width: 45, alignItems: 'center'}}>
            <UserAvatar seed={displayname} size={'medium'} />
          </View>
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
      </TouchableOpacity>
    );
  };

  const handlerRenderItem = ({item}) => {
    switch (item.type) {
      case 'community':
        return <CommunityRow community={item} />;
      case 'user':
        return <UserRow user={item} />;
      default:
        return <View></View>;
    }
  };

  const separator = () => {
    return <View style={{height: 5}}></View>;
  };

  const submitSearch = (
    <TouchableOpacity
      style={{padding: 10}}
      onPress={() => dispatch(setServerSearch(true))}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#2980b9',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        More results for "{term}"
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
      }}>
      <View>
        <FlatList
          keyboardShouldPersistTaps="always"
          listKey="searchResult"
          renderItem={handlerRenderItem}
          data={results}
          keyExtractor={(item, index) => item._id}
          windowSize={15}
          //onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ItemSeparatorComponent={separator}
        />
      </View>
      {!!term.length && submitSearch}
    </View>
  );
}
