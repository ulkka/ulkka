import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {navigate} from '../../navigation/Ref';
import {useSelector, useDispatch} from 'react-redux';
import {
  hideCreatorOverlay,
  getEnableOverlay,
  toggleCreatorOverlay,
  getCreatorCommunityId,
} from '../../redux/reducers/CreatorOverlaySlice';
import {getCommunityTitle} from '../../redux/reducers/CommunitySlice';

export default function CreatePostButtonOverlay(props) {
  const dispatch = useDispatch();

  const enableOverlay = useSelector(getEnableOverlay);
  const communityId = useSelector(getCreatorCommunityId);
  const communityTitle = useSelector((state) =>
    getCommunityTitle(state, communityId),
  );

  const community = {name: communityTitle, _id: communityId};

  const toggleOverlay = () => {
    dispatch(toggleCreatorOverlay());
  };
  const styles = StyleSheet.create({
    postType: {
      paddingTop: 10,
    },
  });

  const createPost = (type) => {
    dispatch(hideCreatorOverlay());
    navigate('CreatePost', {
      type: type,
      community: community,
    });
  };

  const Header = (
    <View style={{flexDirection: 'row'}}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 30,
        }}>
        <Text
          style={{
            flex: 1,
            fontSize: 15,
            fontWeight: 'bold',
            color: '#333',
            alignSelf: 'center',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {communityTitle ? 'Post on ' + communityTitle : 'Create Post'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => toggleOverlay()}>
        <Icon name="close" size={18} color="#888" />
      </TouchableOpacity>
    </View>
  );

  const CreatePostChoices = (
    <View
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <TouchableOpacity
        onPress={() => createPost('text')}
        style={{alignItems: 'center'}}>
        <Icon
          reverse
          name="text"
          type="material-community"
          size={18}
          color={'#444'}
        />
        <Text style={styles.postType}>Text</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => createPost('link')}
        style={{alignItems: 'center'}}>
        <Icon
          reverse
          name="link"
          type="font-awesome-5"
          size={18}
          color={'#444'}
        />
        <Text style={styles.postType}>Link</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => createPost('image')}
        style={{alignItems: 'center'}}>
        <Icon
          reverse
          name="image"
          type="font-awesome-5"
          size={18}
          color={'#444'}
        />
        <Text style={styles.postType}>Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => createPost('gif')}
        style={{alignItems: 'center'}}>
        <Icon
          reverse
          name="image-filter-tilt-shift"
          type="material-community"
          size={18}
          color={'#444'}
        />
        <Text style={styles.postType}>GIF</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => createPost('video')}
        style={{alignItems: 'center'}}>
        <Icon
          reverse
          name="video"
          type="font-awesome-5"
          size={18}
          color={'#444'}
        />
        <Text style={styles.postType}>Video</Text>
      </TouchableOpacity>
    </View>
  );

  const PopupView = (
    <Overlay
      isVisible={enableOverlay}
      statusBarTranslucent={true}
      onBackdropPress={toggleOverlay}
      overlayStyle={{
        flex: 1,
        position: 'absolute',
        bottom: 0,
        width: '97%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
      backdropStyle={{
        backgroundColor: '#000',
        opacity: 0.2,
      }}>
      <View style={{padding: 10, marginBottom: 15}}>
        {Header}
        {CreatePostChoices}
      </View>
    </Overlay>
  );
  return <View>{PopupView}</View>;
}
