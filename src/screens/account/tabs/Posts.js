import React, {memo} from 'react';
import Feed from '../../../components/Feed';

function Posts(props) {
  const userId = props?.route?.params?.params?.userId;
  const screenName = 'UserDetail-' + userId;
  return <Feed screen={screenName} />;
}

export default memo(Posts);
