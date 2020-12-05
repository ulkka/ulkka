import {connect} from 'react-redux';
import * as Actions from '../actions/CommentActions';
import {Comment} from '../../components/Comment';

const mapStateToProps = (state) => ({
  reply_to: state.CommentReducer.reply_to,
  post_id: state.CommentReducer.post_id,
  post_title: state.CommentReducer.post_title,
  comment_id: state.CommentReducer.comment_id,
  comment_author: state.CommentReducer.comment_author,
});

const mapDispatchToProps = (dispatch) => ({
  prepareComment: (post_id, post_title) => {
    dispatch(Actions.prepareComment(post_id, post_title));
  },
  prepareReply: (post_id, post_title, comment_id, comment_author) => {
    dispatch(
      Actions.prepareReply(post_id, post_title, comment_id, comment_author),
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
