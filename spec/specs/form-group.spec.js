import { FormBuilder, Validators } from '../../';

describe('FormGroup', () => {
    const formBuilder = new FormBuilder();

    it('should set the value of a form correctly', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25
        });

        expect(() => formGroup.setValue()).toThrow();
        expect(() => formGroup.setValue({})).toThrow();
        expect(() => formGroup.setValue({ name: 'Test' })).toThrow();
        expect(() => formGroup.setValue({
            id: 1,
            name: 'Test',
            lastname: 'Test',
            age: 20
        })).toThrow();

        formGroup.setValue({
            name: 'Test',
            lastname: 'Test',
            age: 20
        });

        const value = {
            name: 'Test',
            lastname: 'Test',
            age: 20
        };

        expect(formGroup.value).toEqual(value);
        expect(formGroup.getRawValue()).toEqual(value);
    });

    it('should set the value of a nested form correctly and propagate upwards and downwards.', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            address: formBuilder.group({
                street: '123',
                city: 'New York City',
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        expect(formGroup.controls.address.value).toEqual({
            street: '123',
            city: 'New York City',
            country: {
                name: 'United States',
                code: 'US'
            }
        });

        formGroup.controls.address.setValue({
            street: 'Main',
            city: 'Test',
            country: {
                name: 'Mexico',
                code: 'MX'
            }
        });

        const test1 = {
            name: 'Christian',
            lastname: 'Lundberg',
            address: {
                street: 'Main',
                city: 'Test',
                country: {
                    name: 'Mexico',
                    code: 'MX'
                }
            }
        }

        expect(formGroup.value).toEqual(test1);
        expect(formGroup.getRawValue()).toEqual(test1);

        const test2 = {
            street: 'Main',
            city: 'Test',
            country: {
                name: 'Mexico',
                code: 'MX'
            }
        }

        expect(formGroup.controls.address.value).toEqual(test2);
        expect(formGroup.controls.address.getRawValue()).toEqual(test2);

        const test3 = {
            name: 'Mexico',
            code: 'MX'
        }

        expect(formGroup.controls.address.controls.country.value).toEqual(test3);
        expect(formGroup.controls.address.controls.country.getRawValue()).toEqual(test3);

        formGroup.controls.address.controls.street.setValue('Calle principal');

        const test4 = {
            name: 'Christian',
            lastname: 'Lundberg',
            address: {
                street: 'Calle principal',
                city: 'Test',
                country: {
                    name: 'Mexico',
                    code: 'MX'
                }
            }
        }

        expect(formGroup.value).toEqual(test4);
        expect(formGroup.getRawValue()).toEqual(test4);

        const test5 = {
            street: 'Calle principal',
            city: 'Test',
            country: {
                name: 'Mexico',
                code: 'MX'
            }
        }

        expect(formGroup.controls.address.value).toEqual(test5);
        expect(formGroup.controls.address.getRawValue()).toEqual(test5);

        formGroup.controls.address.controls.country.setValue({
            name: 'Canada',
            code: 'CA'
        });

        const test6 = {
            name: 'Canada',
            code: 'CA'
        };

        expect(formGroup.controls.address.controls.country.value).toEqual(test6);
        expect(formGroup.controls.address.controls.country.getRawValue()).toEqual(test6);

        const test7 = {
            street: 'Calle principal',
            city: 'Test',
            country: {
                name: 'Canada',
                code: 'CA'
            }
        }

        expect(formGroup.controls.address.value).toEqual(test7);
        expect(formGroup.controls.address.getRawValue()).toEqual(test7);

        const test8 = {
            name: 'Christian',
            lastname: 'Lundberg',
            address: {
                street: 'Calle principal',
                city: 'Test',
                country: {
                    name: 'Canada',
                    code: 'CA'
                }
            }
        }

        expect(formGroup.value).toEqual(test8);
        expect(formGroup.getRawValue()).toEqual(test8);
    });

    it('should patch the value of a form correctly', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: 'New York',
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        formGroup.patchValue({
            age: 35,
            address: {
                street: 'Testing',
                country: {
                    name: 'United States of America'
                }
            }
        });

        const test1 = {
            name: 'Christian',
            lastname: 'Lundberg',
            age: 35,
            address: {
                street: 'Testing',
                city: 'New York',
                country: {
                    name: 'United States of America',
                    code: 'US'
                }
            }
        }

        expect(formGroup.value).toEqual(test1);
        expect(formGroup.getRawValue()).toEqual(test1);

        formGroup.controls.address.controls.country.patchValue({ name: 'Mexico' });

        const test2 = {
            name: 'Christian',
            lastname: 'Lundberg',
            age: 35,
            address: {
                street: 'Testing',
                city: 'New York',
                country: {
                    name: 'Mexico',
                    code: 'US'
                }
            }
        };

        expect(formGroup.value).toEqual(test2);
        expect(formGroup.getRawValue()).toEqual(test2);

    });

    it('should get the root control', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: 'New York',
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        expect(formGroup.root).toBe(formGroup);
        expect(formGroup.controls.address.root).toBe(formGroup);
        expect(formGroup.controls.address.controls.country.root).toBe(formGroup);
        expect(formGroup.controls.address.controls.country.controls.name.root).toBe(formGroup);
    });

    it('should set/get touched status', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: 'New York',
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        expect(formGroup.touched).toBe(false);
        expect(formGroup.untouched).toBe(true);

        formGroup.controls.address.markAsTouched();

        expect(formGroup.touched).toBe(true);
        expect(formGroup.untouched).toBe(false);
        expect(formGroup.controls.address.touched).toBe(true);
        expect(formGroup.controls.address.untouched).toBe(false);
        expect(formGroup.controls.address.controls.country.touched).toBe(false);
        expect(formGroup.controls.address.controls.country.untouched).toBe(true);

        formGroup.controls.address.controls.country.controls.name.markAsTouched();

        expect(formGroup.controls.address.controls.country.touched).toBe(true);
        expect(formGroup.controls.address.controls.country.untouched).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.name.touched).toBe(true);
        expect(formGroup.controls.address.controls.country.controls.name.untouched).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.code.touched).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.code.untouched).toBe(true);

        formGroup.markAsUntouched();

        expect(formGroup.touched).toBe(false);
        expect(formGroup.untouched).toBe(true);
        expect(formGroup.controls.address.controls.country.touched).toBe(false);
        expect(formGroup.controls.address.controls.country.untouched).toBe(true);
        expect(formGroup.controls.address.controls.country.controls.name.touched).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.name.untouched).toBe(true);
        expect(formGroup.controls.address.controls.country.controls.code.touched).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.code.untouched).toBe(true);

        formGroup.controls.address.markAsUntouched();
    });

    it('should set/get pristine status', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: 'New York',
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        expect(formGroup.dirty).toBe(false);
        expect(formGroup.pristine).toBe(true);

        formGroup.controls.address.markAsDirty();

        expect(formGroup.dirty).toBe(true);
        expect(formGroup.pristine).toBe(false);
        expect(formGroup.controls.address.dirty).toBe(true);
        expect(formGroup.controls.address.pristine).toBe(false);
        expect(formGroup.controls.address.controls.country.dirty).toBe(false);
        expect(formGroup.controls.address.controls.country.pristine).toBe(true);

        formGroup.controls.address.controls.country.controls.name.markAsDirty();

        expect(formGroup.controls.address.controls.country.dirty).toBe(true);
        expect(formGroup.controls.address.controls.country.pristine).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.name.dirty).toBe(true);
        expect(formGroup.controls.address.controls.country.controls.name.pristine).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.code.dirty).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.code.pristine).toBe(true);

        formGroup.markAsPristine();

        expect(formGroup.dirty).toBe(false);
        expect(formGroup.pristine).toBe(true);
        expect(formGroup.controls.address.controls.country.dirty).toBe(false);
        expect(formGroup.controls.address.controls.country.pristine).toBe(true);
        expect(formGroup.controls.address.controls.country.controls.name.dirty).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.name.pristine).toBe(true);
        expect(formGroup.controls.address.controls.country.controls.code.dirty).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.code.pristine).toBe(true);
    });

    it('should set value and update pristine/dirty status', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: 'New York',
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        expect(formGroup.dirty).toBe(false);
        expect(formGroup.pristine).toBe(true);

        formGroup.patchValue({
            age: 25
        });

        expect(formGroup.dirty).toBe(true);
        expect(formGroup.pristine).toBe(false);
        expect(formGroup.controls.age.dirty).toBe(true);
        expect(formGroup.controls.age.pristine).toBe(false);
        expect(formGroup.controls.name.dirty).toBe(false);
        expect(formGroup.controls.name.pristine).toBe(true);

        formGroup.markAsPristine();

        formGroup.controls.address.controls.country.controls.name.setValue('Mexico');

        expect(formGroup.dirty).toBe(true);
        expect(formGroup.pristine).toBe(false);
        expect(formGroup.controls.age.dirty).toBe(false);
        expect(formGroup.controls.age.pristine).toBe(true);
        expect(formGroup.controls.address.dirty).toBe(true);
        expect(formGroup.controls.address.pristine).toBe(false);
        expect(formGroup.controls.address.controls.country.dirty).toBe(true);
        expect(formGroup.controls.address.controls.country.pristine).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.name.dirty).toBe(true);
        expect(formGroup.controls.address.controls.country.controls.name.pristine).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.code.dirty).toBe(false);
        expect(formGroup.controls.address.controls.country.controls.code.pristine).toBe(true);
    });

    it('should get the correct child control', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: 'New York',
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        expect(() => formGroup.get()).toThrow();
        expect(() => formGroup.get(1)).toThrow();
        expect(() => formGroup.get(null)).toThrow();
        expect(() => formGroup.get({})).toThrow();
        expect(formGroup.get('name')).toBe(formGroup.controls.name);
        expect(formGroup.get('address.street')).toBe(formGroup.controls.address.controls.street);
        expect(formGroup.get('address.country.name')).toBe(formGroup.controls.address.controls.country.controls.name);
        expect(formGroup.get(['address'])).toBe(formGroup.controls.address);
        expect(formGroup.get(['address', 'street'])).toBe(formGroup.controls.address.controls.street);
        expect(formGroup.get(['address', 'country', 'name'])).toBe(formGroup.controls.address.controls.country.controls.name);
        expect(formGroup.get(['addres', 'country', 'name'])).toBe(null);
        expect(formGroup.get(['address', 'countryy', 'name'])).toBe(null);
        expect(formGroup.get(['address', 'country', 'naame'])).toBe(null);
        expect(formGroup.get([])).toBe(null);
        expect(formGroup.get('')).toBe(null);
        expect(formGroup.controls.address.get('street')).toBe(formGroup.controls.address.controls.street);
    });

    it('should check hasErrors() correctly', () => {

        const formGroup = formBuilder.group({
            name: ['', Validators.required],
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: ['New York', Validators.required],
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        expect(formGroup.get('name').hasError('required')).toBe(true);
        expect(formGroup.get('lastname').hasError('required')).toBe(false);
        expect(formGroup.get('address.city').hasError('required')).toBe(false);

        formGroup.patchValue({
            name: 'name',
            address: {
                city: ''
            }
        });

        expect(formGroup.get('name').hasError('required')).toBe(false);
        expect(formGroup.get('lastname').hasError('required')).toBe(false);
        expect(formGroup.get('address.city').hasError('required')).toBe(true);

        formGroup.setValue({
            name: 'name',
            lastname: 'Lundberg',
            age: 50,
            address: {
                street: '123',
                city: 'city',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        });

        expect(formGroup.get('name').hasError('required')).toBe(false);
        expect(formGroup.get('lastname').hasError('required')).toBe(false);
        expect(formGroup.get('address.city').hasError('required')).toBe(false);
    });

    it('should reset the form correctly', () => {

        const formGroup = formBuilder.group({
            name: ['Christian', Validators.required],
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: ['New York', Validators.required],
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        const test1 = {
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: {
                street: 'Main',
                city: 'New York',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        };

        expect(formGroup.value).toEqual(test1);
        expect(formGroup.getRawValue()).toEqual(test1);

        expect(formGroup.valid).toBe(true);
        expect(formGroup.get('address').valid).toBe(true);
        expect(formGroup.get('name').hasError('required')).toBe(false);
        expect(formGroup.get('address.city').hasError('required')).toBe(false);

        formGroup.reset();

        const test2 = {
            name: null,
            lastname: null,
            age: null,
            address: {
                street: null,
                city: null,
                country: {
                    name: null,
                    code: null
                }
            }
        }

        expect(formGroup.value).toEqual(test2);
        expect(formGroup.getRawValue()).toEqual(test2);

        expect(formGroup.valid).toBe(false);
        expect(formGroup.get('address').valid).toBe(false);
        expect(formGroup.get('name').hasError('required')).toBe(true);
        expect(formGroup.get('address.city').hasError('required')).toBe(true);

        formGroup.patchValue({
            age: 20,
            address: {
                country: {
                    name: 'Canada'
                }
            }
        });

        const test3 = {
            name: null,
            lastname: null,
            age: 20,
            address: {
                street: null,
                city: null,
                country: {
                    name: 'Canada',
                    code: null
                }
            }
        }

        expect(formGroup.value).toEqual(test3);
        expect(formGroup.getRawValue()).toEqual(test3);

        formGroup.get('address.country').reset();

        const test4 = {
            name: null,
            lastname: null,
            age: 20,
            address: {
                street: null,
                city: null,
                country: {
                    name: null,
                    code: null
                }
            }
        }

        expect(formGroup.value).toEqual(test4);
        expect(formGroup.getRawValue()).toEqual(test4);
    });

    it('should disable/enable FormGroup and FormControls', () => {
        const formGroup = new FormBuilder().group({
            name: ['Christian', Validators.required],
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                street: 'Main',
                city: ['New York', Validators.required],
                country: formBuilder.group({
                    name: 'United States',
                    code: 'US'
                })
            })
        });

        formGroup.get('address').disable();

        expect(formGroup.value).toEqual({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25
        });

        expect(formGroup.getRawValue()).toEqual({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: {
                street: 'Main',
                city: 'New York',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        });

        expect(formGroup.status).toBe('VALID');
        expect(formGroup.enabled).toBe(true);
        expect(formGroup.disabled).toBe(false);
        expect(formGroup.get('name').status).toBe('VALID');
        expect(formGroup.get('name').enabled).toBe(true);
        expect(formGroup.get('name').disabled).toBe(false);
        expect(formGroup.get('lastname').status).toBe('VALID');
        expect(formGroup.get('lastname').enabled).toBe(true);
        expect(formGroup.get('lastname').disabled).toBe(false);
        expect(formGroup.get('age').status).toBe('VALID');
        expect(formGroup.get('age').enabled).toBe(true);
        expect(formGroup.get('age').disabled).toBe(false);
        expect(formGroup.get('address').status).toBe('DISABLED');
        expect(formGroup.get('address').enabled).toBe(false);
        expect(formGroup.get('address').disabled).toBe(true);

        formGroup.get('age').disable();

        expect(formGroup.value).toEqual({
            name: 'Christian',
            lastname: 'Lundberg'
        });

        expect(formGroup.getRawValue()).toEqual({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: {
                street: 'Main',
                city: 'New York',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        });

        expect(formGroup.status).toBe('VALID');
        expect(formGroup.enabled).toBe(true);
        expect(formGroup.disabled).toBe(false);
        expect(formGroup.get('name').status).toBe('VALID');
        expect(formGroup.get('name').enabled).toBe(true);
        expect(formGroup.get('name').disabled).toBe(false);
        expect(formGroup.get('lastname').status).toBe('VALID');
        expect(formGroup.get('lastname').enabled).toBe(true);
        expect(formGroup.get('lastname').disabled).toBe(false);
        expect(formGroup.get('age').status).toBe('DISABLED');
        expect(formGroup.get('age').enabled).toBe(false);
        expect(formGroup.get('age').disabled).toBe(true);
        expect(formGroup.get('address').status).toBe('DISABLED');
        expect(formGroup.get('address').enabled).toBe(false);
        expect(formGroup.get('address').disabled).toBe(true);

        formGroup.get('lastname').disable();

        expect(formGroup.value).toEqual({
            name: 'Christian'
        });

        expect(formGroup.getRawValue()).toEqual({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: {
                street: 'Main',
                city: 'New York',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        });

        expect(formGroup.status).toBe('VALID');
        expect(formGroup.enabled).toBe(true);
        expect(formGroup.disabled).toBe(false);
        expect(formGroup.get('name').status).toBe('VALID');
        expect(formGroup.get('name').enabled).toBe(true);
        expect(formGroup.get('name').disabled).toBe(false);
        expect(formGroup.get('lastname').status).toBe('DISABLED');
        expect(formGroup.get('lastname').enabled).toBe(false);
        expect(formGroup.get('lastname').disabled).toBe(true);
        expect(formGroup.get('age').status).toBe('DISABLED');
        expect(formGroup.get('age').enabled).toBe(false);
        expect(formGroup.get('age').disabled).toBe(true);
        expect(formGroup.get('address').status).toBe('DISABLED');
        expect(formGroup.get('address').enabled).toBe(false);
        expect(formGroup.get('address').disabled).toBe(true);

        formGroup.get('name').disable();

        expect(formGroup.getRawValue()).toEqual({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: {
                street: 'Main',
                city: 'New York',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        });

        expect(formGroup.status).toBe('DISABLED');
        expect(formGroup.enabled).toBe(false);
        expect(formGroup.disabled).toBe(true);
        expect(formGroup.get('name').status).toBe('DISABLED');
        expect(formGroup.get('name').enabled).toBe(false);
        expect(formGroup.get('name').disabled).toBe(true);
        expect(formGroup.get('lastname').status).toBe('DISABLED');
        expect(formGroup.get('lastname').enabled).toBe(false);
        expect(formGroup.get('lastname').disabled).toBe(true);
        expect(formGroup.get('age').status).toBe('DISABLED');
        expect(formGroup.get('age').enabled).toBe(false);
        expect(formGroup.get('age').disabled).toBe(true);
        expect(formGroup.get('address').status).toBe('DISABLED');
        expect(formGroup.get('address').enabled).toBe(false);
        expect(formGroup.get('address').disabled).toBe(true);

        formGroup.get('address').enable();

        expect(formGroup.value).toEqual({
            address: {
                street: 'Main',
                city: 'New York',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        });

        expect(formGroup.getRawValue()).toEqual({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: {
                street: 'Main',
                city: 'New York',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        });

        expect(formGroup.status).toBe('VALID');
        expect(formGroup.enabled).toBe(true);
        expect(formGroup.disabled).toBe(false);
        expect(formGroup.get('name').status).toBe('DISABLED');
        expect(formGroup.get('name').enabled).toBe(false);
        expect(formGroup.get('name').disabled).toBe(true);
        expect(formGroup.get('lastname').status).toBe('DISABLED');
        expect(formGroup.get('lastname').enabled).toBe(false);
        expect(formGroup.get('lastname').disabled).toBe(true);
        expect(formGroup.get('age').status).toBe('DISABLED');
        expect(formGroup.get('age').enabled).toBe(false);
        expect(formGroup.get('age').disabled).toBe(true);
        expect(formGroup.get('address').status).toBe('VALID');
        expect(formGroup.get('address').enabled).toBe(true);
        expect(formGroup.get('address').disabled).toBe(false);

        formGroup.get('name').setValue('');

        expect(formGroup.status).toBe('VALID');

        formGroup.get('name').enable();

        expect(formGroup.status).toBe('INVALID');

        formGroup.get('address.city').setValue('');

        expect(formGroup.status).toBe('INVALID');

        formGroup.get('address.city').disable();

        expect(formGroup.get('address').status).toBe('VALID');
    });
});