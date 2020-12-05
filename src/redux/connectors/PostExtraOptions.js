import {connect} from 'react-redux';
import * as Actions from '../actions/OptionSheetActions';
import PostExtraOptions from '../../components/PostExtraOptions';

const mapDispatchToProps = (dispatch) => ({
  showOptionSheet: (type, id) => {
    dispatch(Actions.showOptionSheet(type, id));
  },
});

export default connect(null, mapDispatchToProps)(PostExtraOptions);
