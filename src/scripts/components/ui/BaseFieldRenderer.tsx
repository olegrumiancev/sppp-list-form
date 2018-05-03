import * as React from "react";
import { IFieldProps, FormMode } from "../../interfaces";

export default class BaseFieldRenderer extends React.Component<IFieldProps, {}> {
  public constructor(props) {
    super(props);

  }

  public render() {
    if (this.props.CurrentMode == FormMode.New) {
      return this.renderNewForm();
    }
    if (this.props.CurrentMode == FormMode.Edit) {
      return this.renderEditForm();
    }
    if (this.props.CurrentMode == FormMode.Display) {
      return this.renderDispForm();
    }
  }

  protected renderNewForm() {
    return (<div>Not implemented, field type: {this.props.Type}, form mode: new</div>);
  }

  protected renderEditForm() {
    return (<div>Not implemented, field type: {this.props.Type}, form mode: edit</div>);
  }

  protected renderDispForm() {
    return (<div>Not implemented, field type: {this.props.Type}, form mode: disp</div>);
  }
}