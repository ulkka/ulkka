import React, {memo} from 'react';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';
import {getCommunityTitle} from '../redux/reducers/CommunitySlice';

export default memo(function CommunityTitleBuilder(props) {
  const {communityId} = props;
  const communityTitle = useSelector((state) =>
    getCommunityTitle(state, communityId),
  );

  return <Text {...props}>#{communityTitle ? communityTitle : 'Ulkka'}</Text>;
});
