import { connect } from 'react-redux';
import * as Actions from './actions';
import MyAccount from '../../screens/home/MyAccount';

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
  id_token:state.authReducer.id_token
});

const mapDispatchToProps = dispatch => ({
  removeAuth: () => dispatch(Actions.removeAuth())
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);