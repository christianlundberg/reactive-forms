
export abstract class AbstractControl {

    value: any;
    validators: Function[];
    parent: FormGroup;
    status: string;
    valid: boolean;
    invalid: boolean;
    errors: { [key: string]: boolean };
    pristine: boolean;
    dirty: boolean;
    untouched: boolean;
    touched: boolean;
    enabled: boolean;
    disabled: boolean;
    root: FormGroup;
    get(path: string | Array<string>): AbstractControl;
    disable(options: Options): void;
    enable(options: Options): void;
    markAsTouched(options: Options): void;
    markAsUntouched(options: Options): void;
    markAsDirty(options: Options): void;
    markAsPristine(options: Options): void;
    setParent(parent: FormGroup): void;
    hasError(error: string): boolean;
    abstract setValue(value: any): void;
    abstract patchValue(value: any): void;
    abstract reset(): void;
}

export class FormGroup extends AbstractControl {

    controls: {
        [key: string]: AbstractControl;
    };

    setValue(value: {
        [key: string]: any;
    }, options: Options): void;

    patchValue(value: {
        [key: string]: any;
    }, options: Options): void;

    reset(value?: {
        [key: string]: any;
    }, options?: Options): void;

    getRawValue(): any;
}

export class FormControl extends AbstractControl {

    setValue(value: {
        [key: string]: any;
    }, options: Options): void;

    patchValue(value: {
        [key: string]: any;
    }, options: Options): void;

    reset(value?: any, options?: Options): void;
}

interface Options {
    onlySelf?: boolean
}