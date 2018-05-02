import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IListFormState, IFieldProps } from '../../interfaces';
import { loadItem } from '../../actions';
import FormFieldRowUI from '../ui/FormFieldRow';

export default (props) => {
  const mapStateToProps = (state: IListFormState) => {
    let baseProperties = {};
    let fieldInfo = state.Fields.filter(f => f.InternalName == props.InternalName);
    if (fieldInfo != null) {
      baseProperties = fieldInfo[0];
    }

    baseProperties["CurrentMode"] = state.CurrentMode;
    return baseProperties;
  };

  const mapDispatchToProps = (dispatch) =>
  ({

  });

  return React.createElement(connect(mapStateToProps, mapDispatchToProps)(FormFieldRowUI as any));
}