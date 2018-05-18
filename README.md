# reactive-forms

Easily create forms and manage their state in React and React Native.

### Installing

To install the latest version of reactive-forms, simply run:

```
npm install --save @clundberg1/reactive-forms
```

## Docs

### FormBuilder

This is a helper class that will help you get a ```FormGroup``` instance. 

<pre><b>group(controls: Object) : FormGroup;</b></pre>

Use the group method to get a FormGroup instance. It takes as an argument an object where the keys are the names of the ```FormControl```s and the value is the initial value for that form control.

```javascript

import { FormBuilder } from '@clundberg1/reactive-forms';

const formBuilder = new FormBuilder();

...

constructor(props){
  super(props);
  
  this.state = {
    form: formBuilder.group({
      username: '',
      email: 'test@gmail.com',
      age: 20,
      address: formBuilder.group({  //easily create nested groups
        street: '',
        city: '',
        state: ''
      })
    });
  };
}
```

### Validators

A class consisting of (common) validator methods.

When using the FormBuilder class, instead of passing the value directly to each FormControl, you can pass an array. The first element must be the value, while the second must be the validator(s).

```javascript

import { FormBuilder, Validators } from '@clundberg1/reactive-forms';

const formBuilder = new FormBuilder();

...

constructor(props){
  super(props);
  
  this.state = {
    form: formBuilder.group({
      username: ['', Validators.minLength(6)],
      email: ['test@gmail.com', [Validators.required, Validators.email]],  //Make sure you aren't calling the functions. Only minLength/maxLength are called because they are closures.
      age: 20,
      address: formBuilder.group({
        street: '',
        city: '',
        state: ''
      })
    });
  };
}
```

### FormGroup & FormControl
Both classes extend from AbstractControl and thus they share many of the same properties and methods.

<pre><b>setValue(value: any) : void;</b></pre>

If the control is a FormGroup, the value must be an object matching the FormGroup's structure (It will throw an error if it's missing any keys or has extra ones). If the control is a FormControl, it'll simply set its value.

```javascript

constructor(props){
  super(props);
  
  this.state = {
    form: formBuilder.group({
      username: '',
      email: ''
      age: null,
      address: formBuilder.group({
        street: '',
        city: '',
        state: ''
      })
    });
  };
  
  //We need to do this so that React re-renders

  this.setState(prevState => { 
    return {
      form: {
        ...this.state.form.setValue({
            username: 'user123',
            email: 'user@gmail.com',
            age: 20,
            address: {
              street: 'Main st.',
              city: 'NYC',
              state: 'NY'
            }
          })
        }
      }
  })
  
  console.log(this.state.form.value)
  
  /*
 {
    username: 'user123',
    email: 'user@gmail.com',
    age: 20,
    address: {
      street: 'Main st.',
      city: 'NYC',
      state: 'NY'
    }
  }
  */
  
  this.state.form.get('age').setValue(25);
  
  console.log(this.state.form.value);
  
  /*
   {
      username: 'user123',
      email: 'user@gmail.com',
      age: 25,
      address: {
        street: 'Main st.',
        city: 'NYC',
        state: 'NY'
      }
    }
  */
  
  //Assuming this is too tedious, you could force React to re-render:
  
  this.state.form.setValue({
      username: 'user123',
      email: 'user@gmail.com',
      age: 20,
      address: {
        street: 'Main st.',
        city: 'NYC',
        state: 'NY'
      }
  });
    
   this.forceUpdate();
}

```

<pre><b>patchValue(value: any) : void;</b></pre>

It works similar to setValue. The only difference is if the control is a FormGroup, it will not throw an error if the value has extra or missing keys. 

```javascript
...

this.state.form.patchValue({
  id: 100, //This would throw an error with setValue since our FormGroup doesn't have an "id" FormControl. Here, it'll simply be ignored.
  username: 'great_name'
})

console.log(this.state.form.value)

 /*
   {
      username: 'great_name',
      email: 'user@gmail.com',
      age: 25,
      address: {
        street: 'Main st.',
        city: 'NYC',
        state: 'NY'
      }
    }
  */

...

```

| Props        | Definition           | Returns  |
| ------------- |:-------------:| -----:|
| value      | The value of the entire FormGroup or a single FormControl | Object \| any |
| status      | The status of the FormGroup. If any of the FormControls are INVALID, the FormGroup is INVALID. If all the FormControls are VALID, the FormGroup will be VALID      |   "VALID" \| "INVALID" |
| errors | An object of errors or null if there are none.      |    Object \| null |
| pristine | True if the control or any child controls hasn't changed value    |  boolean  |
| dirty | True if the control or any child controls has changed value.      |    boolean |
| untouched | True if the control or any child controls hasn't been touched      |    boolean |
| touched | True if the control or any child controls has been touched.      |    boolean |
| get(path: string\|string[]) | Method which takes the path to a control: <code>.get("address.street")</code>   |    AbstractControl |
| markAsTouched() | Sets the control's touched property to true, and all its child controls as well. Call this function upon the blur event of an input.   |    void |
| markAsUntouched() | Sets the control's touched property to false, and all its child controls as well.  |    void |
| markAsDirty() | Sets the control's pristine property to false, and all its child controls as well. Both .setValue() and .patchValue() already call this method.  |    void |
| markAsPristine() | Sets the control's pristine property to true  |    void |
| hasError(error: string) | Checks if the ```errors``` object contains the specified error  |    boolean |


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
