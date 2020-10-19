import { connect } from 'react-redux';
import mainClient from '../../client/mainClient';

const mapStateToProps = (state) => ({
  id_token:state.authReducer.id_token
});


export default connect(mapStateToProps, null)(mainClient);