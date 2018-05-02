import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IListFormState } from '../../interfaces';
import { loadItem, saveFormData } from '../../actions';
import ListFormUI from '../ui/ListForm';

const mapStateToProps = (state: IListFormState) => {return {...state}};

const mapDispatchToProps = (dispatch) =>
({
  loadItem(): void {
    dispatch(loadItem());
  },
  closeForm(): void {
    console.log("closing the form :)");
  },
  saveFormData(): void {
    dispatch(saveFormData());
  }
});

const ListForm = connect(mapStateToProps, mapDispatchToProps)(ListFormUI as any);
export default ListForm as any;