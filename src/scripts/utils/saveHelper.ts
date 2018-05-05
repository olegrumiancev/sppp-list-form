import { IFieldInfo } from "../interfaces";

export const saveHelper = {
  preProcessFieldValueForSaving: (newProperties: {}, fieldInfo: IFieldInfo): any => {
    if (fieldInfo == null || fieldInfo.FormFieldValue == null) {
      return newProperties;
    }

    //console.log(fieldInfo)
    if (fieldInfo.Type.match(/user/gi) || fieldInfo.Type.match(/lookup/gi)) {
      let result = null;
      if (fieldInfo.FormFieldValue != null) {
        if (!fieldInfo.IsMulti) {
          result = fieldInfo.FormFieldValue.Id;
        } else if (fieldInfo.FormFieldValue.results != null && fieldInfo.FormFieldValue.results.length > 0) {
          result = {results: fieldInfo.FormFieldValue.results.map(r => parseInt(r.Id))};
        }
        newProperties[`${fieldInfo.EntityPropertyName}Id`] = result == null ? undefined : result;
      }
    } else {
      newProperties[fieldInfo.EntityPropertyName] = fieldInfo.FormFieldValue == null ? undefined : fieldInfo.FormFieldValue;
    }

    return newProperties;
  }
};