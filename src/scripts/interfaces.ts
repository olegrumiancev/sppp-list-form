import { ActionCreator, Action } from "redux";
import { SPRest } from "@pnp/sp";
import { IPersonaProps } from "office-ui-fabric-react/lib/Persona";

export interface IFormMode {
  New: number,
  Display: number,
  Edit: number
}

export const FormMode: IFormMode = {
  New: 1, Display: 2, Edit: 3
}

export interface IFieldInfo {
  Title: string;
  InternalName: string;
  EntityPropertyName: string;
  IsMulti: boolean;
  IsHidden: boolean;
  IsRequired: boolean;
  FormFieldValue: any;
  Type: string;
  Description: string;
  FieldRenderingComponent: JSX.Element;
  Choices?: string[];
}

export interface IListFormState {
    Fields: IFieldInfo[];
    CurrentListId?: string;
    CurrentItemId?: number;
    SpWebUrl?: string;
    CurrentMode: number;
    IsLoading?: boolean;
    IsSaving?: boolean;
    pnpSPRest?: SPRest;
}

export interface IListFormProps extends IListFormState {
  loadItem: ActionCreator<Action>;
  openEditMode: ActionCreator<Action>;
  closeForm: ActionCreator<Action>;
  saveFormData: ActionCreator<Action>;
}

export interface IFieldProps extends IFieldInfo {
  CurrentMode: number;
  pnpSPRest: SPRest;
  resolveFieldRenderingControl?(fieldProps: IFieldProps, className: string, cssProps: React.CSSProperties): JSX.Element;
  saveFieldData?(fieldInternalName: string, newValue: any): void;
}

export interface IFieldUpdate {
  fieldInternalName: string;
  newValue: any;
}

export class FormAction implements Action {
    public type: any;
    public payload: number | string | boolean | IFieldInfo[] | IFieldInfo | IFieldUpdate | SPRest ;
}

export interface IPeoplePickerState {
  peopleList: IPersonaProps[];
  mostRecentlyUsed: IPersonaProps[];
  currentSelectedItems: any[];
}

export const getQueryString = (url, field) => {
  var href = url ? url : window.location.href;
  var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
  var string = reg.exec(href);
  return string ? string[1] : null;
}

export const executeSPQuery = async (ctx: SP.ClientRuntimeContext): Promise<any> => {
  let promise = new Promise<any>((resolve, reject) => {
    ctx.executeQueryAsync((sender, args) => {
      resolve();
    }, (sender, args) => {
      reject(args.get_message());
    })
  });
  return promise;
}