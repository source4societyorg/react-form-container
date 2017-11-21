import {
    FORM_INITIALIZED,
    CHANGE_FIELD,
    SUBMIT_FORM,
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

export function submitForm(validation, id) {
  return {
    type: SUBMIT_FORM,
    validation,
    id,
  };
}
