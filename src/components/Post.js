import React, {useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {ThemeContext, Icon, Text} from 'react-native-elements';
import PostContent from './PostContent';
import TimeAgo from '../components/TimeAgo';
import Vote from './Vote';
import PostExtraOptions from './PostExtraOptions';
import {useSelector} from 'react-redux';
import {selectPostById} from '../redux/reducers/PostSlice';
import {selectCommunityById} from '../redux/reducers/CommunitySlice';
import {selectUserById} from '../redux/reducers/UserSlice';
import {selectTotalComments} from '../redux/reducers/CommentSlice';

export default function Post(props) {
  const {theme} = useContext(ThemeContext);
  const post = useSelector((state) => selectPostById(state, props.item));
  const community = useSelector((state) =>
    selectCommunityById(state, post.community),
  );
  const user = useSelector((state) => selectUserById(state, post.author));
  const commentCount = useSelector(selectTotalComments);

  const PostHeader = (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{flexDirection: 'row'}}>
        <Icon name="account-circle" color="#333" size={32} />
        <View
          style={{
            padding: 5,
          }}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Community', {
                community_id: post.community,
              })
            }>
            <Text style={{fontSize: 13, fontWeight: 'bold', color: '#432'}}>
              {community.name}
            </Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Account')}>
              <Text style={{fontSize: 11, paddingRight: 10, color: '#555'}}>
                {user.name}
              </Text>
            </TouchableOpacity>
            <TimeAgo time={post.created_at} />
          </View>
        </View>
      </View>
      <PostExtraOptions item={post} optionType={'post'} />
    </View>
  );
  const PostTitle = (
    <View>
      <Text
        style={{
          fontSize: 15,
          paddingVertical: 10,
          fontWeight: 'bold',
          color: '#555',
        }}>
        {post.title}
      </Text>
    </View>
  );

  const CommentSummary = (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('PostDetail', {
          post: props.item,
        });
      }}
      style={{
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon
        name="comment"
        type="material-community"
        color="#000"
        size={18}
        color="#888"
      />
      <Text style={{fontWeight: 'bold', color: '#888', paddingLeft: 15}}>
        {post.commentCount}
      </Text>
    </TouchableOpacity>
  );

  const Share = (
    <TouchableOpacity style={{flex: 3, flexDirection: 'row'}}>
      <Icon name="share" type="font-awesome" size={18} color="#888" />
      <Text
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          paddingLeft: 12,
          color: '#777',
        }}>
        Share
      </Text>
    </TouchableOpacity>
  );

  const PostFooter = (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        justifyContent: 'space-evenly',
      }}>
      <Vote
        item={props.item}
        type="post"
        style={{
          flex: 3,
          paddingLeft: 10,
        }}
      />
      {CommentSummary}
      {Share}
    </View>
  );
  return (
    <View
      style={{
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: theme.colors.background,
        width: '100%',
        paddingVertical: 10,
      }}>
      <View style={{paddingHorizontal: 5}}>
        {PostHeader}
        {PostTitle}
      </View>
      {<PostContent item={props.item} navigation={props.navigation} />}
      {PostFooter}
    </View>
  );
}
