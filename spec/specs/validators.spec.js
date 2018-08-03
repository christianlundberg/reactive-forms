import { Validators } from '../../';
import { FormGroup } from '../../src/models';
import { FormBuilder } from '../../src/form-builder';

describe('Validators', () => {

    it('should apply requiredTrue validation correctly', () => {
        expect(Validators.requiredTrue({ value: true })).toBe(null);
        expect(Validators.requiredTrue({ value: 'true' })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: 'Testing string' })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: false })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: null })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: undefined })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: 0 })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: 1 })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: -1 })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: {} })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: {prop: 'some value'} })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: [] })).toEqual({ required: true });
        expect(Validators.requiredTrue({ value: ['some item'] })).toEqual({ required: true });
    });

    it('should apply required validation correctly', () => {
        expect(Validators.required({ value: 'Testing string' })).toBe(null);
        expect(Validators.required({ value: 100 })).toBe(null);
        expect(Validators.required({ value: 0 })).toEqual({ required: true });
        expect(Validators.required({ value: 1 })).toBe(null);
        expect(Validators.required({ value: -1 })).toBe(null);
        expect(Validators.required({ value: {} })).toEqual({ required: true });
        expect(Validators.required({ value: [] })).toEqual({ required: true });
        expect(Validators.required({ value: ['some item'] })).toBe(null);
        expect(Validators.required({ value: { prop: 'prop' } })).toBe(null);
        expect(Validators.required({ value: '' })).toEqual({ required: true });
        expect(Validators.required({ value: null })).toEqual({ required: true });
        expect(Validators.required({ value: undefined })).toEqual({ required: true });
    });

    it('should apply email validation correctly', () => {
        expect(Validators.email({ value: '' })).toBe(null);
        expect(Validators.email({ value: 'clundberg@gmail.com' })).toBe(null);
        expect(Validators.email({ value: 'c_lundberg@gmail.com' })).toBe(null);
        expect(Validators.email({ value: '_clundberg123@gmail.com' })).toBe(null);
        expect(Validators.email({ value: 'clundberggmail.com' })).toEqual({ email: true });
        expect(Validators.email({ value: 'clundberg@gmailcom' })).toEqual({ email: true });
        expect(Validators.email({ value: 'clundberggmailcom' })).toEqual({ email: true });
    });

    it('should apply minlength validation correctly', () => {
        expect(Validators.minlength(4)({ value: 'Test' })).toBe(null);
        expect(Validators.minlength(4)({ value: 'Wow' })).toEqual({minlength: true});
    });

    it('should apply maxlength validation correctly', () => {
        expect(Validators.maxlength(4)({ value: 'Test' })).toBe(null);
        expect(Validators.maxlength(4)({ value: 'This is a test' })).toEqual({maxlength: true});
    });

    it('should apply min validation correctly', () => {
        expect(Validators.min(0)({ value: 1 })).toBe(null);
        expect(Validators.min(0)({ value: 100 })).toBe(null);
        expect(Validators.min(0)({ value: 0 })).toBe(null);
        expect(Validators.min(0)({ value: -1 })).toEqual({ min: true });
    });

    it('should apply max validation correctly', () => {
        expect(Validators.max(10)({ value: 1 })).toBe(null);
        expect(Validators.max(10)({ value: 10 })).toBe(null);
        expect(Validators.max(10)({ value: 100 })).toEqual({ max: true });
    });

    it('should apply "pattern" validation correctly', () => {
        expect(Validators.pattern(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/)({ value: 'myemail@gmail.com' })).toBe(null);
        expect(Validators.pattern(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/)({ value: 'myemail@gmailcom' })).toEqual({
            pattern: true
        });
        expect(Validators.pattern(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/)({ value: 'myemailgmail.com' })).toEqual({
            pattern: true
        });
        expect(Validators.pattern(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/)({ value: '@myemailgmail.com' })).toEqual({
            pattern: true
        });

        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 'Testpassword1' })).toBe(null);
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 'Testpassword' })).toEqual({
            pattern: true
        });
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 'testpassword1' })).toEqual({
            pattern: true
        });
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 'testpassword' })).toEqual({
            pattern: true
        });
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: '123123123' })).toEqual({
            pattern: true
        });
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 'testPassword1' })).toBe(null);
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: '1testpassworD' })).toBe(null);
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 't3StP4ssw0rd' })).toBe(null);
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 't3Stpassword_' })).toEqual({
            pattern: true
        });
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 't3St-password' })).toEqual({
            pattern: true
        });
        expect(Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]+)$/)({ value: 't3St.password' })).toEqual({
            pattern: true
        });
    });

    it('should apply "equals" validation correctly', () => {
        const formGroup = new FormBuilder().group({
            password: ['test', Validators.required],
            confirmPassword: 'test'
        }, Validators.equals('password', 'confirmPassword'));

        expect(formGroup.valid).toBe(true);
        expect(formGroup.invalid).toBe(false);
        expect(formGroup.errors).toBe(null);

        expect(formGroup.get('password').valid).toBe(true);
        expect(formGroup.get('password').invalid).toBe(false);
        expect(formGroup.get('password').errors).toBe(null);

        formGroup.get('password').setValue('test1');

        expect(formGroup.valid).toBe(false);
        expect(formGroup.invalid).toBe(true);
        expect(formGroup.errors).toEqual({
            equals: true
        });

        formGroup.get('confirmPassword').setValue('test1');

        expect(formGroup.valid).toBe(true);
        expect(formGroup.invalid).toBe(false);
        expect(formGroup.errors).toBe(null);

        formGroup.setValue({
            password: '',
            confirmPassword: 'testing123'
        });

        expect(formGroup.valid).toBe(false);
        expect(formGroup.invalid).toBe(true);
        expect(formGroup.errors).toEqual({
            equals: true
        });

        expect(formGroup.get('password').valid).toBe(false);
        expect(formGroup.get('password').invalid).toBe(true);
        expect(formGroup.get('password').errors).toEqual({
            required: true
        });
    });
});