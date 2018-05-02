import { ActionCreator, Action } from "redux";

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
  IsMulti: boolean;
  IsHidden: boolean;
  IsRequired: boolean;
  FormFieldValue: any;
  Type: string;
  Description: string;
  FieldRenderingComponent: JSX.Element;
}

export interface IListFormState {
    Fields: IFieldInfo[];
    CurrentListId?: string;
    CurrentItemId?: number;
    SpWebUrl?: string;
    CurrentMode: number;

    Digest?: string;
    IsLoading?: boolean;
}

export interface IListFormProps extends IListFormState {
  loadItem: ActionCreator<Action>;
  closeForm: ActionCreator<Action>;
  saveFormData: ActionCreator<Action>;
}

export interface IFieldProps extends IFieldInfo {
  CurrentMode: number;
  saveFieldData?(fieldInternalName: string, newValue: any): void;
}

export interface IFieldUpdate {
  fieldInternalName: string;
  newValue: any;
}

export class FormAction implements Action {
    public type: any;
    public payload: number | string | boolean | IFieldInfo[] | IFieldInfo | IFieldUpdate ;
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