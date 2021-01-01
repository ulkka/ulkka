import {connect} from 'react-redux';
import * as Actions from '../actions/FeedActions';
import Home from '../../screens/home/tabs/Home';

const mapStateToProps = (state) => ({
  feed: state.feedReducer.feed,
  feedMap: state.feedReducer.feedMap,
  loading: state.feedReducer.loading,
  error: state.feedReducer.error,
});

const mapDispatchToProps = (dispatch) => ({
  feedFetch: () => {
    dispatch(Actions.feedFetch());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
