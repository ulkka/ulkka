import {connect} from 'react-redux';
import * as Actions from './actions';
import SignIn from '../../screens/auth/SignIn';

const mapDispatchToProps = (dispatch) => ({
  onAuthenticate: (user, id_token) => {
    dispatch(Actions.authenticate(user, id_token));
  },
});

export default connect(null, mapDispatchToProps)(SignIn);
