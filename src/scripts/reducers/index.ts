require('core-js/shim');
require('es6-set/implement');
import { IListFormState, IFieldInfo, FormAction, IFieldUpdate } from '../interfaces';
import ActionTypes from '../actionTypes';
import { ThunkAction } from 'redux-thunk';
import { Reducer, Action, combineReducers, AnyAction } from 'redux';

const CurrentMode: Reducer<number> = (state: number = null, action: FormAction) => {
  switch (action.type) {
    case ActionTypes.GET_CURRENT_MODE:
      return action.payload as number;
    default:
      return state;
  }
};

const Fields: Reducer<IFieldInfo[]> = (state: IFieldInfo[] = [], action: FormAction) => {
  switch (action.type) {
    case ActionTypes.SET_FORM_FIELDS:
      return action.payload as IFieldInfo[];
    case ActionTypes.UPDATE_FIELD_VALUE:
      let fi = action.payload as IFieldUpdate;
      if (fi != null) {
        let fieldInfoToUpdate = state.filter(f => f.InternalName == fi.fieldInternalName);
        if (fieldInfoToUpdate != null) {
          fieldInfoToUpdate[0].FormFieldValue = fi.newValue;
        }
      }
      return state;
    default:
      return state;
  }
};

const CurrentListId: Reducer<string> = (state: string = null, action: FormAction) => {
  switch (action.type) {
    case ActionTypes.GET_CURRENT_LIST_ID:
      return action.payload as string;
    default:
      return state;
  }
};

const CurrentItemId: Reducer<number> = (state: number = null, action: FormAction) => {
  switch (action.type) {
    case ActionTypes.GET_CURRENT_LISTITEM_ID:
      return action.payload as number;
    default:
      return state;
  }
};

const SpListTitle: Reducer<string> = (state: string = null, action: FormAction) => {
  switch (action.type) {
    case ActionTypes.SET_LIST_TITLE:
      return action.payload as string;
    default:
      return state;
  }
};

const SpWebUrl: Reducer<string> = (state: string = null, action: FormAction) => {
  switch (action.type) {
    case ActionTypes.SET_LIST_TITLE:
      return action.payload as string;
    default:
      return state;
  }
}

const Digest: Reducer<string> = (state: string = null, action: FormAction) => {
  switch (action.type) {
    case ActionTypes.GET_FORM_DIGEST:
      return document.getElementById('__REQUESTDIGEST').getAttribute('value') as string;
    default:
      return state;
  }
}

const IsLoading: Reducer<boolean> = (state: boolean = false, action: FormAction) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return action.payload as boolean;
    default:
      return state;
  }
}

export default combineReducers({
  Fields,
  CurrentListId,
  CurrentItemId,
  CurrentMode,
  SpWebUrl,
  Digest,
  IsLoading
});