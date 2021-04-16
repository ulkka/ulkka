import React, {memo, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getPostDescription} from '../../redux/selectors/PostSelectors';
import {
  getPostTextShowMore,
  getPostTextHidden,
} from '../../redux/selectors/FeedSelectors';
import {setShowMore, setTextHidden} from '../../redux/reducers/FeedSlice';

const TextPostContent = (props) => {
  const dispatch = useDispatch();

  const {postId, screen, screenId} = props;
  const description = useSelector((state) => getPostDescription(state, postId));

  const currentScreen = screenId ? screenId : screen;

  const showMore = useSelector((state) =>
    getPostTextShowMore(state, currentScreen, postId),
  );
  const textHidden = useSelector((state) =>
    getPostTextHidden(state, currentScreen, postId),
  );

  const onTextLayout = useCallback((e) => {
    if (e.nativeEvent.lines.length > 9) {
      dispatch(setShowMore({postId: postId, type: currentScreen, value: true}));
    }
  }, []);

  return (
    <View
      style={{
        alignItems: 'flex-start',
        paddingLeft: 5,
      }}>
      <Text
        onTextLayout={onTextLayout}
        ellipsizeMode={'tail'}
        numberOfLines={textHidden ? 10 : undefined}
        style={{
          fontSize: 14,
          lineHeight: 22,
          textAlign: 'justify',
          paddingRight: 5,
          color: '#444',
        }}>
        {description}
      </Text>
      {showMore && (
        <TouchableOpacity
          style={{paddingVertical: 5}}
          onPress={() =>
            dispatch(
              setTextHidden({postId, type: currentScreen, value: !textHidden}),
            )
          }>
          <Text style={{color: '#68cbf8'}}>
            {textHidden ? 'See More' : 'See Less'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(TextPostContent);
