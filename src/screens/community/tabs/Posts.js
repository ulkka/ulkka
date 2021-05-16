import React, {memo} from 'react';
import Feed from '../../../components/Feed/Feed';

function Posts(props) {
  const {screenName} = props;

  console.log('ruuning posts tab in community', screenName);

  return <Feed screen={screenName} {...props} />;
}

export default memo(Posts);
