# jsonj (JSON serializer / deserializer)
Serialize and deserialize Javascript objects into JSON adding metadata if necessary for type information so objects are deserialized with the corresponding prototype. Typescript support.


Note: preliminary documentation

It will serialize and deserialize these values (which JSON.stringify and JSON.parse will not):

* NaN
* Infinity
* Date
* Buffer
* RegExp
* all builtin error constructs (Error, SyntaxError, TypeError, ReferenceError, RangeError, EvalError, URIError)

If any core javascript objects are missing, please submit an issue or pull request

## Installation

```bash
npm install jsonj
```

## Dependencies

none

## API

### jsonj.register(name, constructor, [ optionalFunctions ])

registers a constructor to serialize and deserialize

#### optionalFunctions
An object with either or both the below properties:

* serialize - Function to serialize an object. May return any value.
* deserialize - Function to reconstruct an object. Must return a constructed object

### jsonj.serialize(value, [type])

Serializes `value` to a JSON representation. If the type is provided, no metadata will be included since it is assumed that the deserializing function knows what is the object is receiving.

### jsonj.deserialize(json, [type])

Deserializes `json` to the provided type. If no type is provided, it will be obtained from metadata within the json object, if present.


```javascript

var jsonj = require('jsonj');

function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function () {
    return 'hello, my name is ' + this.name + ' and I am ' + this.age + ' years old';
};

jsonj.register('Person', Person);

var me = new Person('Jayce', 22);

var json = jsonj.serialize(me); //no type information is given, so it is added as metadata
// {"__type":"Person","__data":{"name":"Jayce","age":22}}

var json2 = jsonj.serialize(me, Person); // resulting json can be simplified since we specify the type
// {"name":"Jayce","age":22}

var newMe = jsonj.deserialize(json);

newMe.greet();
// 'hello, my name is Jayce and I am 22 years old'

var newMe2 = jsonj.deserialize(json2,Person); // "cast" as Person when deserializing.
newMe2.greet();
// 'hello, my name is Jayce and I am 22 years old'


```
### Custom serializers/deserializers

You can add custom serializers/derserializers by adding a `serialize` or `deserialize` function to your class. In JavaScript, as a function attached to the constructor. In TypeScript, these would be public static functions.  You can also add serializers/deserializers by passing the functions to the `register` function.

#### serialize

If a serialize function was passed in the `register` call as an option, it is used. Otherwise, if the constructor has a serialize function, it is used to serialize the object instead. If neither are specified, then the object is serialized as key/value by default.

#### deserialize

If a deserialize function was passed in the `register`call as an option, it is used. Otherwise, jsonj will try to call a `deserialize` static method of the class. If neither are specified, jsonj will copy the json data memberwise.

### jsonj.unregister(name)

unregister a constructor from jsonj

### serializeMetadata

You can add a dictionary with type metadata to a constructor to specify a white list of properties that you want serialized, along with type information that will allow for serializing without embedded metadata.

```javascript

function Person(name, age) {
    this.name = name;
    this.age = age;
    this.birthDate = null;
    this.schools = [];
}

Person.prototype.sayHello = function () {

    console.log("Hello, I am " + this.name);

}

function School(name) {
    this.name = name;
}

Person.serializeMetadata = {
    name: "String",
    birthDate: "Date",
    schools: "School[]",
}

```
  
## Credits
Some ideas, the builtins and some example text taken from jaycetde's jsoni parser, https://github.com/jaycetde/jsoni, though jsonj serializes to JSON rather than parsing JSON.