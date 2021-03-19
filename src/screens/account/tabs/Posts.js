import React, {memo} from 'react';
import Feed from '../../../components/Feed';

function Posts(props) {
  console.log(props);
  return <Feed screen="home" />;
}

export default memo(Posts);
