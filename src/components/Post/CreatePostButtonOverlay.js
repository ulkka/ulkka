import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {navigate, showAuthScreen} from '../../navigation/Ref';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';

export default function CreatePostButtonOverlay(props) {
  const [enableOverlay, setEnableOverLay] = useState(false);

  const isRegistered = useSelector(getRegistrationStatus);

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
    <View
      style={{
        position: 'absolute',
        alignSelf: 'center',
        bottom: Platform.OS == 'ios' ? 15 : 0,
        backgroundColor: 'transparent',
        borderColor: '#eee',
        borderRadius: 33,
        shadowColor: '#000',
        shadowOffset: {
          height: 2,
        },
        shadowOpacity: 0.5,
        elevation: 15,
      }}>
      <TouchableOpacity
        onPress={() => {
          isRegistered ? toggleOverlay() : showAuthScreen();
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Icon
          name="plus"
          type="font-awesome-5"
          size={25}
          color="#fff"
          reverse
          reverseColor="#FF4500"
          style={{opacity: 0.9}}
        />
      </TouchableOpacity>
    </View>
  );
  const PopupView = (
    <Overlay
      isVisible={enableOverlay}
      statusBarTranslucent={true}
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
  //return isRegistered ? (
  return (
    <View>
      {CreatePostIcon}
      {PopupView}
    </View>
  );
  // ) : null;
}
