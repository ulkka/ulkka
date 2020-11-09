import {connect} from 'react-redux';
import Main from '../../navigation/Main';

const mapStateToProps = (state) => ({
  auth_state: state.authReducer.auth_state,
});

export default connect(mapStateToProps)(Main);
