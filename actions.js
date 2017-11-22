import {
    FORM_INITIALIZED,
    CHANGE_FIELD,
    SUBMIT_FORM,
    SUBMITTED_FORM
} from './constants';

export function initializeValues(id, fieldData) {
  return {
    type: FORM_INITIALIZED,
    id,
    fieldData,
  };
}

export function changeField(id, property, value) {
  return {
    type: CHANGE_FIELD,
    id,
    property,
    value,
  };
}

export function submitForm(formValues, validation, id, callbackAction) {
  return {
    type: SUBMIT_FORM,
    formValues,
    validation,
    id,
    callbackAction
  };
}

export function formSubmitted(isValid, formValues) {
  return {
    type: SUBMITTED_FORM,
    formValues,
    isValid
  };
}
