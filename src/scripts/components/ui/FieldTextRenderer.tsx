import * as React from "react";
import { IFieldProps, FormMode } from "../../interfaces";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import BaseFieldRenderer from "./BaseFieldRenderer";

export default class FieldTextRenderer extends BaseFieldRenderer {
  public constructor(props) {
    super(props);

  }

  protected renderNewForm() {
    return this.renderNewOrEditForm();
  }

  protected renderEditForm() {
    return this.renderNewOrEditForm();
  }

  protected renderDispForm() {
    return (<Label>{this.props.FormFieldValue}</Label>);
  }

  private renderNewOrEditForm() {
    return (<TextField onChanged={(newValue) => this.props.saveFieldData(this.props.InternalName, newValue)} value={this.props.FormFieldValue} />);
  }
}