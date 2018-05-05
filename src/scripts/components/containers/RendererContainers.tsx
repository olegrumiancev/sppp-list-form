import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IListFormState, IFieldProps, IFieldInfo } from '../../interfaces';
import { loadItem, setFieldValue } from '../../actions';
import BaseFieldRendererUI from '../ui/BaseFieldRenderer';
import FieldTextRendererUI from '../ui/FieldTextRenderer';
import FieldChoiceRendererUI from '../ui/FieldChoiceRenderer';
import FieldUserRendererUI from '../ui/FieldUserRenderer';

export const BaseFieldRenderer = (props) => {
  const mapStateToProps = (state: IListFormState) => {return {...props}};

  const mapDispatchToProps = (dispatch) =>
  ({

  });
  return React.createElement(connect(mapStateToProps, mapDispatchToProps)(BaseFieldRendererUI as any));
}

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

export const FieldChoiceRenderer = (props) => {
  const mapStateToProps = (state: IListFormState) => {return {...props}};

  const mapDispatchToProps = (dispatch) =>
  ({
    saveFieldData(internalName: string, newValue: any) {
      dispatch(setFieldValue(internalName, newValue));
    }
  });

  return React.createElement(connect(mapStateToProps, mapDispatchToProps)(FieldChoiceRendererUI as any));
}

export const FieldUserRenderer = (props: IFieldInfo) => {
  const mapStateToProps = (state: IListFormState) => {return {...props}};

  const mapDispatchToProps = (dispatch) =>
  ({
    saveFieldData(internalName: string, newValue: any) {
      dispatch(setFieldValue(internalName, newValue));
    }
  });

  return React.createElement(connect(mapStateToProps, mapDispatchToProps)(FieldUserRendererUI as any));
}

