import { FormGroup, FormControl } from './models';

export class FormBuilder {

    group(controlsConfig: { [key: string]: any;}): FormGroup{}

    control(value: any, validators): FormControl{}
}