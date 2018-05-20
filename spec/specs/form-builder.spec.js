import { FormBuilder, Validators } from '../../';

describe('FormBuilder', () => {

    const formBuilder = new FormBuilder();

    it('should throw an error when not passing an object to group()', () => {
        expect(() => formBuilder.group()).toThrow();
        expect(() => formBuilder.group('something')).toThrow();
        expect(() => formBuilder.group(123)).toThrow();
        expect(() => formBuilder.group([])).toThrow();
        expect(() => formBuilder.group(null)).toThrow();
        expect(() => formBuilder.group(undefined)).toThrow();
    });

    it('should create a person form', () => {
        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25
        });
        expect(formGroup.value).toEqual({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25
        });
    });

    it('should create a nested form', () => {

        const formGroup = formBuilder.group({
            name: 'Christian',
            lastname: 'Lundberg',
            age: 25,
            address: formBuilder.group({
                city: 'New York',
                street: '123',
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
                city: 'New York',
                street: '123',
                country: {
                    name: 'United States',
                    code: 'US'
                }
            }
        });

        expect(formGroup.controls.address.value).toEqual({
            city: 'New York',
            street: '123',
            country: {
                name: 'United States',
                code: 'US'
            }
        });

        expect(formGroup.controls.address.parent).toBe(formGroup);
        expect(formGroup.controls.address.controls.country.parent).toBe(formGroup.controls.address);
    });

    it('should set the value and validators of the form controls when using array notation', () => {

        const maxlength = Validators.maxlength(10);
        
        const formGroup = formBuilder.group({
            name: ['test', Validators.required],
            email: ['clundberg@gmail.com', [Validators.required, maxlength , Validators.email]],
            lastname: 'lastname',
            address: formBuilder.group({
                city: ['New York'],
                street: 'Main St.'
            })
        });

        expect(formGroup.value).toEqual({
            name: 'test',
            email: 'clundberg@gmail.com',
            lastname: 'lastname',
            address: {
                city: 'New York',
                street: 'Main St.'
            }
        });

        expect(formGroup.controls.lastname.validators).toBe(null);
        expect(formGroup.controls.name.validators.length).toBe(1);
        expect(formGroup.controls.name.validators[0]).toBe(Validators.required);
        expect(formGroup.controls.email.validators.length).toBe(3);
        expect(formGroup.controls.email.validators[0]).toBe(Validators.required);
        expect(formGroup.controls.email.validators[1]).toBe(maxlength);
        expect(formGroup.controls.email.validators[2]).toBe(Validators.email);
        

        formGroup.patchValue({
            name: 'changed',
            address: {
                city: 'Miami'
            }
        });

        expect(formGroup.value).toEqual({
            name: 'changed',
            email: 'clundberg@gmail.com',
            lastname: 'lastname',
            address: {
                city: 'Miami',
                street: 'Main St.'
            }
        });

        expect(formGroup.controls.lastname.validators).toBe(null);
        expect(formGroup.controls.name.validators.length).toBe(1);
        expect(formGroup.controls.name.validators[0]).toBe(Validators.required);
        expect(formGroup.controls.email.validators.length).toBe(3);
        expect(formGroup.controls.email.validators[0]).toBe(Validators.required);
        expect(formGroup.controls.email.validators[1]).toBe(maxlength);
        expect(formGroup.controls.email.validators[2]).toBe(Validators.email);

        formGroup.get('email').setValue('clundberghotmail.com');

        expect(formGroup.controls.email.errors).toEqual({
            email: true,
            maxlength: true
        })
    });

    it('should set the correct status and errors', () => {
        
        const formGroup = formBuilder.group({
            name: ['test', Validators.required],
            email: ['clundberg@gmailcom', [Validators.required, Validators.email]],
            lastname: 'lastname',
            address: formBuilder.group({
                city: ['', Validators.required],
                street: 'Main St.'
            })
        });

        expect(formGroup.status).toBe("INVALID");
        expect(formGroup.controls.name.status).toBe("VALID");
        expect(formGroup.controls.email.status).toBe("INVALID");
        expect(formGroup.controls.lastname.status).toBe("VALID");
        expect(formGroup.controls.address.status).toBe("INVALID");
        expect(formGroup.controls.address.controls.city.status).toBe("INVALID");
        expect(formGroup.controls.address.controls.street.status).toBe("VALID");

        formGroup.controls.email.setValue('clundberg@gmail.com');

        expect(formGroup.status).toBe("INVALID");
        expect(formGroup.controls.name.status).toBe("VALID");
        expect(formGroup.controls.email.status).toBe("VALID");
        expect(formGroup.controls.lastname.status).toBe("VALID");
        expect(formGroup.controls.address.status).toBe("INVALID");
        expect(formGroup.controls.address.controls.city.status).toBe("INVALID");
        expect(formGroup.controls.address.controls.street.status).toBe("VALID");

        formGroup.patchValue({
            address: {
                city: 'somewhere'
            }
        });

        expect(formGroup.status).toBe("VALID");
        expect(formGroup.controls.name.status).toBe("VALID");
        expect(formGroup.controls.email.status).toBe("VALID");
        expect(formGroup.controls.lastname.status).toBe("VALID");
        expect(formGroup.controls.address.status).toBe("VALID");
        expect(formGroup.controls.address.controls.city.status).toBe("VALID");
        expect(formGroup.controls.address.controls.street.status).toBe("VALID");

        formGroup.patchValue({
            lastname: null
        });

        expect(formGroup.status).toBe("VALID");
        expect(formGroup.controls.name.status).toBe("VALID");
        expect(formGroup.controls.email.status).toBe("VALID");
        expect(formGroup.controls.lastname.status).toBe("VALID");
        expect(formGroup.controls.address.status).toBe("VALID");
        expect(formGroup.controls.address.controls.city.status).toBe("VALID");
        expect(formGroup.controls.address.controls.street.status).toBe("VALID");

        formGroup.patchValue({
            email: 'clundberg@gmail.'
        });

        expect(formGroup.status).toBe("INVALID");
        expect(formGroup.controls.name.status).toBe("VALID");
        expect(formGroup.controls.email.status).toBe("INVALID");
        expect(formGroup.controls.lastname.status).toBe("VALID");
        expect(formGroup.controls.address.status).toBe("VALID");
        expect(formGroup.controls.address.controls.city.status).toBe("VALID");
        expect(formGroup.controls.address.controls.street.status).toBe("VALID");
        expect(formGroup.controls.email.errors).toEqual({email: true})
    });
})