import {connect} from 'react-redux';
import * as Actions from '../actions/VoteActions';
import Vote from '../../components/Vote';

const mapStateToProps = (state) => ({
  //  feed: state.feedReducer.feed,
  /* feedMap: state.feedReducer.feedMap,
    loading: state.feedReducer.loading,
    error: state.feedReducer.error,*/
});

const mapDispatchToProps = (dispatch) => ({
  vote: (entity, id, voteType, userVote) => {
    dispatch(Actions.vote(entity, id, voteType, userVote));
  },
});

export default connect(null, mapDispatchToProps)(Vote);
