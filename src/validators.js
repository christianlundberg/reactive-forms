
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
}