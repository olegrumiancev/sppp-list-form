import { applyMiddleware, createStore, Middleware, MiddlewareAPI, Store, StoreCreator, AnyAction } from 'redux';
import { SPRest } from '@pnp/sp';
import thunk from 'redux-thunk';
import appReducer from './reducers';
import { IListFormState, FormAction, IFieldInfo } from './interfaces';

function isApi(m: any): m is MiddlewareAPI<IListFormState> {
  return true;
}

export type MiddlewareFunction = (api: MiddlewareAPI<IListFormState>, next: (action: FormAction) => FormAction, action: FormAction) => FormAction;

export function handleAction(f: MiddlewareFunction): Middleware {
  return <S>(api: MiddlewareAPI<S>) => next => action => {
    if (isApi(api)) {
      // Force cast of generic A to my Action
      const _action = (<FormAction> action);
      const _next: (action: FormAction) => FormAction = a => {
        return next(<any> a);
      };
      return f(api, _next, _action) as any;
    } else {
      return next(action);
    }
  };
}

export function consoleMessages(): Middleware {
  return handleAction((api, next, action) => {
    //return next(action);

    console.groupCollapsed(`dispatching action => ${action.type}`);
    let result = next(action);

    const state = api.getState();
    console.log(state);

    console.groupEnd();

    return result;
  });
}

// Trick to enable Redux DevTools with TS: see https://www.npmjs.com/package/redux-ts
const devTool = (f: StoreCreator) => {
  // tslint:disable-next-line:no-any
  return ((window as any).__REDUX_DEVTOOLS_EXTENSION__) ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ : f;
};

export default (initialState = {}) => {
  return applyMiddleware(thunk, consoleMessages())(devTool(createStore))(appReducer, initialState);
};
