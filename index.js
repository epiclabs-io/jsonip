// jsoniP JSON serializer/parser
// Originally by Jayce Pulsipher <jaycemp@gmail.com>, https://github.com/jaycetde/jsoni
// modified by Javier Peletier <jm@epiclabs.io>, https://github.com/epiclabs-io/jsonip


var registered = {};

require('./builtins')(register);

exports.stringify = stringify;
exports.parse = parse;

exports.register = register;
exports.unregister = unregister;

function stringify(value, replacer, space) {

    var val;


    val = JSON.stringify(value, function (key, value) {

        // replacer takes precedence
        if (replacer) value = replacer(key, value);

        if (value !== value) return 'NaN';
        if (value === Infinity) return 'Infinity';

        // is an object, but not an object literal
        if (typeof value === 'object' && value !== null && value.constructor !== Object && key != "__data") {
            for (var name in registered) {
                if (value.constructor === registered[name].construct) {

                    var data;

                    if (registered[name].serialize) {
                        data = registered[name].serialize(value);
                    } else {
                        if (value.serialize && typeof value.serialize === "function")
                            data = value.serialize();
                        else
                            data = value;
                    }

                    return {
                        __class: name,
                        __data: data
                    };

                }
            }
        }

        return value;

    }, space);

    return val;
}

function parse(text, reviver) {
    return JSON.parse(text, function (key, value) {

        // reviver takes precedence
        if (reviver) value = reviver(key, value);

        if (typeof value === 'string') {

            switch (value) {
                case 'NaN':
                    return NaN;
                case 'Infinity':
                    return Infinity;
            }

        }

        if (typeof value === 'object' && value !== null && value.__class) {

            var reg = registered[value.__class];
            if (reg) {
                if (reg.deserialize) {
                    return reg.deserialize(value.__data);
                } else {
                    var obj = new reg.construct();
                    var data = value.__data;
                    if (obj.deserialize && typeof obj.deserialize === "function") {
                        obj.deserialize(data);
                    }
                    else {
                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                obj[key] = data[key];
                            }
                        }
                    }
                    return obj;
                }
            } else {
                // Not in registered constructors, return data only
                value = value.__data;
            }

        }

        return value;

    });
}

function register(name, construct, options) {
    options = options || {};

    options.name = name;
    options.construct = construct;

    registered[name] = options;
}

function unregister(name) {

    delete registered[name];

}