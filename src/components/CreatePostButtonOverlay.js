import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';

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
    props.navigation.navigate('CreatePost', {
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
        paddingBottom: 15,
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
    <Icon
      name="plus"
      type="font-awesome-5"
      size={25}
      color="green"
      reverse
      onPress={toggleOverlay}
      containerStyle={{
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        marginBottom: 10,
      }}
    />
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
        backgroundColor: '#888',
        opacity: 0.3,
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
