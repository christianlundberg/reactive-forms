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

        expect(formGroup.value).toEqual({
            name: 'Test',
            lastname: 'Test',
            age: 20
        });
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

        expect(formGroup.value).toEqual({
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
        });

        expect(formGroup.controls.address.value).toEqual({
            street: 'Main',
            city: 'Test',
            country: {
                name: 'Mexico',
                code: 'MX'
            }
        });

        expect(formGroup.controls.address.controls.country.value).toEqual({
            name: 'Mexico',
            code: 'MX'
        });

        formGroup.controls.address.controls.street.setValue('Calle principal');

        expect(formGroup.value).toEqual({
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
        });

        expect(formGroup.controls.address.value).toEqual({
            street: 'Calle principal',
            city: 'Test',
            country: {
                name: 'Mexico',
                code: 'MX'
            }
        });

        formGroup.controls.address.controls.country.setValue({
            name: 'Canada',
            code: 'CA'
        });

        expect(formGroup.controls.address.controls.country.value).toEqual({
            name: 'Canada',
            code: 'CA'
        });

        expect(formGroup.controls.address.value).toEqual({
            street: 'Calle principal',
            city: 'Test',
            country: {
                name: 'Canada',
                code: 'CA'
            }
        });

        expect(formGroup.value).toEqual({
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
        });
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

        expect(formGroup.value).toEqual({
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
        });

        formGroup.controls.address.controls.country.patchValue({ name: 'Mexico' });

        expect(formGroup.value).toEqual({
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
        });

        formGroup.controls.address.controls.country.setValue({ name: 'Mexico', code: 'MX' });
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

        expect(formGroup.value).toEqual({
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

        expect(formGroup.valid).toBe(true);
        expect(formGroup.get('address').valid).toBe(true);
        expect(formGroup.get('name').hasError('required')).toBe(false);
        expect(formGroup.get('address.city').hasError('required')).toBe(false);

        formGroup.reset();

        expect(formGroup.value).toEqual({
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
        });

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

        expect(formGroup.value).toEqual({
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
        });

        formGroup.get('address.country').reset();

        expect(formGroup.value).toEqual({
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
        });
    });
});