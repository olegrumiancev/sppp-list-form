import * as React from 'react';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IListFormProps, FormMode } from '../../interfaces';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import FormFieldRow from '../containers/FormFieldRow';
import FormHeader from './FormHeader';

export default class ListForm extends React.Component<IListFormProps, void> {
  private localContext: SP.ClientContext;

  public constructor(props) {
    super(props);
    this.localContext = SP.ClientContext.get_current();
    initializeIcons();
  }

  public render() {
    let commandBarItems = [
      {
        className: "ms-bgColor-neutral",
        key: "save",
        name: "Save",
        iconProps: {
          iconName: 'Save'
        },
        onClick: () => {
          this.props.saveFormData();
        }
      }
    ];

    //console.log(`fields from render:`);
    //console.log(this.props.Fields);
    if (this.props.IsLoading) {
      return (<div className="formContainer"><Spinner title="Loading..." /></div>);
    }

    return (
      <div className="formContainer">
        <FormHeader {...this.props} />
        <CommandBar isSearchBoxVisible={false}
          items={this.props.CurrentMode == FormMode.Display ? [] : commandBarItems}
          farItems={[
            {
              className: "ms-bgColor-neutral",
              key: "close",
              name: "Close",
              iconProps: {
                iconName: 'RemoveFilter'
              },
              onClick: () => {
                this.props.closeForm()
              }
            }
          ]}
        />
        {this.props.Fields.map(f => {
          return <FormFieldRow InternalName={f.InternalName} key={f.InternalName} />;
        })}
      </div>);
    }

    public componentDidMount() {
      this.props.loadItem();
    }
  }
