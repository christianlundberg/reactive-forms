const VALID = 'VALID';
const INVALID = 'INVALID';
const DISABLED = 'DISABLED';

export class AbstractControl {

    value;

    validators;

    parent = null;

    status = VALID;

    errors = null;

    pristine = true;

    touched = false;

    _forEachChild() { }

    _updateTouched(options = {}) {
        this.touched = Object.getOwnPropertyNames(this.controls).some(name => !this.controls[name].touched);

        if (this.parent && !options.onlySelf) {
            this.parent._updateTouched(options);
        }
    }

    _updatePristine(options = {}) {
        this.pristine = Object.getOwnPropertyNames(this.controls).every(name => this.controls[name].pristine);

        if (this.parent && !options.onlySelf) {
            this.parent._updatePristine(options);
        }
    }

    _hasInvalidControls() {
        let invalid = false;

        this._forEachChild((control) => invalid = invalid || control.status === INVALID);

        return invalid;
    }

    _calculateStatus() {
        if (this.errors || this._hasInvalidControls())
            return INVALID;
        return VALID;
    }

    _runValidators() {
        if (!this.validators)
            return null;

        let errors = null;

        this.validators.map(validator => validator(this)).filter(error => error).forEach(error => errors = { ...errors, ...error });

        return errors;
    }

    updateValueAndValidity(options = {}) {
        this.status = VALID;
        this._updateValue();
        this.errors = this._runValidators();
        this.status = this._calculateStatus();

        if (this.parent && !options.onlySelf)
            this.parent.updateValueAndValidity(options);
    }

    markAsTouched(options = {}) {
        this.touched = true;

        if (this.parent && !options.onlySelf)
            this.parent.markAsTouched(options);

    }

    markAsUntouched(opts = {}) {
        this.touched = false;

        this._forEachChild(control => control.markAsUntouched({ onlySelf: true }));

        if (this.parent && !opts.onlySelf)
            this.parent._updateTouched(opts);

    }

    markAsDirty(options = {}) {
        this.pristine = false;

        if (this.parent && !options.onlySelf)
            this.parent.markAsDirty(options);

    }

    markAsPristine(opts = {}) {
        this.pristine = true;

        this._forEachChild(control => control.markAsPristine({ onlySelf: true }));

        if (this.parent && !opts.onlySelf)
            this.parent._updatePristine(opts);

    }

    setParent(parent) {
        if (parent instanceof FormGroup)
            this.parent = parent;
    }

    get(path) {
        if (!Array.isArray(path) && typeof path !== 'string')
            throw 'The path must be an array of control names (["user", "address", "street"]), or a string delimited by a dot ("user.address.street")';

        if (typeof path === 'string')
            path = path.split('.');

        if (!path.length)
            return null;

        return path.reduce((control, name) => {
            if (control instanceof FormGroup)
                return control.controls[name] || null;
            return null;
        }, this);
    }

    hasError(error) {
        if (!this.errors)
            return false;

        return Object.getOwnPropertyNames(this.errors).find(property => property === error) ? true : false;
    }

    get valid() {
        return this.status === VALID;
    }

    get invalid() {
        return this.status === INVALID;
    }

    get untouched() {
        return !this.touched;
    }

    get dirty() {
        return !this.pristine;
    }

    get root() {
        let root = this;

        while (root.parent)
            root = root.parent;

        return root;
    }
}

export class FormGroup extends AbstractControl {

    controls;
    value = {}

    constructor(controls, validators) {
        super();
        this.controls = controls;
        this.validators = validators ? validators instanceof Array ? validators : [validators] : null;

        this._setUpControls();
        this._forEachChild((control, key) => this.value[key] = control.value);
        this.updateValueAndValidity({ onlySelf: true });
    }

    _setUpControls() {
        this._forEachChild(control => control.setParent(this))
    }

    _forEachChild(cb) {
        Object.keys(this.controls).forEach(k => cb(this.controls[k], k));
    }

    _updateValue() {
        this.value = this._reduceValue();
    }

    _reduceValue() {
        const value = {};

        this._forEachChild((control, name) => {
            value[name] = control.value;
        });

        return value;
    }

    setValue(value, options) {

        if (!value instanceof Object)
            throw 'The value must match the structure of the form group.';

        const keys = Object.getOwnPropertyNames(this.controls);
        const valueKeys = Object.getOwnPropertyNames(value);

        if (keys.length != valueKeys.length)
            throw 'The value must match the structure of the form group.';

        keys.forEach(key => {
            if (!valueKeys.find(valueKey => valueKey === key))
                throw 'The value must match the structure of the form group.';

            this.controls[key].setValue(value[key], { onlySelf: true });
        });
    }

    patchValue(value, options = {}) {

        Object.keys(value).forEach(name => {
            if (this.controls[name])
                this.controls[name].patchValue(value[name], { onlySelf: true });
        });

        //this.updateValueAndValidity(options);
    }

    reset(value = {}, options = {}) {
        
        this._forEachChild((control, name) => {
            control.reset(value[name], { onlySelf: true });
        });

        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
    }
}

export class FormControl extends AbstractControl {

    constructor(value = null, validators) {
        super();
        this.value = value;
        this.validators = parseValidators(validators);
        this.updateValueAndValidity({ onlySelf: true });
    }

    _updateValue() { }

    setValue(value, options) {
        this.value = value;

        this.updateValueAndValidity();
        this.markAsDirty();
    }

    patchValue(value, options) {
        this.setValue(value, options);
    }

    reset(value = null, options = {}) {
        //console.log(value)
        this.setValue(value, options);
        this.markAsPristine(options);
        this.markAsUntouched(options);
    }
}

function parseValidators(validators) {
    if (!validators)
        return null;

    if (Array.isArray(validators)) {
        if (validators.every(validator => typeof validator === 'function'))
            return validators
        throw 'The validators argument expects a function or an array of functions';
    } else {
        if (typeof validators === 'function')
            return [validators];
        throw 'The validators argument expects a function or an array of functions';
    }

}