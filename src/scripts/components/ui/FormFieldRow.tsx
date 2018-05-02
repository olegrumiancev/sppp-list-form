import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IFieldProps } from '../../interfaces';

export default class FormFieldRow extends React.Component<IFieldProps, void> {
  constructor(props) {
    super(props);

  }

  public render() {
    return (
      <div className="formRow">
        <div className="rowLabel">
          <Label>{this.props.Title}</Label>
        </div>
        <div className="rowField">
          {this.props.FieldRenderingComponent}
        </div>
      </div>
    )}
}