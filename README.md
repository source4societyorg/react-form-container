# react-form-container
A Higher Order Component (HOC) for handling dynamic forms with React, Redux, Sagas and Reselect

## Requirements

This library expects that you are using [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate). 

You can optionally include the presentational components located at [source4societyorg/react-form-components](https://github.com/source4societyorg/react-form-components) or roll your own. 

Please be sure you have the following in your package.json:

    "dependencies": {
      "@source4society/scepter-utility-lib": "0.0.20",
      "@source4society/scepter-reducer-lib": "0.0.2",
      "babel-polyfill": "6.23.0",
      "immutable": "3.8.1",
      "intl": "1.2.5",
      "invariant": "2.2.2",
      "prop-types": "15.5.10",
      "react": "15.6.1",
      "react-dom": "15.6.1",
      "react-intl": "2.3.0",
      "react-loadable": "4.0.3",
      "react-redux": "5.0.5",
      "redux": "3.6.0",
      "redux-immutable": "4.0.0",
      "redux-saga": "0.15.3",
      "reselect": "3.0.1",
      "styled-components": "2.0.0",
      "warning": "3.0.0"
    }

## Installation

Pleas be sure you have the requirements mentioned in the previous section installed.

We recommending forking this repository and using as a submodule. To use as a git submodule in your project, navigate to your containers directory and run:

    git submodule add git@github.com:source4societyorg/react-form-container.git

Replace the url with the url of your fork as needed.

For more information on how to use submodules, refer to the [git submodule reference](https://git-scm.com/docs/git-submodule) and this article from [TechJini](http://www.techjini.com/blog/working-with-git-submodules/)

## Example

In your component that handles your page layout, import the FormContainer as follows:

    import FormContainer from '../FormContainer';

Then add the component `<FormContainer />` to your layout. An example is as follows:

    <FormContainer 
        id="login_form" 
        fieldData={{
            data: {
                username: {type: "string", title: "username", widget: "email", propertyOrder: 1},
                password: {type: "string", title: "password", widget: "password", propertyOrder: 2}
            },
            errors: [],
            view: []
        }}
        labels={['Username','Password']}
        validation={[
            [
                {
                    validationType: 'required',
                    invalidMessage: 'Username is required'                        
                },
                {
                    validationType: 'email',
                    invalidMessage: 'Username must be email'
                }
            ],
            [
                {
                    validationType: 'required',
                    invalidMessage: 'Password is required'
                }
            ]
        ]} 
        submitCallback={(isValid, formValues) => console.log('If form ' + isValid + ' then output ' + formValues)}
        submitLabel="Log In"
    />

