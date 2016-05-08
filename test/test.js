
var jsonj = require("../index");

function School(name) {
    this.name = name;
}

function Specialty(name) {
    this.name = name;
}


function Person(name, age) {
    this.name = name;
    this.age = age;
    this.birthDate = null;
    this.schools = [];
    this.favoriteNumbers = [1, 2, 3, 4, 5];
    this.zero = null;
    this.specialty = new Specialty("cooking");
}

Person.prototype.sayHello = function () {

    console.log("Hello, I am " + name);

}


var pepe = new Person("Pepe", 33);
pepe.schools.push(new School("Jander School"));


function serialize(obj) {

    var _class;

    if (typeof obj === 'object' && obj !== null && obj.constructor !== Object) {
        if (obj.constructor === Person) {
            _class = "PersonClass";
        } else if (obj.constructor === School) {
            _class = "SchoolClass";
        } else if (Array.isArray(obj)) {
            var arr = [];
            obj.forEach(function (v) {
                arr.push(serialize(v));
            });
            return arr;
        }
        else {
            throw "uknown object type";
        }

        var ret = { _class: _class };
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret[key] = serialize(obj[key]);
            }
        }
        return ret;

    }

    return obj;

}

function deserialize(jobj) {

    var ret;
    if (typeof jobj === 'object' && jobj !== null) {

        if (Array.isArray(jobj)) {
            ret = [];
            jobj.forEach(function (v) {
                ret.push(deserialize(v));
            });
        }
        else {

            var ctor = null;
            if (jobj._class) {
                if (jobj._class == "PersonClass")
                    ctor = Person;
                else if (jobj._class == "SchoolClass") {
                    ctor = School;
                }
                else {
                    throw "Unknown _class";
                }

                ret = new ctor();


            }
            else
                ret = {};

            for (var key in jobj) {
                if (jobj.hasOwnProperty(key) && key !== "_class") {
                    ret[key] = deserialize(jobj[key]);
                }
            }

        }
    }
    else
        ret = jobj;

    return ret;

}


Person.serializeMetadata = {
    name: "String",
    age: "Number",
    birthDate: "Date",
    schools: "School[]",
    zero: "any",
    specialty: "Specialty"
}



School.serializeMetadata = {
    name: "string"
}

Specialty.serializeMetadata = {
    name: "string"
}


jsonj.register("Person", Person);
jsonj.register("School", School);
jsonj.register("Specialty", Specialty);


/*
var s = serialize(pepe);
console.log(JSON.stringify(s, "\t"));

console.log(JSON.stringify(deserialize(s)));

*/

var PersonMap = jsonj.createMap(Person);

var map= new PersonMap();

    map.juan=new Person("Juan",11);
    map.pepe=pepe;
    map[5]=pepe;



var m = jsonj.serialize(map,"Map<Person>");
var n = jsonj.deserialize(m,"Map<Person>");

console.log(jsonj.serialize("Hello"));

//console.log(s = jsonj.stringify(pepe));
pepe.birthDate = new Date(1979, 3, 12);
var sp = jsonj.serialize(pepe, Person);

console.log(sp);

var p = jsonj.deserialize(sp, Person);

//console.log(jsonj.stringify(p));

//var p = jsonj.deserialize(sp, Person);

//var v = jsonj.parse(s);


//console.log(s = jsonj.stringify(v));
