import * as React from "react";
import { IFieldProps, FormMode, IPeoplePickerState } from "../../interfaces";
import BaseFieldRenderer from "./BaseFieldRenderer";
import { Label } from "office-ui-fabric-react/lib/Label";
import { NormalPeoplePicker, IBasePicker, ValidationState } from "office-ui-fabric-react/lib/Pickers";
import { IPersonaProps } from "office-ui-fabric-react/lib/Persona";
import { WebEnsureUserResult } from "@pnp/sp";

export default class FieldUserRenderer extends BaseFieldRenderer {
  public constructor(props: IFieldProps) {
    super(props);

    let vals = [];
    // if (this.props.FormFieldValue != null) {
    //   if (Array.isArray(this.props.FormFieldValue)) {
    //     vals = this.props.FormFieldValue;
    //   } else {
    //     vals.push(this.props.FormFieldValue);
    //   }
    // }
    if (this.props.FormFieldValue != null) {
      if (this.props.IsMulti) {
        vals = this.props.FormFieldValue.results;
      } else {
        vals.push(this.props.FormFieldValue);
      }
    }


    console.log(vals);
    let selectedValues: IPersonaProps[] = [];
    for (let v of vals) {
      if (v != null) {
        selectedValues.push({
          primaryText: v.Title,
          id: v.Id.toString()
        });
      }
    }

    this.state = {
      peopleList: [],
      currentSelectedItems: selectedValues,
      mostRecentlyUsed: []
    } as IPeoplePickerState;
  }

  public componentDidMount() {
    this.saveDataInternal();
  }

  protected renderNewForm() {
    return this.renderNewOrEditForm();
  }

  protected renderEditForm() {
    return this.renderNewOrEditForm();
  }

  protected renderDispForm() {
    if (this.props.FormFieldValue == null) {
      return <div></div>;
    }

    return (
      <div>
        {this.state.currentSelectedItems.map((m, i) => {
          return <Label key={`${m.id}_${i}`}>{m.primaryText}</Label>
        })}
      </div>
    );
  }

  private renderNewOrEditForm() {
    return (<div>
      <NormalPeoplePicker
        itemLimit={this.props.IsMulti ? undefined : 1}
        selectedItems={this.state.currentSelectedItems}
        onResolveSuggestions={this.onFilterChanged}
        getTextFromItem={this.getTextFromItem}
        pickerSuggestionsProps={{searchingText: "Searching more.."}}
        className={'ms-PeoplePicker'}
        key={`${this.props.InternalName}_normalpicker`}
        onRemoveSuggestion={this.onRemoveSuggestion}
        onValidateInput={this.validateInput}
        removeButtonAriaLabel={'Remove'}
        onChange={this.onItemsChange}
        searchingText={"Searching..."}
        inputProps={{
          placeholder: "Enter a name or email address"
        }}
        resolveDelay={300}
      />
    </div>);
  }

  private getTextFromItem(persona: IPersonaProps): string {
    return persona.primaryText as string;
  }

  private validateInput = (input: string): ValidationState => {
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    } else if (input.length > 1) {
      return ValidationState.warning;
    } else {
      return ValidationState.invalid;
    }
  }

  private onItemsChange = (items: any[]): void => {
    this.setState({
      currentSelectedItems: items
    }, () => {
      this.saveDataInternal();
    });
  }

  private onRemoveSuggestion = (item: IPersonaProps): void => {
    const { peopleList, mostRecentlyUsed: mruState } = this.state;
    const indexPeopleList: number = peopleList.indexOf(item);
    const indexMostRecentlyUsed: number = mruState.indexOf(item);

    if (indexPeopleList >= 0) {
      const newPeople: IPersonaProps[] = peopleList.slice(0, indexPeopleList).concat(peopleList.slice(indexPeopleList + 1));
      this.setState({ peopleList: newPeople });
    }

    if (indexMostRecentlyUsed >= 0) {
      const newSuggestedPeople: IPersonaProps[] = mruState.slice(0, indexMostRecentlyUsed).concat(mruState.slice(indexMostRecentlyUsed + 1));
      this.setState({ mostRecentlyUsed: newSuggestedPeople });
    }
  }

  private onFilterChanged = (filterText: string, currentPersonas: IPersonaProps[], limitResults?: number): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      let p = new Promise<IPersonaProps[]>((resolve, reject) => {
        this.props.pnpSPRest.profiles.clientPeoplePickerSearchUser({
          QueryString: filterText,
          MaximumEntitySuggestions: 10,
          AllowMultipleEntities: false,
          PrincipalSource: 15,
          PrincipalType: 15,
          AllUrlZones: true,
          AllowEmailAddresses: true

        }).then((entries) => {
          let promises: Promise<WebEnsureUserResult>[] = [];
          let resolvedPersonas: IPersonaProps[] = [];
          for (let entry of entries) {
            if (entry.IsResolved) {
              let p = this.props.pnpSPRest.web.ensureUser(entry.Key);
              promises.push(p);
              p.then((result: WebEnsureUserResult) => {
                resolvedPersonas.push({
                  primaryText: result.data.Title,
                  id: result.data.Id.toString()
                });
              });
            }
          }

          Promise.all(promises).then(() => {
            resolve(resolvedPersonas);
          }).catch(e => reject(e));
        }).catch(e => reject(e));
      });

      p.catch(e => {
        console.info(e);
      });

      return p;
    } else {
      return [];
    }
  }

  private saveDataInternal = () => {
    let result = this.state.currentSelectedItems.map((persona: IPersonaProps) => {
      return {
        Title: persona.primaryText,
        Id: persona.id
      }
    });

    if (this.props.IsMulti) {
      result = {results: result};
    }
    else {
      if (this.state.currentSelectedItems.length > 0) {
        result = {
          Title: this.state.currentSelectedItems[0].primaryText,
          Id: this.state.currentSelectedItems[0].id
        };
      } else {
        result = null;
      }
    }
    this.props.saveFieldData(this.props.InternalName, result);
  }
}