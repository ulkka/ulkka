import {connect} from 'react-redux';
import * as Actions from '../actions/OptionSheetActions';
import OptionSheet from '../../components/OptionSheet';

const mapStateToProps = (state) => ({
  isVisible: state.optionSheetReducer.isVisible,
  type: state.optionSheetReducer.type,
  id: state.optionSheetReducer.id,
});

const mapDispatchToProps = (dispatch) => ({
  hideOptionSheet: () => {
    dispatch(Actions.hideOptionSheet());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionSheet);
