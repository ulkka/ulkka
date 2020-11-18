import {connect} from 'react-redux';
import * as Actions from './CommentActions';
import * as CreateCommentActions from './CreateCommentActions';
import CommentList from '../../components/CommentList';

const mapStateToProps = (state) => ({
  comments: state.CommentReducer.comments,
  new_comment: state.CreateCommentReducer.new_comment,
});

const mapDispatchToProps = (dispatch) => ({
  AddComment: (comments) => {
    dispatch(Actions.AddComment(comments));
  },
  newComment: (new_comment) => {
    dispatch(CreateCommentActions.newComment(new_comment));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
