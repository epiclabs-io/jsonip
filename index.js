var registered = {}
  , withToJSON = []
;

require('./builtins')(register);

exports.stringify = stringify;
exports.parse = parse;

exports.register = register;
exports.unregister = unregister;

function stringify(value, replacer, space) {
    
    var i, val;
    
    i = withToJSON.length;
    
    while (--i >= 0) {
        registered[withToJSON[i]].construct.prototype.toJSON = null;
    }
    
    val = JSON.stringify(value, function (key, value) {
        
        // replacer takes precedence
        if (replacer) value = replacer(key, value);
        
        if (value !== value) return 'NaN';
        if (value === Infinity) return 'Infinity';
        
        // is an object, but not an object literal
        if (typeof value === 'object' && value !== null && value.constructor !== Object) {
            for (var name in registered) {
                if (value.constructor === registered[name].construct) {
                    
                    var data;
                    
                    if (registered[name].serialize) {
                        data = registered[name].serialize(value);
                    } else if (registered[name]._toJSON) {
                        data = registered[name]._toJSON.call(value);
                    } else {
                        data = value;
                    }
                    
                    return {
                        constructName: name,
                        data: data
                    };
                    
                }
            }
        }
        
        return value;
        
    }, space);

    i = withToJSON.length;
    
    while (--i >= 0) {
        registered[withToJSON[i]].construct.prototype.toJSON = registered[withToJSON[i]]._toJSON;
    }
    
    return val;
}

function parse(text, reviver) {
    return JSON.parse(text, function (key, value) {
        
        // reviver takes precedence
        if (reviver) value = reviver(key, value);
        
        if (typeof value === 'string') {
            
            switch(value) {
                case 'NaN':
                    return NaN;
                case 'Infinity':
                    return Infinity;
            }
            
        }
        
        if (typeof value === 'object' && value !== null && value.constructName) {
            
            if (registered[value.constructName]) {
                var reg = registered[value.constructName];
                
                if (reg.deserialize) {
                    return reg.deserialize(value.data);
                } else if (reg.construct.fromJSON) {
                    return reg.construct.fromJSON(value.data);
                } else {
                    return new reg.construct(value.data);
                }
            } else {
                // Not in registered constructors, return data only
                value = value.data;
            }
            
        }
        
        return value;
        
    });
}

function register(name, construct, options) {
    options = options || {};
    
    options.name = name;
    options.construct = construct;
    
    if (construct.prototype.toJSON) {
        withToJSON.push(name);
        options._toJSON = construct.prototype.toJSON;
    }
    
    registered[name] = options;
}

function unregister(name) {
    
    if (registered[name]._toJSON) {
        withToJSON.splice(withToJSON.indexOf(name), 1);
    }
    
    delete registered[name];
    
}