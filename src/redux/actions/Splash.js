import { connect } from 'react-redux';
import * as Actions from './actions';
import Splash from '../../screens/Splash';

const mapStateToProps = (state) => ({
    user: state.authReducer.user,
    id_token: state.authReducer.id_token,
    auth_state: state.authReducer.auth_state,
});

const mapDispatchToProps = dispatch => ({
    removeAuth: () => dispatch(Actions.removeAuth()),
    addAuth: (user, id_token) => dispatch(Actions.addAuth(user, id_token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);