import React, {memo} from 'react';
import Feed from '../../../components/Feed';
import {makeId} from '../../../components/Post/helpers';

function Posts(props) {
  const userId = props?.route?.params?.params?.userId;

  const screenName = 'UserDetail-' + userId + '-' + makeId(5);

  return <Feed screen={screenName} />;
}

export default memo(Posts);
