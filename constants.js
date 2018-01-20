import { fromJS, Map as ImmutableMap } from 'immutable';
import utilities from '@source4society/scepter-utility-lib'
export const FORM_INITIALIZED = 'source4society/react-form-container/FORM_INITIALIZED';
export const FETCHED_FORM_DATA = 'source4society/ract-form-container/FETCHED_FORM_DATA';
export const CHANGE_FIELD = 'source4society/react-form-container/CHANGE_FIELD';
export const SUBMIT_FORM = 'source4society/react-form-container/SUBMIT_FORM';
export const SUBMITTED_FORM = 'source4society/react-form-container/SUBMITTED_FORM';
export const VALIDATION_ERRORS = 'source4society/react-form-container/VALIDATION_ERRORS';
export const CLEAR_FORM = 'source4society/react-form-contaner/CLEAR_FORM';
export const DEFAULT_LOCALE = 'en';

export const setFieldDataValues = (formData, fieldData) => {
  
  let updatedFieldData = fieldData
  for ( let field of fieldData.get('data') ) {
    let valueData = formData[field[0]];
    if (!utilities.isEmpty(valueData)) {
      let checkedData = field[1].get('widget', 'text') === 'checkbox' ? formData[field[0]] : (!utilities.isEmpty(fieldData.get('views')) && !utilities.isEmpty(fieldData.getIn(['views',field[0]])) ? fieldData.getIn(['views',field[0], 'value']) || false : false );
      updatedFieldData = updatedFieldData.setIn(['views',field[0]], ImmutableMap({ value: valueData, isValid: true, checked: checkedData }));
    }
  }

  return updatedFieldData;
}

