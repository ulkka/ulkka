import React, {memo} from 'react';
import Feed from '../../../components/Feed/Feed';

function Posts(props) {
  const {screenName} = props;

  return <Feed screen={screenName} {...props} />;
}

export default memo(Posts);
