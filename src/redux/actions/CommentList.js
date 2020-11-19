import {connect} from 'react-redux';
import * as Actions from './CommentActions';
import CommentList from '../../components/CommentList';

const mapStateToProps = (state) => ({
  comments: state.CommentReducer.comments,
});

const mapDispatchToProps = (dispatch) => ({
  AddComment: (comments) => {
    dispatch(Actions.AddComment(comments));
  },
  newComment: (new_comment) => {
    dispatch(Actions.newComment(new_comment));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
