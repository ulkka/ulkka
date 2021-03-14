import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {navigate} from '../../navigation/Ref';

export default function CreatePostButtonOverlay(props) {
  const [enableOverlay, setEnableOverLay] = useState(false);

  const toggleOverlay = () => {
    setEnableOverLay(!enableOverlay);
  };

  const styles = StyleSheet.create({
    postType: {
      paddingTop: 10,
    },
  });

  const createPost = (type) => {
    setEnableOverLay(false);
    navigate('CreatePost', {
      type: type,
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
            width: 100,
            color: '#333',
            alignSelf: 'center',
          }}>
          Create Post
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 30,
      }}>
      <TouchableOpacity onPress={() => createPost('text')}>
        <Icon name="text" type="material-community" size={20} color={'#444'} />
        <Text style={styles.postType}>Text</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => createPost('link')}>
        <Icon name="link" type="font-awesome-5" size={20} color={'#444'} />
        <Text style={styles.postType}>Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => createPost('image')}>
        <Icon name="image" type="font-awesome-5" size={20} color={'#444'} />
        <Text style={styles.postType}>Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => createPost('gif')}>
        <Icon
          name="image-filter-tilt-shift"
          type="material-community"
          size={20}
          color={'#444'}
        />
        <Text style={styles.postType}>GIF</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => createPost('video')}>
        <Icon name="video" type="font-awesome-5" size={20} color={'#444'} />
        <Text style={styles.postType}>Video</Text>
      </TouchableOpacity>
    </View>
  );
  const CreatePostIcon = (
    <TouchableOpacity
      onPress={toggleOverlay}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: Platform.OS == 'ios' ? 20 : 0,
        backgroundColor: 'transparent',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: Platform.OS == 'ios' ? 2 : 0,
      }}>
      <Icon
        name="plus"
        type="font-awesome-5"
        size={25}
        color="#77c063"
        reverse
      />
    </TouchableOpacity>
  );
  const PopupView = (
    <Overlay
      isVisible={enableOverlay}
      onBackdropPress={toggleOverlay}
      overlayStyle={{
        position: 'absolute',
        bottom: 0,
        width: '97%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
      backdropStyle={{
        backgroundColor: '#000',
        opacity: 0.2,
      }}>
      <View>
        {Header}
        {CreatePostChoices}
      </View>
    </Overlay>
  );
  return (
    <View>
      {CreatePostIcon}
      {PopupView}
    </View>
  );
}
