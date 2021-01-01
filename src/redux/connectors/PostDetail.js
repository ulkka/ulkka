import {connect} from 'react-redux';
import PostDetail from '../../screens/PostDetail';

const mapStateToProps = (state) => ({
  feed: state.feedReducer.feed,
  feedMap: state.feedReducer.feedMap,
});

export default connect(mapStateToProps, null)(PostDetail);
