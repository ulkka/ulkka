import React, {useState, useEffect, memo} from 'react';
import {View, Text, TouchableOpacity, Platform, FlatList} from 'react-native';
import {useTheme, Icon, Divider} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getSearchTerm} from '../../redux/reducers/SearchSlice';
import communityApi from '../../services/CommunityApi';
import CommunityAvatar from '../../components/CommunityAvatar';
import {push, pop} from '../../navigation/Ref';
import FeedFooter from '../../components/Feed/FeedFooter';
import analytics from '@react-native-firebase/analytics';
import {CommunityCreatorPromptView} from '../../components/CommunityCreatorPrompt';

const CommunityRow = ({community}) => {
  const {theme} = useTheme();

  const {name, _id: communityId, icon} = community;
  return name ? (
    <TouchableOpacity
      onPress={() => {
        // pop();
        push('CommunityNavigation', {communityId: communityId});
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
        <CommunityAvatar
          communityId={communityId}
          size="medium"
          name={name}
          icon={icon}
        />
        <Text
          style={{
            padding: 10,
            color: theme.colors.black4,
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {name}
        </Text>
      </View>
      <View>
        <Icon
          name="arrow-right"
          type="font-awesome"
          size={16}
          color={theme.colors.black5}
        />
      </View>
    </TouchableOpacity>
  ) : (
    <View></View>
  );
};

export default memo(function SearchCommunityResults(props) {
  const {theme} = useTheme();

  const term = useSelector(getSearchTerm);

  const [metadata, setMetadata] = useState({page: 0, limit: 10, total: -1});
  const [communities, setCommunities] = useState([]);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    analytics().logEvent('search', {
      type: 'community',
      value: term,
    });
    searchCommunities();
  }, []);

  const searchCommunities = async () => {
    if (!complete && !loading && !error) {
      const {page, limit} = metadata;
      setLoading(true);
      const response = await communityApi.community
        .search(term, page + 1, limit)
        .catch(error => {
          setError(true);
          console.error('error searching community', error);
        });
      const communityList = response?.data?.data;
      if (communityList?.length) {
        setCommunities([...communities, ...communityList]);

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
    return (
      <Divider style={{backgroundColor: theme.colors.primary, height: 5}} />
    );
  };

  const handlerRenderItem = ({item}) => {
    return <CommunityRow community={item} />;
  };

  const handleLoadMore = () => {
    if (!complete && !loading && !error) {
      searchCommunities();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        paddingTop: 40,
      }}>
      {communities?.length || loading ? (
        <FlatList
          listKey="communitysearchresults"
          renderItem={handlerRenderItem}
          data={communities}
          keyExtractor={(item, index) => item._id}
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
            <CommunityCreatorPromptView
              image="failSearchCommunity"
              text={term}
              shouldGoBack={true}
              title="No matching communities found!"
            />
          </View>
        )
      )}
    </View>
  );
});
