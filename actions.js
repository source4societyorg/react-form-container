import {
    FORM_INITIALIZED,
    CHANGE_FIELD,
    SUBMIT_FORM,
    SUBMITTED_FORM,
    VALIDATION_ERRORS,
    CLEAR_FORM,
    FETCHED_FORM_DATA,
    BLUR_FIELD,
    FOCUS_FIELD,
} from './constants';

export function initializeValues(id, fieldData, reducerKey = 'form') {
  return {
    type: FORM_INITIALIZED,
    id,
    fieldData,
    reducerKey,
  };
}

export function changeField(id, property, value, checked, target, reducerKey = 'form') {
  return {
    type: CHANGE_FIELD,
    id,
    property,
    value,
    checked,
    target,
    reducerKey,
  };
}

export function submitForm(formValues, validation, id, callbackAction, fieldData, reducerKey = 'form') {  
  return {
    type: SUBMIT_FORM,
    formValues,
    validation,
    id,
    callbackAction,
    fieldData,
    reducerKey,
  };
}

export function formSubmitted(isValid, formValues, reducerKey = 'form') {
  return {
    type: SUBMITTED_FORM,
    formValues,
    isValid,
    reducerKey,
  };
}

export function setValidationErrors(errors, formTitle, formValues, reducerKey = 'form') {
  return {
    type: VALIDATION_ERRORS,
    errors,
    formTitle,
    formValues,
    reducerKey,
  }
}

export function clearForm(fieldData, id, reducerKey = 'form') {
  return {
    type: CLEAR_FORM,
    fieldData,
    id,
    reducerKey
  }
}

export function fetchedFormData(formData, reducerKey, fieldData, id) {
  return {
    type: FETCHED_FORM_DATA,
    formData,
    reducerKey,
    fieldData,
    id,
  }
}

export function blurField(event, formTitle, reducerKey, property, formValues) {
  return {
    type: BLUR_FIELD,
    event,
    formTitle,
    reducerKey,
    property,
    formValues,
  }
}

export function focusField(event, formTitle, reducerKey, property, formValues) {
  return {
    type: FOCUS_FIELD,
    event,
    formTitle,
    reducerKey,
    property,
    formValues,
  }
}
