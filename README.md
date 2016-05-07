# jsonip (JSON serializer / deserializer)

((preliminary documentation))

Serialize and deserialize Javascript objects into JSON adding metadata for type information so objects are deserialized with the corresponding prototype.

(Inspired by jaycetde's jsoni, https://github.com/jaycetde/jsoni )
* Main differences are the way objects are encapsulated and some fixes to work on the latest nodejs version, as well as Typescript support

It will serialize and deserialize these values (which JSON.stringify and JSON.parse will not):

* NaN
* Infinity
* new Date()
* new Buffer()
* new RegExp()
* all builtin error constructs (Error, SyntaxError, TypeError, ReferenceError, RangeError, EvalError, URIError)

If any core javascript objects are missing, please submit an issue or pull request

## Installation

```bash
npm install jsonip
```

## Dependencies

none

## API

### jsonip.serialize(value, type)

same as JSON.stringify

### jsonip.deserialize(json, type)

same as JSON.parse

### jsonip.register(name, constructor, [ optionalFunctions ])

registers a constructor to serialize and deserialize

#### optionalFunctions

* serialize - Function to serialize an object. May return any value that can be stringified.
* deserialize - Function to reconstruct an object. Must return a constructed object

```javascript

var jsoni = require('jsonip');

function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function () {
    return 'hello, my name is ' + this.name + ' and I am ' + this.age + ' years old';
};

jsonip.register('Person', Person, {
    serialize: function (person) {
        return {
            name: person.name,
            age: person.age
        };
    },
    deserialize: function (obj) {
        return new Person(obj.name, obj.age);
    }
});

var me = new Person('Jayce', 22);

var json = jsonip.serialize(me);
// '{"__type":"Person","__data":{"name":"Jayce","age":22}}'

var newMe = jsonip.parse(json);

newMe.greet();
// 'hello, my name is Jayce and I am 22 years old'

```

#### serialize

If a serialize function was passed in the `register` call as an option, it is used. Otherwise, if the object has a serialize function, it is used to serialize the object instead. If neither are specified, then the default behavior of `JSON.stringify` is used.

#### deserialize

If a deserialized function was passed in the `register`call as an option, it is used. Otherwise, jsonip will try to call a `deserialize` method on a new object calling the constructor without parameters. If neither are specified, jsonip will copy the json data memberwise.

### jsonip.unregister(name)

unregister a constructor from jsonip

## Limitations

  - `undefined` connot be stringified or parsed
  - Will not work between REPL or browser frames. It checks the equality of an objects
  constructor to registered constructors. REPL and frame constructors are not equal to
  the same constructor in another frame.