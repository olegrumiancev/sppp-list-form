import * as React from 'react';
import ListForm from './components/containers/ListForm';
import { Provider } from 'react-redux';
import appStoreCreator from './appStore';
import { IListFormState, FormMode, getQueryString, executeSPQuery } from './interfaces';
import { Store } from 'redux';

export class RootInternal extends React.Component<{}, { appStore: Store<IListFormState>}> {
  private localContext = null;
  public constructor(props) {
    super(props);
    this.localContext = SP.ClientContext.get_current();
    this.state = {
      appStore: null
    }
  }

  private createInitialState = async (): Promise<Store<IListFormState>> => {
    let currentWeb = this.localContext.get_web();
    this.localContext.load(currentWeb);
    await executeSPQuery(this.localContext);
    let webUrl = currentWeb.get_url();

    let appStore = appStoreCreator({
        Fields: [],
        CurrentMode: this.getFormMode(),
        CurrentListId: this.getCurrentListId(),
        CurrentItemId: this.getCurrentItemId(),
        SpWebUrl: webUrl,
        IsLoading: true
      } as IListFormState);
      window["appStore"] = appStore;
      return appStore;
  }

  private getFormMode = () => {
    console.log(`in getFormMode`);
    let fm = getQueryString(null, "fm");
    if (fm != null) {
        return parseInt(fm);
    }
    return FormMode.New;
  }

  private getCurrentListId = () => {
    return getQueryString(null, "listid");
  }

  private getCurrentItemId = () => {
    let itemid = getQueryString(null, "itemid")
    if (itemid == null) {
        return 0;
    } else {
        return parseInt(itemid);
    }
  }

  public componentDidMount() {
    const appStorePromise = this.createInitialState();
    appStorePromise.then(appStore => {
     this.setState({appStore})
    })
  }

  public render() {
    return (
      this.state.appStore == null ? null :
      <div>
        <Provider store={this.state.appStore}>
            <div>

              <ListForm />
            </div>
        </Provider>
    </div>
    );
  }
}

export default (
  //React.createElement(RootInternal)
  <RootInternal />
);