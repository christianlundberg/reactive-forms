import { Validators } from '../../';

describe('FormGroup', () => {

    it('should apply required validation correctly', () => {
        expect(Validators.required({ value: 'Testing string' })).toBe(null);
        expect(Validators.required({ value: 100 })).toBe(null);
        expect(Validators.required({ value: 0 })).toBe(null);
        expect(Validators.required({ value: {} })).toBe(null);
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

    it('should apply minLength validation correctly', () => {
        expect(Validators.minLength(4)({ value: 'Test' })).toBe(null);
        expect(Validators.minLength(4)({ value: 'Wow' })).toEqual({minLength: true});
    });

    it('should apply maxLength validation correctly', () => {
        expect(Validators.maxLength(4)({ value: 'Test' })).toBe(null);
        expect(Validators.maxLength(4)({ value: 'This is a test' })).toEqual({maxLength: true});
    });
});