/// <reference path="../../../node_modules/@types/sharepoint/index.d.ts" />
require('core-js/shim');
require('es6-set/implement');

import ActionTypes from '../actionTypes';
import { IFieldInfo, IListFormState, FormAction, FormMode, IFieldUpdate } from '../interfaces';
import { Action, ActionCreator, Dispatch, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { sp } from '@pnp/sp';
import BaseFieldRenderer from '../components/ui/BaseFieldRenderer';
import { FieldTextRenderer, FieldUserRenderer } from '../components/containers/RendererContainers';
import * as React from 'react';

export const changeSelection: ActionCreator<Action> = (selectedItemIndex: number) => ({
  type: ActionTypes.CLICK_ITEM,
  payload: selectedItemIndex
});

export const setItems: ActionCreator<Action> = (items: IFieldInfo[]) => ({
  type: ActionTypes.SET_ITEMS,
  payload: items
});

export const setLoading: ActionCreator<Action> = (isLoading: boolean) => ({
  type: ActionTypes.SET_LOADING,
  payload: isLoading
});

export const getFormDigest: ActionCreator<Action> = () => ({
  type: ActionTypes.GET_FORM_DIGEST
});

export const saveFormData: ActionCreator<ThunkAction<Promise<void>, IListFormState, void>> = () => {
  return async (dispatch: Dispatch<FormAction, IListFormState>, getState: () => IListFormState): Promise<void> => {
    let state = getState();
    console.log(`--- SAVING ---`);
    state.Fields.forEach(f => {
      console.log(`Field: ${f.Title} value: ${f.FormFieldValue}`);
    });
  }
}

export const setFieldValue: ActionCreator<Action> = (fieldInternalName: string, newValue: any) => ({
  type: ActionTypes.UPDATE_FIELD_VALUE,
  payload: {fieldInternalName, newValue} as IFieldUpdate
});

export const loadItem: ActionCreator<ThunkAction<Promise<void>, IListFormState, void>> = () => {
  return async (dispatch: Dispatch<FormAction, IListFormState>, getState: () => IListFormState): Promise<void> => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const state = getState();
      if (state.CurrentListId == null) {
        handleError("ListID is not specified.", dispatch);
        return;
      }

      if (state.SpWebUrl == null) {
        handleError("WebUrl is not specified.", dispatch);
        return;
      }

      console.log(state.SpWebUrl);

      initPnp(state.SpWebUrl);

      let list = sp.web.lists.getById(state.CurrentListId);

      list.fields.filter("ReadOnlyField eq false and Hidden eq false and Title ne 'Content Type'").get().then((listFields: any[]) => {
        console.log(listFields);

        let currentItem = null;
        if (state.CurrentMode == FormMode.New) {
          // handle new form
          // ...
          setItemState(state, listFields, null, dispatch);
        } else {
          list.items.getById(state.CurrentItemId).get().then(item => {
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


// HELPERS
const initPnp = (webUrl: string) => {
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: webUrl
    }
  });
};

const getFieldRenderingControl = (state: IListFormState, fieldMetadata: IFieldInfo, item: any, className: string, cssProps: React.CSSProperties): JSX.Element => {
  if (item != null) {
    fieldMetadata.FormFieldValue = item[fieldMetadata.InternalName];
  }

  const defaultElement = (<BaseFieldRenderer {...fieldMetadata} CurrentMode={state.CurrentMode}  />);
  if (fieldMetadata.Type == "Text") {
    return <FieldTextRenderer {...fieldMetadata} CurrentMode={state.CurrentMode} />
  }
  if (fieldMetadata.Type.match(/User/gi)) {
    return <FieldUserRenderer  {...fieldMetadata} CurrentMode={state.CurrentMode} />
  }
  return defaultElement;
}

const setItemState = (state: IListFormState, listFields: any[], item: any, dispatch: any) => {
  let fieldInfos = listFields.map((r, i) => {
    let fieldInfo = {
      Title: r.Title,
      InternalName: r.InternalName,
      IsHidden: r.Hidden,
      IsRequired: r.Required,
      IsMulti: false,
      FormFieldValue: null,
      Type: r.TypeAsString,
      Description: r.Description,
      FieldRenderingComponent: null
    } as IFieldInfo;
    fieldInfo.FieldRenderingComponent = getFieldRenderingControl(state, fieldInfo, item, null, null);
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
  dispatch({ type: ActionTypes.SET_LOADING, payload: false });
}