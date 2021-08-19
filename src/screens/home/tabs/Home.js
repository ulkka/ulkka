import React, {memo, useState, useEffect} from 'react';
import {View} from 'react-native';
import Feed from '../../../components/Feed/Feed';
import {useSelector} from 'react-redux';
import {getIsCurrentUserPartOfAnyCommunity} from '../../../redux/reducers/CommunitySlice';
import EmptyHomeFeedView from './EmptyHomeFeedView';
import {
  getAuthStatus,
  getRegistrationStatus,
} from '../../../redux/reducers/AuthSlice';

function Home(props) {
  const isRegistered = useSelector(getRegistrationStatus);
  useEffect(() => {
    if (isRegistered !== 1) {
      setTimeout(() => {
        props.jumpTo('popular');
      }, 25);
    }
  }, [isRegistered]);

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
