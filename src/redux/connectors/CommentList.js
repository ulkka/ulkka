import {connect} from 'react-redux';
import * as Actions from '../actions/CommentActions';
import CommentList from '../../components/CommentList';

const mapStateToProps = (state) => ({
  comments: state.CommentReducer.comments,
  new_comment: state.CommentReducer.new_comment,
});

const mapDispatchToProps = (dispatch) => ({
  AddComment: (comments) => {
    dispatch(Actions.AddComment(comments));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
