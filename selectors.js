/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectForm = (state) => state.get('form');

const makeSelectFormValues = () => createSelector(
  selectForm,
  (formState) => formState.get('formValues')
);

const makeSelectIsValid = () => createSelector(
  selectForm,
  (formState) => formState.get('isValid')
);

const makeSelectSubmitDisabled = () => createSelector(
  selectForm,
  (formState) => formState.get('submitDisabled')
);

export {
    selectForm,
    makeSelectFormValues,
    makeSelectIsValid,
    makeSelectSubmitDisabled,
};
