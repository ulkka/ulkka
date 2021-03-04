import {Image} from 'react-native';

const GifPostContent = (props) => {
  const post = props.post;
  return (
    <Image
      style={{
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
      }}
      source={{
        uri: post.link,
      }}
    />
  );
};

export default GifPostContent;
