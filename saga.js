import { call, put, takeLatest } from 'redux-saga/effects';
import { SUBMIT_FORM, SUBMITTED_FORM } from './constants';
import { formSubmitted } from './actions';
import validators from './validators';
import { fromJS, Map as ImmutableMap } from 'immutable';

export function* validateFormData(action) { 
  let clonedFormValues = action.formValues;
  let isValid = true;  
  action.formValues.get(action.id, {}).keySeq().forEach((field, fieldIndex) => {
    if (action.fieldData.getIn(['data', field, 'widget'], 'text') !== 'divider') {
      let validationMessage = '';
      const propertyOrder = action.fieldData.getIn(['data',field,'propertyOrder'], 0);
      if(propertyOrder > 0) {
        const validatorConfig = action.validation[propertyOrder-1] || [];     
        let areAllValidatorsValid = true; 
        for (let configIndex = 0; configIndex < validatorConfig.length; configIndex += 1) {
          const value = clonedFormValues.getIn([action.id, field, 'value'], '');
          const isFieldValid = validators[validatorConfig[configIndex].validationType](value);
          validationMessage += isFieldValid ? '' : `${validatorConfig[configIndex].invalidMessage}. `;
          if (!isFieldValid) {
            isValid = false;
            areAllValidatorsValid = false
          }
          clonedFormValues = clonedFormValues.setIn([action.id, field], ImmutableMap({ value, isValid: areAllValidatorsValid, validationMessage }));
        } 
      }             
    }
  });  

  yield put(formSubmitted(isValid, clonedFormValues));
  if( typeof action.callbackAction !== 'undefined') {
     yield put(action.callbackAction(isValid, clonedFormValues));
  }
}

export default function* validateData() {
  yield takeLatest(SUBMIT_FORM, validateFormData);
}
