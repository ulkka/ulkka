import {connect} from 'react-redux';
import * as Actions from './CreateCommentActions';
import {Comment} from '../../components/Comment';

const mapStateToProps = (state) => ({
  reply_to: state.CreateCommentReducer.reply_to,
  post_id: state.CreateCommentReducer.post_id,
  post_title: state.CreateCommentReducer.post_title,
  comment_id: state.CreateCommentReducer.comment_id,
  comment_author: state.CreateCommentReducer.comment_author,
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
