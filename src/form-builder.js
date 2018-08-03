import { FormGroup, FormControl } from './models';

export class FormBuilder {

    _createControl(config) {
        if (config instanceof FormControl || config instanceof FormGroup)
            return config;
        else if (Array.isArray(config))
            return this.control(config[0], config[1])
        return this.control(config);
    }

    _reduceControls(controlsConfig) {
        const controls = {};

        Object.keys(controlsConfig).forEach(controlName => {
            controls[controlName] = this._createControl(controlsConfig[controlName]);
        });

        return controls;
    }

    control(value, validators) {
        return new FormControl(value, validators);
    }

    group(controlsConfig, validators) {
        if (controlsConfig instanceof Array || !(controlsConfig instanceof Object))
            throw 'The group method requires a valid object';

        const controls = this._reduceControls(controlsConfig);

        return new FormGroup(controls, validators);
    }
}