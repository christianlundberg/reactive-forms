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
      email: ['test@gmail.com', [Validators.required, Validators.email]],  //Make sure you aren't running the functions. Only minLength/maxLength are run because they are closures.
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

If the control is a FormGroup, the value must be an object matching the FormGroup's structure (It will throw an error if it's missing any keys or has extra ones). If the control is a FormControl, it'll smply set its value.

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

| Props        | Definition           | Type  |
| ------------- |:-------------:| -----:|
| value      | The value of the entire FormGroup | Object |
| status      | The status of the FormGroup. If any of the FormControls are INVALID, the FormGroup is INVALID. If all the FormControls are VALID, the FormGroup will be VALID      |   "VALID" or "INVALID" |
| errors | An object of errors or null if valid.      |    Object or null |
| pristine | True if the control or any child controls hasn't changed value    |  boolean  |
| dirty | True if the control or any child controls has changed value.      |    boolean |
| untouched | True if the control or any child controls hasn't been touched      |    boolean |
| touched | True if the control or any child controls has been touched.      |    boolean |


