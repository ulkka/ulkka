import { connect } from 'react-redux';
import * as Actions from './actions';
import SignIn from '../../screens/auth/SignIn';

const mapDispatchToProps = (dispatch) => ({
  addAuth: (user,id_token) => dispatch(Actions.addAuth(user,id_token))
});

export default connect(null,mapDispatchToProps)(SignIn);