import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IListFormState, IFieldProps } from '../../interfaces';
import { loadItem, setFieldValue } from '../../actions';
import FieldTextRendererUI from '../ui/FieldTextRenderer';
import FieldUserRendererUI from '../ui/FieldUserRenderer';

export const FieldTextRenderer = (props) => {
    const mapStateToProps = (state: IListFormState) => {return {...props}};

    const mapDispatchToProps = (dispatch) =>
    ({
      saveFieldData(internalName: string, newValue: any) {
        dispatch(setFieldValue(internalName, newValue));
      }
    });

    return React.createElement(connect(mapStateToProps, mapDispatchToProps)(FieldTextRendererUI as any));
}

export const FieldUserRenderer = (props) => {
  const mapStateToProps = (state: IListFormState) => {return {...props}};

  const mapDispatchToProps = (dispatch) =>
  ({
    saveFieldData(internalName: string, newValue: any) {
      dispatch(setFieldValue(internalName, newValue));
    }
  });

  return React.createElement(connect(mapStateToProps, mapDispatchToProps)(FieldUserRendererUI as any));
}