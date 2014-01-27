# jsoni (JSON improved)

Serialize and deserialize Javascript objects into JSON

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

var objStr = jsoni.stringify(obj);
/*
'{
    "a": "NaN",
    "b": "Infinity",
    "c": {
        "constructName": "RegExp",
        "data": {
            "source": "[abc]+def",
            "flags": "gi"
        }
    }
}'
*/

var objB = jsoni.parse(objStr);

// objB.c is a regular expression clone of obj.c
objB.c.toString();
// '/[abc]+def/gi'

objB.c.test('aaabbbcccdef');
// true

```

## Installation

```bash
npm install jsoni
```

## Dependencies

none

## API

### jsoni.stringify(value, [ replacer ], [ space ])

same as JSON.stringify

### jsoni.parse(value, [ reviver ])

same as JSON.parse

### jsoni.register(name, constructor, [ options ])

registers a constructor to serialize and deserialize

#### options

* serialize - Function to serialize an object. May return any value that can be stringified.
* deserialize - Function to reconstruct an object. Should return a constructed object

```javascript

var jsoni = require('jsoni');

function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function () {
    return 'hello, my name is ' + this.name + ' and I am ' + this.age + ' years old';
};

jsoni.register('Person', Person, {
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

var str = jsoni.stringify(me);
// '{"constructName":"Person","data":{"name":"Jayce","age":22}}'

var newMe = jsoni.parse(str);

newMe.greet();
// 'hello, my name is Jayce and I am 22 years old'

```

#### toJSON

If a constructor's prototype has a `toJSON` method, then `serialize` does not need to be specified.
`serialize` will take precedence over `toJSON` if it is specified. If neither are specified, then the
default behavior of `JSON.stringify` is used.

#### fromJSON

If a constructor has a `fromJSON` method (ex: `Person.fromJSON`, not `Person.prototype.fromJSON`), then
`deserialize` does not need to be specified. `deserialize` will take precedence over `fromJSON` if it
is specified. If neither are specified, then the json data will be passed directly into the constructor
(`new Constructor(data)`).

### jsoni.unregister(name)

unregister a constructor from jsoni

## Limitations

  - `undefined` connot be stringified or parsed
  - Will not work between REPL or browser frames. It checks the equality of an objects
  constructor to registered constructors. REPL and frame constructors are not equal to
  the same constructor in another frame.