import React, {useEffect, memo} from 'react';
import {View, FlatList, Text, TouchableOpacity, Platform} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {fetchComments} from '../../../redux/actions/CommentActions';
import {getUserCommentsSelector} from '../../../redux/selectors/CommentSelectors';
import {selectCommentById} from '../../../redux/selectors/CommentSelectors';
import TimeAgo from '../../../components/TimeAgo';
import {push} from '../../../navigation/Ref';

const CommentRow = memo((props) => {
  const {commentId} = props;
  const comment = useSelector((state) => selectCommentById(state, commentId));
  const title = comment?.post?.title;
  const createdAt = comment?.created_at;
  const text = comment?.text;
  const voteCount = comment?.voteCount;
  const postId = comment?.post?._id;
  const status = comment?.status;

  const textField =
    status != 'deleted' ? (
      <Text
        ellipsizeMode={'tail'}
        numberOfLines={5}
        style={{padding: 5, color: '#333'}}>
        {text}
      </Text>
    ) : (
      <Text style={{padding: 5, color: '#333'}}>
        {' -- comment deleted -- '}
      </Text>
    );

  const voteCountField = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon
        name={
          voteCount >= 0 ? 'arrow-up-bold-outline' : 'arrow-down-bold-outline'
        }
        type="material-community"
        size={14}
        color={'#888'}
      />
      <Text style={{fontSize: 12, color: '#444', paddingHorizontal: 4}}>
        {voteCount}
      </Text>
    </View>
  );

  const titleField = (
    <Text style={{fontWeight: 'bold', padding: 5, color: '#444'}}>{title}</Text>
  );

  const metadataRow = (
    <View style={{flexDirection: 'row', paddingHorizontal: 5}}>
      <TimeAgo time={createdAt} size={12} />
      <View
        style={{
          paddingHorizontal: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="circle" type="font-awesome" size={4} color="#888" />
      </View>
      {voteCountField}
    </View>
  );

  return title ? (
    <TouchableOpacity
      style={{
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 3,
      }}
      onPress={() => push('PostDetail', {postId: postId})}>
      {titleField}
      {metadataRow}
      {textField}
    </TouchableOpacity>
  ) : (
    <View
      style={{
        marginHorizontal: 3,
        paddingVertical: 20,
        borderRadius: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fafafa',
      }}>
      <Text style={{color: '#444', letterSpacing: 0.5}}>Post removed</Text>
    </View>
  );
});

const separator = memo(() => {
  return <Divider style={{backgroundColor: '#fafafa', height: 5}} />;
});

const Comments = (props) => {
  const dispatch = useDispatch();

  const userId = props?.route?.params?.userId;

  const commentIds = useSelector((state) =>
    getUserCommentsSelector(state, userId),
  );

  console.log('running comments tab');

  useEffect(() => {
    dispatch(fetchComments({userId: userId}));
  }, []);

  const renderRow = ({item}) => {
    return <CommentRow commentId={item} />;
  };
  return (
    <FlatList
      listKey="userCommentList"
      removeClippedSubviews={true}
      renderItem={renderRow}
      data={commentIds}
      removeClippedSubviews={Platform.OS == 'ios' ? false : true} // Pd: Don't enable this on iOS where this is buggy and views don't re-appear.
      ItemSeparatorComponent={separator}
      keyExtractor={(item, index) => item}
    />
  );
};

export default memo(Comments);
