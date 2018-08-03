import { AbstractControl, FormGroup } from './models';

export class Validators {

    static required(control: AbstractControl): { required: boolean } | null;

    static requiredTrue(control: AbstractControl): { required: boolean } | null;

    static email(control: AbstractControl): { email: boolean } | null;

    static minlength(length: number): (control: AbstractControl) => { minlength: boolean } | null;

    static maxlength(length: number): (control: AbstractControl) => { maxlength: boolean } | null;

    static min(min: number): (control: AbstractControl) => { min: boolean } | null;

    static max(max: number): (control: AbstractControl) => { max: boolean } | null;

    static equals(c1: string, c2: string): (control: FormGroup) => { equals: boolean } | null;
}