import React, {memo} from 'react';
import Feed from '../../../components/Feed';

function Posts(props) {
  const userId = props?.route?.params?.params?.userId;

  function makeId(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const screenName = 'UserDetail-' + userId + '-' + makeId(5);

  return <Feed screen={screenName} />;
}

export default memo(Posts);
