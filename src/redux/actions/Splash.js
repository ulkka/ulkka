import {connect} from 'react-redux';
import * as Actions from './AuthActions';
import Splash from '../../screens/Splash';
import {ActivityIndicator} from 'react-native';

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  id_token: state.authReducer.id_token,
  auth_state: state.authReducer.auth_state,
});

const mapDispatchToProps = (dispatch) => ({
  removeAuth: () => dispatch(Actions.removeAuth()),
  onAuthenticate: (user, id_token) => {
    dispatch(Actions.authenticate(user, id_token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
