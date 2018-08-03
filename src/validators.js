
export class Validators {

    static required({ value }) {
        const error = { required: true };
        if (value === undefined || value === null)
            return error;
        if ((Array.isArray(value) || typeof value === 'string') && !value.length)
            return error;
        if (typeof value === 'number' && value === 0)
            return error;
        if (typeof value === 'object' && !Object.getOwnPropertyNames(value).length)
            return error;
        return null;
    }

    static requiredTrue({ value }) {
        return value === true ? null : { required: true };
    }

    static email(control) {
        if (!control.value)
            return null;

        return /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/.test(control.value) ? null : { email: true };
    }

    static minlength(length) {
        return control => {
            if (!control.value)
                return null;

            return control.value.length >= length ? null : { minlength: true };
        }
    }

    static maxlength(length) {
        return control => {
            if (!control.value)
                return null;

            return control.value.length <= length ? null : { maxlength: true };
        }
    }

    static min(min) {
        return control => {
            if (!control.value)
                return null;

            const value = parseFloat(control.value);
            return !isNaN(value) && value < min ? { min: true } : null;
        }
    }

    static max(max) {
        return control => {
            if (!control.value)
                return null;

            const value = parseFloat(control.value);
            return !isNaN(value) && value > max ? { max: true } : null;
        }
    }

    static equals(c1, c2){
        return group => {
            return group.get(c1).value !== group.get(c2).value ? { equals: true } : null;
        }
    }
}