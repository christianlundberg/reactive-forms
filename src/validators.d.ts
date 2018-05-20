import { AbstractControl } from './models';

export class Validators {
    
        static required(control: AbstractControl) :  { required: boolean } | null;

        static requiredTrue(control: AbstractControl) : { required: boolean } | null;

        static email(control: AbstractControl) : { email: boolean } | null;

        static minlength(length: number) : (control: AbstractControl) => { minlength: boolean } | null;

        static maxlength(length: number) : (control: AbstractControl) => { maxlength: boolean } | null;
    }