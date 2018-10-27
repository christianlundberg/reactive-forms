# Reactive Forms

Easily create a representation of your forms and manage their state in React and React Native. 

### Installation

To install the latest version of reactive-forms, simply run:

```
npm install --save @clundberg1/reactive-forms
```
## API
+ [FormBuilder](#formbuilder)
    + [group](#group)
+ [Validators](#validators)
    + [required](#required)
    + [requiredTrue](#requiredtrue)
    + [email](#email)
    + [minlength](#minlength)
    + [maxlength](#maxlength)
    + [min](#min)
    + [max](#max)
    + [pattern](#pattern)
+ [Form Group Validation](#form-group-validation)
    + [equals](#equals)
+ [Custom Validation](#custom-validation)
+ [FormGroup And FormControl](#formgroup-and-formcontrol)
    + [Properties](#properties)
        + [value](#value-any)
        + [status](#status-string)
        + [valid](#valid-boolean)
        + [invalid](#invalid-boolean)
        + [errors](#errors-any)
        + [pristine](#pristine-boolean)
        + [dirty](#dirty-boolean)
        + [untouched](#untouched-boolean)
        + [touched](#touched-boolean)
        + [enabled](#enabled-boolean)
        + [disabled](#disabled-boolean)
    + [Methods](#methods)
        + [setValue](#setvalue-void)
        + [patchValue](#patchvalue-void)
        + [reset](#reset-void)
        + [disable](#disable-void)
        + [enable](#enable-void)
        + [get](#get-abstractcontrol)
        + [hasError](#haserror-boolean)
        + [getRawValue](#getrawvalue-any)
+ [Full Example](#full-example)

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
### FormGroup And FormControl
Both classes share mostly the same properties and methods. The only difference is on the FormControl class, they refer to a single control, and on a FormGroup they apply to the combined child controls.

#### Properties

##### value: any
The values of all enabled controls as an object.

```javascript

  const formBuilder = new FormBuilder();
  
  this.form = formBuilder.group({
      username: '',
      email: 'test@gmail.com',
      age: '',
      address: formBuilder.group({
        street: '',
        city: '',
        state: ''
      })
   });
   
   console.log(this.form.value)
   
   /*
   {
      username: '',
      email: 'test@gmail.com',
      age: '',
      address: {
        street: '',
        city: '',
        state: ''
      }
   }
   */
   
   console.log(this.form.get('address').value);
   /*
    {
      street: '',
      city: '',
      state: ''
     }
   */
   
   //get the value of a single FormControl.
   
   console.log(this.form.get('email').value) //'test@gmail.com'
   
```
___
##### status: string
+ Disabled if all of the controls are disabled.
+ Invalid if any of the controls are invalid.
+ Valid if all the controls are valid.

```javascript

  const formBuilder = new FormBuilder();
  
  this.form = formBuilder.group({
      username: ['', Validators.required],
      email: 'test@gmail.com',
      age: '',
      address: formBuilder.group({
        street: '',
        city: '',
        state: ''
      })
   });
   
   console.log(this.form.status) // "INVALID"
   console.log(this.form.get('username').status) // "INVALID"   
   console.log(this.form.get('address').status) // "VALID"   
```
___
##### valid: boolean
True if status is "VALID".

```javascript
   console.log(this.form.valid)
```
___
##### invalid: boolean
True if status is "INVALID".

```javascript
   console.log(this.form.invalid)
```
___
##### errors: any
All the errors the control has, merged into a single object. 

```javascript
   this.form = formBuilder.group({
      username: ['Samuel', [Validators.minlength(8), CustomValidators.uppercase]] //for some reason you want username to be all uppercase
   });
   
   console.log(this.form.get('username').errors)
   
   /*
   {
      minlength: true,
      uppercase: true
   }
   */
```
___
##### pristine: boolean
+ FormControl: True if the control hasn't changed value.
+ FormGroup: True if none of the controls have changed value.

```javascript
   console.log(this.form.pristine)
```
___
##### dirty: boolean
+ FormControl: True if the control has changed value.
+ FormGroup: True if any of the controls have changed value.

```javascript
   console.log(this.form.dirty)
```
___
##### untouched: boolean
+ FormControl: True if the control has not been marked as touched (blur event)
+ FormGroup: True if none of the controls have been marked as touched.
```javascript
   console.log(this.form.untouched)
```
___
##### touched: boolean
+ FormControl: True if the control has been marked as touched (blur event)
+ FormGroup: True if any of the controls have been marked as touched.
```javascript
   console.log(this.form.untouched)
```
___
##### enabled: boolean
+ FormControl: True if the control's status is not "DISABLED".
+ FormGroup: True if any of the control's are not "DISABLED".
```javascript
   console.log(this.form.enabled)
```
___
##### disabled: boolean
+ FormControl: True if the control's status is "DISABLED".
+ FormGroup: True if all of the control's are "DISABLED".
```javascript
   console.log(this.form.disabled)
```

#### Methods

##### setValue: void

+ FormControl: Sets its value.
+ FormGroup: Set the value of the controls. You must pass an object with the exact same structure as the one of the FormGroup or it'll throw an error. 

It also sets the control's pristine property to false, because the control's value has been changed.

###### Arguments

+ FormControl
    + value: any
+ FormGroup
    + controls: { [control: string ]: any }

###### Example

```javascript

this.form = formBuilder.group({
   username: '',
   password: ''
});

this.form.get('username').setValue('my_name'); //sets the value of a single control
console.log(this.form.value);
/*
   {
      username: 'my_name',
      password: ''
   }
*/

this.form.setValue({
  username: 'my_name' //throws an error because it's missing the password.
});

this.form.setValue({
  id: 1234
  username: 'my_name', //Also would throw error because there isn't a FormControl named "id".
  password: 'x1PPDasa3'
});

this.form.setValue({
  username: 'my_name', //this is ok
  password: 'x1PPDasa3'
});

```
___
##### patchValue: void

+ FormControl: Same as setValue.
+ FormGroup: Set the value of the controls. This method won't throw an error if the object's missing or has extra keys.

It also sets the control's pristine property to false, because the control's value has been changed.

###### Arguments

+ FormControl
    + value: any
+ FormGroup
    + controls: { [control: string ]: any }

###### Example

```javascript

this.form = formBuilder.group({
   username: '',
   password: ''
});

this.form.get('username').patchValue('my_name'); //sets the value of a single control
console.log(this.form.value);
/*
   {
      username: 'my_name',
      password: ''
   }
*/

this.form.patchValue({
  username: 'my_name' 
});

console.log(this.form.value);
/*
   {
      username: 'my_name',
      password: ''
   }
*/

this.form.setValue({
  id: 1234 //The "id" property is simply ignored
  username: 'my_name', 
  password: 'x1PPDasa3'
});

console.log(this.form.value);
/*
   {
      username: 'my_name',
      password: 'x1PPDasa3'
   }
*/

```
___
##### reset: void

+ FormControl: Reset the control to null.
+ FormGroup: Reset all of its controls to null.

It also sets the control's pristine and untouched properties to true. You can optionally pass the value you want the control to be reset to.

###### Arguments

+ FormControl
    + value: any
+ FormGroup
    + controls: { [control: string ]: any }

###### Example

```javascript

this.form = formBuilder.group({
   username: 'my_name',
   password: 'my_password'
});

this.form.get('username').reset(); 
console.log(this.form.value);
/*
   {
      username: null,
      password: 'my_password'
   }
*/

this.form.reset({
  username: 'new_name',
  password: 'new_password'
});

console.log(this.form.value);
/*
   {
      username: 'new_name',
      password: 'new_password'
   }
*/

```
___
##### disable: void

+ FormControl: Disable the control
+ FormGroup: Disable all of the group's controls.

Disabled controls are ignored when calculating a FormGroup's status or value, so this is useful for controls which can be hidden: simply disable them and they won't be validated nor will their value appear in the FormGroup's value. If you need the entire FormGroup's value including disabled controls, call the getRawValue method.


###### Example

```javascript

this.form = formBuilder.group({
   username: ['', Validators.required],
   password: ''
});

this.form.get('username').disable(); 
console.log(this.form.value);
/*
   {
      password: ''
   }
*/

console.log(this.form.getRawValue());

/*
   {
      username: '',
      password: ''
   }
*/

console.log(this.form.get('username').status) //"DISABLED"
console.log(this.form.get('username').enabled) //false
console.log(this.form.get('username').disabled) //true
console.log(this.form.valid) //true. The FormGroup is valid because the username is disabled thus not validated.
```
___
##### enable: void

+ FormControl: Enable the control
+ FormGroup: Enable all of the group's controls.

##### get: AbstractControl
Returns a child control given a control's path or name.
___
###### Arguments

+ path: string | string[]

###### Example

```javascript

this.form = formBuilder.group({
   name: '',
   address: formBuilder.group({
      street: '',
      city: ''
   })
});

const addressGroup = this.form.get('address');
const streetControl = this.form.get('address.street') //access nested controls
const cityControl = this.form.get(['address', 'city']) //or this way
```
___
##### hasError: boolean
Whether the control has the specified error.

###### Arguments

+ error: string

###### Example

```javascript

this.form = formBuilder.group({
   name: ['', Validators.required]
});

console.log(this.form.get('name').errors)

/*
{
  required: true
}
*/

console.log(this.form.get('name').hasError('required')) //true
console.log(this.form.get('name').hasError('minlength')) //false
```
___
##### getRawValue: any
Returns the value of the FormGroup including disabled controls.

###### Example

```javascript

this.form = formBuilder.group({
   username: 'my_username',
   password: 'my_password'
});

this.form.get('password').disable()

console.log(this.form.value);

/*
{
  username: 'my_username'
}
*/

console.log(this.form.getRawValue());

/*
{
  username: 'my_username',
  password: 'my_password'
}
*/

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

    this.form = formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: formBuilder.group({
          street: '',
          city: ''
        })
      });

    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  onSubmit() {
    console.log(this.form.value);
  }

  onBlur(control){
    this.form.get(control).markAsTouched();
    this.forceUpdate();
  }

  onChangeValue(control, value) {
    this.form.get(control).setValue(value);
    this.forceUpdate();
  }

  renderError(control, error, message) {
    if (this.form.get(control).touched && this.form.get(control).hasError(error))
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
            value={this.form.value.name}
            style={styles.input}
            placeholder="Name..."
          />
          { this.renderError('name', 'required', 'The name is required') }
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onBlur={() => this.onBlur('email')}
            onChangeText={value => this.onChangeValue('email', value)}
            value={this.form.value.email}
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
            value={this.form.value.address.street}
            style={styles.input}
            placeholder="Street..."
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onBlur={() => this.onBlur('address.city')}
            onChangeText={value => this.onChangeValue('address.city', value)}
            value={this.form.value.address.city}
            style={styles.input}
            placeholder="City..."
          />
        </View>
        <TouchableOpacity
          disabled={this.form.invalid}
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
