import * as React from "react";
import { IFieldProps, FormMode } from "../../interfaces";
import BaseFieldRenderer from "./BaseFieldRenderer";

export default class FieldUserRenderer extends BaseFieldRenderer {
  public constructor(props) {
    super(props);

  }

  protected renderNewForm() {
    return (<div>in new form</div>);
  }

  protected renderEditForm() {
    return (<div>in edit form</div>);
  }

  protected renderDispForm() {
    return (<div>in disp form</div>);
  }
}