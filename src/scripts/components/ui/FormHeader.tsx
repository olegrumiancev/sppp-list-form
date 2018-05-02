import { FormMode, IListFormProps } from "../../interfaces";
import { Label } from 'office-ui-fabric-react/lib/Label';
import * as React from "react";

export default class FieldTextRenderer extends React.Component<IListFormProps, {}> {
  public constructor(props) {
    super(props);

  }

  public render() {
    let headerText;
    let titleFieldInfo = this.props.Fields.filter(f => f.InternalName == "Title");

    if (this.props.CurrentMode == FormMode.New) {
      headerText = 'New item';
    } else {
      headerText = `form for ${titleFieldInfo == null || titleFieldInfo[0].FormFieldValue == null ? "(no title)" : titleFieldInfo[0].FormFieldValue}`;
      headerText = `${this.props.CurrentMode == FormMode.Edit ? "Edit" : "Display"} ${headerText}`;
    }
    return (<Label className="formHeader">{headerText}</Label>);
  }
}