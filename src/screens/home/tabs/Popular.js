import React, {useEffect, useContext} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import Post from '../../../components/Post';
import FeedFooter from '../../../components/FeedFooter';
import {useSelector, useDispatch} from 'react-redux';
import {selectPostIds, fetchPosts} from '../../../redux/reducers/PostSlice';

function Popular(props) {
  const {theme} = useContext(ThemeContext);
  const postIds = useSelector(selectPostIds);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const renderRow = ({item}) => {
    return <Post item={item} navigation={props.navigation} caller="Home" />;
  };
  const separator = () => {
    return <View style={{padding: 5}}></View>;
  };

  const ListHeaderComponent = () => {
    return (
      <View
        style={{
          height: 10,
          backgroundColor: '#fff',
        }}></View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          listKey={'popular'}
          data={postIds}
          renderItem={renderRow}
          ItemSeparatorComponent={separator}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          keyExtractor={(item, index) => item}
          ListFooterComponent={<FeedFooter complete={true} />}
        />
      </View>
    </SafeAreaView>
  );
}

export default Popular;
