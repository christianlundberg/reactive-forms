# Reactive Forms

Easily create a representation of your forms and manage their state in React and React Native. 

### Installation

To install the latest version of reactive-forms, simply run:

```
npm install --save @clundberg1/reactive-forms
```

## Usage

### FormBuilder

This is a helper class that will get you a ```FormGroup``` instance. 

#### group

Pass it an object with the structure of your form. You can optionally pass it a Function or an Array of Functions which will validate at the FormGroup level. It returns an instance of FormGroup.

##### Arguments

+ controls : { [key: string]: any } (required)
+ validators : Function | Function[] (optional) 

##### Example

```javascript

import { FormBuilder } from '@clundberg1/reactive-forms';

...

constructor(props){
  super(props);
  
  const formBuilder = new FormBuilder();
  
  this.form = formBuilder.group({
      username: '',
      email: '',
      age: ''
   });
}
```

When creating a FormGroup, you can initialize your controls with any value and easily create nested forms:

```javascript

import { FormBuilder } from '@clundberg1/reactive-forms';

...

constructor(props){
  super(props);
  
  const formBuilder = new FormBuilder();
  
  this.form = formBuilder.group({
      username: '',
      email: 'test@gmail.com', //initialize a form control with a value
      age: '',
      address: formBuilder.group({  //easily create nested forms
        street: '',
        city: '',
        state: ''
      })
   });
}
```

### Validators

A class consisting of validator functions.

If your controls require validation, instead of passing the value directly, you can pass an Array where the first element will be the initial value, and the second can either be a Validator Function or an Array of Validator Functions. 

##### Example

```javascript

import { FormBuilder, Validators } from '@clundberg1/reactive-forms';

...

constructor(props){
  super(props);
  
  const formBuilder = new FormBuilder();
  
  this.form = formBuilder.group({
      username: ['', Validators.minlength(6)],
      email: ['test@gmail.com', [Validators.required, Validators.email]],  //Make sure you aren't calling the functions. Only minlength/maxlength are called because they are closures.
      age: '',
      address: formBuilder.group({
        street: '',
        city: '',
        state: ''
      })
    });
}
```
___
#### required

Validation for a control to have a value. The control will be invalid if its value is one of the following: undefined, null, [], {}, '', 0.

##### Example

```javascript

formBuilder.group({
   username: ['', Validators.required]
});
```
___
#### requiredTrue

Validation for a control's value to be true. Useful for checkboxes.

##### Example

```javascript

formBuilder.group({
   isAdult: [false, Validators.requiredTrue]
});
```
___
#### email

Validation for a control to have an email format.

##### Example

```javascript

formBuilder.group({
   email: ['', Validators.email]
});
```
___
#### minlength

Validation for a control's required min length.

##### Arguments

+ length : number (required)

##### Example

```javascript

formBuilder.group({
   username: ['', Validators.minlength(8)]
});
```
___
#### maxlength

Validation for a control's required max length.

##### Arguments

+ length : number (required)

##### Example

```javascript

formBuilder.group({
   username: ['', Validators.minlength(8)]
});
```
___
#### min

Validation for a control's minimum value.

##### Arguments

+ min : number (required)

##### Example

```javascript

formBuilder.group({
   age: [0, Validators.min(18)]
});
```
___
#### max

Validation for a control's max value.

##### Arguments

+ max : number (required)

##### Example

```javascript

formBuilder.group({
   age: [0, Validators.max(13)]
});
```
___
#### pattern

Regex validation for a control.

##### Arguments

+ pattern : RegExp | string (required)

##### Example

```javascript

const emailPattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/

formBuilder.group({
   email: ['', Validators.pattern(emailPattern)]
});
```
### Form Group Validation

You can also validate an entire FormGroup. This is useful when you need to apply validation at the FormGroup level, these validators will run whenever any of the group's FormControls changes its value. 

#### equals

Validator that requires two controls to have the same value.

##### Arguments

+ c1 : string (required)
+ c2 : string (required)

##### Example

```javascript

formBuilder.group({
   password: ['', Validators.required],
   confirmPassword: ['']
}, Validators.equals('password', 'confirmPassword'));
```


### Custom Validation

Those were the built in validators, but this clearly does not cover all validation. So what if you need to implement your own custom validation? It's quite simple actually. As seen previously, a validator is simply a function that receives a FormGroup or a FormControl and returns null (if valid) or an object with the key being the name of your error.

##### Example

```javascript
export class CustomValidators {
    static uppercase(control) {
        if(!control.value)
            return null;
        return control.value === control.value.toUpperCase() ? null : { uppercase : true };
    }
}
```

## Full example

```javascript
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { FormBuilder, Validators } from '@clundberg1/reactive-forms';



export default class App extends Component {

  constructor(props) {
    super(props);

    const formBuilder = new FormBuilder();

    this.state = {
      form: formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: formBuilder.group({
          street: '',
          city: ''
        })
      })
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  onSubmit() {
    console.log(this.state.form.value);
  }

  onBlur(control){
    this.state.form.get(control).markAsTouched();
    this.forceUpdate();
  }

  onChangeValue(control, value) {
    this.state.form.get(control).setValue(value);
    this.forceUpdate();
  }

  renderError(control, error, message) {
    if (this.state.form.get(control).touched && this.state.form.get(control).hasError(error))
      return <Text style={styles.error}>{message}</Text>

    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            onBlur={() => this.onBlur('name')}
            onChangeText={value => this.onChangeValue('name', value)}
            value={this.state.form.value.name}
            style={styles.input}
            placeholder="Name..."
          />
          { this.renderError('name', 'required', 'The name is required') }
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onBlur={() => this.onBlur('email')}
            onChangeText={value => this.onChangeValue('email', value)}
            value={this.state.form.value.email}
            style={styles.input}
            placeholder="Email..."
          />
          { this.renderError('email', 'required', 'The email is required') }
          { this.renderError('email', 'email', "The email's format is invalid.") }
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onBlur={() => this.onBlur('address.street')}
            onChangeText={value => this.onChangeValue('address.street', value)}
            value={this.state.form.value.address.street}
            style={styles.input}
            placeholder="Street..."
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onBlur={() => this.onBlur('address.city')}
            onChangeText={value => this.onChangeValue('address.city', value)}
            value={this.state.form.value.address.city}
            style={styles.input}
            placeholder="City..."
          />
        </View>
        <TouchableOpacity
          disabled={this.state.form.invalid}
          onPress={this.onSubmit}
          style={styles.button}>
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  inputContainer: {
    marginBottom: 15
  },
  input: {
    alignSelf: 'stretch',
    backgroundColor: '#F2F2F2',
    padding: 15,
    fontSize: 20,
    marginBottom: 2
  },
  button: {
    padding: 15,
    alignSelf: 'stretch',
    backgroundColor: '#00ccff'
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  error: {
    color: 'red'
  }
});

```
