// jsoniP JSON serializer
// by Javier Peletier <jm@epiclabs.io>, https://github.com/epiclabs-io/jsonip
// Loosely based on the parser by Jayce Pulsipher <jaycemp@gmail.com>, https://github.com/jaycetde/jsoni



var registered = {};

require('./builtins')(register);

exports.serialize = serialize;
exports.deserialize = deserialize;

exports.register = register;
exports.unregister = unregister;

var arrayRegexp = /(?:(.*))\[\]/g;


function serialize(value, type) {

    if (!value)
        return null;

    var reg;
    if (typeof type == "function" && type.__type && (reg = registered[type.__type])) {
        if (value.constructor != type)
            throw new Error("value is not of type '" + type.__type + "'");

        var json = {};

        if (typeof reg.serialize === "function")
            json = reg.serialize(value);
        else {
            var meta = value.constructor.serializeMetadata;
            if (meta) {

                for (var key in meta) {
                    var t = meta[key];
                    var item = value[key];
                    if (registered[t]) {
                        json[key] = serialize(item, registered[t].construct);
                    }
                    else {
                        var match = arrayRegexp.exec(t);
                        if (match && match[1]) {
                            t = match[1];
                            if (item && !Array.isArray(item))
                                throw "Serialization error: Item with key " + key + " is not an array";

                            if (item) {

                                var arr = [];
                                for (var i = 0; i < item.length; i++) {
                                    var arrayItem = item[i];
                                    if (arrayItem && (registered[t] && registered[t].construct != arrayItem.constructor))
                                        throw "Item " + i + " in array is of the wrong type. Expected '" + t + "'";
                                    arr.push(serialize(arrayItem, arrayItem.constructor));
                                }
                                json[key] = arr;
                            }
                            else
                                json[key] = null;

                        }
                        else
                            json[key] = item;
                    }

                }

            }
            else {
                for (var key in value) {
                    if (value.hasOwnProperty(key))
                        json[key] = serialize(value[key]);
                }
            }

        }
        return json;
    }
    else if (value.constructor.__type && registered[value.constructor.__type]) {
        return {
            __type: value.constructor.__type,
            __data: serialize(value, value.constructor)
        }
    }
    else {
        if (Array.isArray(value)) {
            var arr = [];
            value.forEach(function (v) {
                arr.push(serialize(v));
            })
            value = arr;
        }

        return value;
    }


}


function deserialize(json, type) {

    if (!json)
        return null;

    var typeName;
    if (!type) {
        if (json.__type && (typeof json.__data != "undefined")) {
            typeName = json.__type;

            json = json.__data;

        }
        else {
            if (Array.isArray(json)) {
                var arr = [];
                json.forEach(function (v) {
                    arr.push(deserialize(v));
                })
                json = arr;
            }
            return json;
        }
    }
    else
        typeName = type.__type;

    var reg = registered[typeName];
    type = reg ? reg.construct : null;
    if (!type)
        throw new Error("Unregistered class '" + typeName + "'");

    var obj;

    if (typeof reg.deserialize === "function") {
        obj = reg.deserialize(json);
    }
    else {

        obj = new type();

        var meta = type.serializeMetadata;
        if (meta) {

            for (var key in meta) {
                var t = meta[key];
                var item = json[key];
                if (registered[t]) {
                    obj[key] = deserialize(item, registered[t].construct);
                }
                else {
                    var match = arrayRegexp.exec(t);
                    if (match && match[1]) {
                        t = match[1];
                        if (item && !Array.isArray(item))
                            throw "Deserialization error: Item with key " + key + " is not an array";

                        if (item) {

                            var arr = [];
                            var arrayType = registered[t] ? registered[t].construct : null;
                            for (var i = 0; i < item.length; i++) {
                                arr.push(deserialize(item[i], arrayType));
                            }
                            obj[key] = arr;
                        }
                        else
                            obj[key] = null;

                    }
                    else
                        obj[key] = item;
                }

            }
        }
        else {
            for (var key in json) {
                obj[key] = deserialize(json[key]);
            }
        }
    }
    return obj;

}


function register(name, construct, options) {
    options = options || {};

    options.name = name;
    options.construct = construct;

    if (typeof options.deserialize != "function" && typeof construct.deserialize == "function") {
        options.deserialize = construct.deserialize;
    }
    if (typeof options.serialize != "function" && typeof construct.serialize == "function") {
        options.serialize = construct.serialize;
    }

    construct.__type = name;
    registered[name] = options;
}

function unregister(name) {

    delete registered[name];

}