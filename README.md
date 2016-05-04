# jsonip (JSON improved)

Serialize and deserialize Javascript objects into JSON adding metadata for type information so objects are deserialized with the corresponding prototype.

(Forked from jaycetde's jsoni, https://github.com/jaycetde/jsoni )
* Main differences are the way objects are encapsulated and some fixes to work on the latest nodejs version, as well as Typescript support



It will stringify and parse these values (which JSON.stringify and JSON.parse will not):

* NaN
* Infinity
* new Date()
* new Buffer()
* new RegExp()
* all builtin error constructs (Error, SyntaxError, TypeError, ReferenceError, RangeError, EvalError, URIError)

If any core javascript objects are missing, please submit an issue or pull request

```javascript

var obj = {
    a: NaN,
    b: Infinity,
    c: /[abc]+def/gi
};

var objStr = jsonip.stringify(obj);
/*
'{
    "a": "NaN",
    "b": "Infinity",
    "c": {
        "__class": "RegExp",
        "__data": {
            "source": "[abc]+def",
            "flags": "gi"
        }
    }
}'
*/

var objB = jsonip.parse(objStr);

// objB.c is a regular expression clone of obj.c
objB.c.toString();
// '/[abc]+def/gi'

objB.c.test('aaabbbcccdef');
// true

```

## Installation

```bash
npm install jsonip
```

## Dependencies

none

## API

### jsonip.stringify(value, [ replacer ], [ space ])

same as JSON.stringify

### jsonip.parse(value, [ reviver ])

same as JSON.parse

### jsonip.register(name, constructor, [ options ])

registers a constructor to serialize and deserialize

#### options

* serialize - Function to serialize an object. May return any value that can be stringified.
* deserialize - Function to reconstruct an object. Should return a constructed object

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

var str = jsonip.stringify(me);
// '{"__class":"Person","__data":{"name":"Jayce","age":22}}'

var newMe = jsonip.parse(str);

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