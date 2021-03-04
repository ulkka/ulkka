import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {getPostDescription} from '../../redux/reducers/PostSlice';
import {useSelector} from 'react-redux';

const TextPostContent = (props) => {
  const postId = props.postId;
  const postDescription = useSelector((state) =>
    getPostDescription(state, postId),
  );
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"

  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  return (
    <View>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : 5}
        style={{
          color: '#444',
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 21,
        }}>
        {postDescription}
      </Text>
      {lengthMore ? (
        <TouchableOpacity
          onPress={toggleNumberOfLines}
          style={{
            marginTop: 20,
          }}>
          <Text
            style={{
              lineHeight: 21,
              color: '#035aa6',
            }}>
            {textShown ? 'Read less...' : 'Read more...'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default TextPostContent;
