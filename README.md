# react-form-container
A Higher Order Component (HOC) for handling dynamic forms with React, Redux, Sagas and Reselect

## Requirements

This library expects that you are using [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate). 

You can optionally include the presentational components located at []() or roll your own. 

The validation utility script located at []().

## Installation

Pleas be sure you have the requirements mentioned in the previous section installed.

We recommending forking this repository and using as a submodule. To use as a git submodule in your project, navigate to your containers directory and run:

    git submodule add git@github.com:source4societyorg/react-form-container.git

Replace the url with the url of your fork as needed.

Package is available via npm:

    npm install react-form-container

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
        submitLabel="Log In"
    />

