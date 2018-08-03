import { FormGroup, FormControl } from './models';

export class FormBuilder {

    group(controlsConfig: { [key: string]: any;}, validators?: Function | Function[]): FormGroup{}

    control(value: any, validators): FormControl{}
}