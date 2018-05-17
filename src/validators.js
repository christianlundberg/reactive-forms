
export class Validators{

    static required(control) {
        return control.value || control.value === 0 ? null : { required: true };
    }

    static email(control) {
        if (!control.value)
            return null;

        return /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/.test(control.value) ? null : { email: true };
    }

    static minLength(length) {
        return control => {
            if (!control.value)
                return null;

            return control.value.length >= length ? null : { minLength: true };
        }
    }

    static maxLength(length) {
        return control => {
            if (!control.value)
                return null;

            return control.value.length <= length ? null : { maxLength: true };
        }
    }
}