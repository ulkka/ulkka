import React, {memo} from 'react';
import Feed from '../../../components/Feed/Feed';
import {makeId} from '../../../components/Post/helpers';

function Posts(props) {
  const userId = props?.route?.params?.userId;

  const screenName = 'UserDetail-' + userId + '-' + makeId(5);

  console.log('ruuning posts tab', screenName);

  return <Feed screen={screenName} />;
}

export default memo(Posts);
