import {connect} from 'react-redux';
import * as Actions from '../actions/AuthActions';
import MyAccount from '../../screens/home/MyAccount';

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  id_token: state.authReducer.id_token,
});

const mapDispatchToProps = (dispatch) => ({
  onUnAuthenticate: () => {
    dispatch(Actions.unAuthenticate());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
