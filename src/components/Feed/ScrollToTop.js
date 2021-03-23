import React from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {Icon} from 'react-native-elements';

const ScrollToTop = (props) => {
  const {listRef, visible} = props;

  const scrollAllTheWayUp = () => {
    listRef.current.scrollToIndex({
      index: 0,
    });
  };

  const ScrollToTopButton = (
    <TouchableOpacity
      onPress={scrollAllTheWayUp}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: Platform.OS == 'ios' ? 25 : 5,
        right: 20,
        backgroundColor: 'transparent',
        borderRadius: 30,
      }}>
      <Icon
        name="angle-double-up"
        type="font-awesome-5"
        size={18}
        color="#555"
        reverse
        style={{opacity: 0.55}}
      />
    </TouchableOpacity>
  );
  return visible && <View>{ScrollToTopButton}</View>;
};

export default ScrollToTop;
