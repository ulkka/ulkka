import React, {memo, useState, useEffect, useContext} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import Feed from '../../../components/Feed/Feed';
import {useSelector} from 'react-redux';
import {getIsCurrentUserPartOfAnyCommunity} from '../../../redux/reducers/CommunitySlice';
import EmptyHomeFeedView from './EmptyHomeFeedView';
import {getRegistrationStatus} from '../../../redux/reducers/AuthSlice';

function Home(props) {
  const {theme} = useContext(ThemeContext);

  const userHasJoinedCommunities = useSelector(
    getIsCurrentUserPartOfAnyCommunity,
  );
  const [
    prevUserHasJoinedCommunities,
    setPrevUserHasJoinedCommunities,
  ] = useState(userHasJoinedCommunities);

  const homeFeedView = (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
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
