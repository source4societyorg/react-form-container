import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import { initializeForm, changeField, submitForm } from './actions';
import Form from '../../components/Form';
import Field from '../../components/Form/Field';
import Button from '../../components/Button';
import {
    makeSelectFormValues,
    makeSelectIsValid,
} from './selectors';

export class FormContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    this.props.onMount(this.props.id, this.props.fieldData);
  }

  renderFields() {
    if (typeof this.props.fieldData !== 'undefined' && typeof this.props.fieldData.get('data') !== 'undefined') {
      return this.props.fieldData.get('data').keySeq().map((field, index) =>
        (<Field
          key={field}
          labelText={this.props.labels[index]}
          fieldType={this.props.fieldData.getIn(['data', field, 'widget'], 'text')}
          onChange={(evt) => this.props.onChangeFieldValue(evt, field)}
          value={this.props.formValues.getIn([this.props.id, field, 'value'], '')}
          isValid={this.props.formValues.getIn([this.props.id, field, 'isValid'])}
          validationMessage={this.props.formValues.getIn([this.props.id, field, 'validationMessage'])}
        />)
        );
    }

    return null;
  }

  renderSubmit() {
    if (typeof this.props.submitLabel !== 'undefined') {
      return <Button label={this.props.submitLabel} onClick={(evt) => this.props.onSubmit(evt, this.props.id)} />;
    }

    return null;
  }

  render() {
    return (
      <Form id={this.props.id} onSubmit={(evt) => this.props.onSubmit(evt, this.props.id)}>
        {this.renderFields()}
        {this.renderSubmit()}
      </Form>
    );
  }

}

FormContainer.propTypes = {
  id: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  fieldData: PropTypes.object,
  formValues: PropTypes.object,
  submitLabel: PropTypes.string,
  onMount: PropTypes.func,
  onChangeFieldValue: PropTypes.func,
  onSubmit: PropTypes.func,
};

FormContainer.defaultProps = {
  id: '',
  endpoint: '',
  submitLabel: null,
  labels: [],
  validation: [],
};

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onMount: (id, fieldData) => dispatch(initializeForm(id, fieldData)),
  onChangeFieldValue: (evt, field) => dispatch(changeField(ownProps.id, field, evt.target.value)),
  onSubmit: (evt, id) => { evt.preventDefault(); return dispatch(submitForm(ownProps.validation, id)); },
});

const mapStateToProps = createStructuredSelector({
  formValues: makeSelectFormValues(),
  isValid: makeSelectIsValid(),
});

const withReducer = injectReducer({ key: 'form', reducer });
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withReducer,
  withConnect
)(FormContainer);
