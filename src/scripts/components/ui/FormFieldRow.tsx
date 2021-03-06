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
          <Label>
            {this.props.Title}
            {this.props.IsRequired ? <span style={{color: "red"}}> *</span> : null}
          </Label>
        </div>
        <div className="rowField">
          {/*this.props.FieldRenderingComponent*/}
          {this.props.resolveFieldRenderingControl(this.props, null, null)}
        </div>
      </div>
    )}
}