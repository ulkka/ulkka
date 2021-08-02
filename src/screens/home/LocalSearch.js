import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from 'react-native-elements';
import {getSearchTerm, setServerSearch} from '../../redux/reducers/SearchSlice';
import {searchCommunityTitle} from '../../redux/reducers/CommunitySlice';
import CommunityAvatar from '../../components/CommunityAvatar';
import {push, pop} from '../../navigation/Ref';
import communityApi from '../../services/CommunityApi';

export default function LocalSearch(props) {
  const dispatch = useDispatch();

  const term = useSelector(getSearchTerm);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [complete, setComplete] = useState(false);

  const communityResults = useSelector((state) =>
    searchCommunityTitle(state, term.toLowerCase()),
  );

  useEffect(() => {
    if (!!term.length) {
      searchCommunities();
    } else {
      setError(false);
      const reducedCommunities = communityResults.map((item, index) => {
        const reducedCommunity = {
          type: 'community',
          _id: item._id,
          name: item.name,
        };
        return reducedCommunity;
      });
      setResults(reducedCommunities);
    }
  }, [term]);

  const searchCommunities = async () => {
    setLoading(true);
    const response = await communityApi.community
      .search(term, 1, 5)
      .catch((error) => {
        setError(true);
        console.log('error searching for communities');
      });
    if (response?.data?.data) {
      setResults(response.data.data);
    }
    setLoading(false);
  };

  const CommunityRow = ({community}) => {
    const {_id: communityId, name: communityName, icon} = community;
    return (
      <TouchableOpacity
        onPress={() => {
          //  pop();
          push('CommunityNavigation', {communityId: communityId});
        }}
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{width: 45, alignItems: 'center'}}>
            <CommunityAvatar
              communityId={communityId}
              size="small"
              name={communityName}
              icon={icon}
            />
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

  const handlerRenderItem = ({item}) => {
    return <CommunityRow community={item} />;
  };

  const separator = () => {
    return <View style={{height: 5}}></View>;
  };

  const submitSearch = (
    <TouchableOpacity
      style={{
        marginTop: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#298df4',
        borderRadius: 15,
      }}
      onPress={() => dispatch(setServerSearch(true))}>
      <Icon name="search" type="font-awesome" size={20} color="#298df4" />
      <View style={{width: 15}}></View>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#298df4',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        More results for "{term}..."
      </Text>
    </TouchableOpacity>
  );

  const listHeader = (
    <View style={{padding: 10, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
      }}>
      <View>
        {loading && !error && !complete ? (
          listHeader
        ) : (
          <FlatList
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            listKey="searchResult"
            renderItem={handlerRenderItem}
            data={results}
            keyExtractor={(item, index) => item._id}
            windowSize={15}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            ItemSeparatorComponent={separator}
          />
        )}
      </View>
      {!!term.length && submitSearch}
    </View>
  );
}
