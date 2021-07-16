import React, {memo, useState} from 'react';
import {View} from 'react-native';
import Feed from '../../../components/Feed/Feed';
import {useSelector} from 'react-redux';
import {getIsCurrentUserPartOfAnyCommunity} from '../../../redux/reducers/CommunitySlice';

import EmptyHomeFeedView from './EmptyHomeFeedView';

function Home(props) {
  const userHasJoinedCommunities = useSelector(
    getIsCurrentUserPartOfAnyCommunity,
  );
  const [
    prevUserHasJoinedCommunities,
    setPrevUserHasJoinedCommunities,
  ] = useState(userHasJoinedCommunities);

  const homeFeedView = (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Feed {...props} />
    </View>
  );

  return prevUserHasJoinedCommunities ? (
    homeFeedView
  ) : (
    <EmptyHomeFeedView
      setPrevUserHasJoinedCommunities={setPrevUserHasJoinedCommunities}
      prevUserHasJoinedCommunities={prevUserHasJoinedCommunities}
      {...props}
    />
  );
}

export default memo(Home);
