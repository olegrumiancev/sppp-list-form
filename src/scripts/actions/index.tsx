/// <reference path="../../../node_modules/@types/sharepoint/index.d.ts" />
import * as React from 'react';
import ActionTypes from '../actionTypes';
import { IFieldInfo, IListFormState, FormAction, FormMode, IFieldUpdate, IFieldProps } from '../interfaces';
import { Action, ActionCreator, Dispatch, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { BaseFieldRenderer, FieldTextRenderer, FieldUserRenderer, FieldChoiceRenderer } from '../components/containers/RendererContainers';
import { saveHelper } from '../utils/saveHelper';
import { ItemUpdateResult, ItemAddResult } from '@pnp/sp';

export const setLoading: ActionCreator<Action> = (isLoading: boolean) => ({
  type: ActionTypes.SET_LOADING,
  payload: isLoading
});

export const setCurrentMode:ActionCreator<ThunkAction<Promise<void>, IListFormState, void>> = () => {
  return async (dispatch: Dispatch<FormAction, IListFormState>, getState: () => IListFormState): Promise<void> => {
    dispatch({ type: ActionTypes.SET_CURRENT_MODE, payload: FormMode.Edit });

    let state = getState();
    let newFieldInfos = state.Fields.map(f => {
      //f.FieldRenderingComponent = getFieldRenderingControl(state, f, null, null, null);
      return f;
    });
    dispatch({type: ActionTypes.SET_FORM_FIELDS, payload: newFieldInfos});
  }
}

export const saveFormData: ActionCreator<ThunkAction<Promise<void>, IListFormState, void>> = () => {
  return async (dispatch: Dispatch<FormAction, IListFormState>, getState: () => IListFormState): Promise<void> => {
    dispatch({type: ActionTypes.SET_SAVING, payload: true});
    let state = getState();
    console.log(`--- SAVING ---`);
    state.Fields.forEach(f => {
      console.log(`Field: ${f.Title} value: ${JSON.stringify(f.FormFieldValue)}`);
    });

    let newProperties = {};
    for (let fi of state.Fields) {
      newProperties = saveHelper.preProcessFieldValueForSaving(newProperties, fi);
    }

   console.log(newProperties);

    let itemCollection = state.pnpSPRest.web.lists.getById(state.CurrentListId).items;
    let action: Promise<ItemUpdateResult | ItemAddResult> = null;
    if (state.CurrentMode == FormMode.New) {
      action = itemCollection.add(newProperties);
    } else {
      action = itemCollection.getById(state.CurrentItemId).update(newProperties);
    }

console.log(newProperties);

    action.then((res: ItemAddResult | ItemUpdateResult) => {
      console.log(JSON.stringify(res));
      dispatch({type: ActionTypes.SET_SAVING, payload: false});
      dispatch({type: ActionTypes.SET_CURRENT_MODE, payload: FormMode.Display});
    }).catch(e => handleError(e, dispatch));
  }
}

export const setFieldValue: ActionCreator<Action> = (fieldInternalName: string, newValue: any) => ({
  type: ActionTypes.UPDATE_FIELD_VALUE,
  payload: {fieldInternalName, newValue} as IFieldUpdate
});

export const loadItem: ActionCreator<ThunkAction<Promise<void>, IListFormState, void>> = () => {
  return async (dispatch: Dispatch<FormAction, IListFormState>, getState: () => IListFormState): Promise<void> => {
    try {
      dispatch({type: ActionTypes.SET_LOADING, payload: true});
      const state = getState();
      if (state.CurrentListId == null) {
        handleError("ListID is not specified.", dispatch);
        return;
      }

      if (state.SpWebUrl == null) {
        handleError("WebUrl is not specified.", dispatch);
        return;
      }

      console.log(`current web url: ${state.SpWebUrl}`);

      let list = state.pnpSPRest.web.lists.getById(state.CurrentListId);

      list.fields.filter("ReadOnlyField eq false and Hidden eq false and Title ne 'Content Type'").get().then((listFields: any[]) => {
        console.log(listFields);

        let toSelect = [];
        let toExpand = [];
        for (let f of listFields) {
          if (f.TypeAsString.match(/user/gi)) {
            toSelect.push(`${f.EntityPropertyName}/Title`);
            toSelect.push(`${f.EntityPropertyName}/Id`);
            toExpand.push(f.EntityPropertyName);
          } else if (f.TypeAsString.match(/lookup/gi)) {
            toSelect.push(`${f.EntityPropertyName}/Title`);
            toSelect.push(`${f.EntityPropertyName}/Id`);
            toExpand.push(f.EntityPropertyName);
          } else {
            toSelect.push(f.EntityPropertyName);
          }
        }

        let currentItem = null;
        if (state.CurrentMode == FormMode.New) {
          // handle new form
          // ...
          setItemState(state, listFields, null, dispatch);
        } else {
          list.items.getById(state.CurrentItemId).select(...toSelect).expand(...toExpand).get().then(item => {
            console.log(item);
            setItemState(state, listFields, item, dispatch);
          }).catch(e => handleError(e, dispatch));
        }
      }).catch(e => handleError(e, dispatch));
    } catch (e) {
      handleError(e, dispatch);
    }
  };
};

//export const getFieldRenderingControl = (state: IListFormState, fieldMetadata: IFieldProps, item: any, className: string, cssProps: React.CSSProperties): JSX.Element => {
export const resolveFieldRenderingControl = (fieldProps: IFieldProps, className: string, cssProps: React.CSSProperties): JSX.Element => {
  const defaultElement = (<BaseFieldRenderer {...fieldProps} />);
  if (fieldProps.Type == "Text") {
    return <FieldTextRenderer {...fieldProps} />
  }
  if (fieldProps.Type.match(/user/gi)) {
    return <FieldUserRenderer  {...fieldProps} />
  }
  if (fieldProps.Type.match(/choice/gi)) {
    return <FieldChoiceRenderer  {...fieldProps} />
  }
  return defaultElement;
}

// HELPERS
const setItemState = (state: IListFormState, listFields: any[], item: any, dispatch: any) => {
  let fieldInfos = listFields.map((r, i) => {
    let fieldInfo = {
      Title: r.Title,
      InternalName: r.InternalName,
      EntityPropertyName: r.EntityPropertyName,
      IsHidden: r.Hidden,
      IsRequired: r.Required,
      IsMulti: r.TypeAsString.match(/multi/gi),
      FormFieldValue: null,
      Type: r.TypeAsString,
      Description: r.Description,
      FieldRenderingComponent: null,
      Choices: r.Choices == null ? undefined : r.Choices.results
    } as IFieldInfo;

    if (item != null && item[fieldInfo.InternalName] != null && item[fieldInfo.InternalName]["__deferred"] == null) {
      fieldInfo.FormFieldValue = item[fieldInfo.InternalName];
    }
    return fieldInfo;
  });

  dispatch({
    type: ActionTypes.SET_FORM_FIELDS,
    payload: fieldInfos
  });

  dispatch({type: ActionTypes.SET_LOADING, payload: false});
}

const handleError = (msg: string, dispatch: any) => {
  console.error(msg);
  dispatch({type: ActionTypes.SET_LOADING, payload: false});
}