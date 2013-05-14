(function() {
  var ObjectValidator, validator,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  validator = require("validator");

  ObjectValidator = (function() {

    ObjectValidator._isArray = function(value) {
      return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    };

    ObjectValidator._typeOf = function(obj) {
      var classToType, myClass, name, _i, _len, _ref;
      if (obj === void 0 || obj === null) return String(obj);
      classToType = new Object;
      _ref = "Boolean Number String Function Array Date RegExp".split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        classToType["[object " + name + "]"] = name.toLowerCase();
      }
      myClass = Object.prototype.toString.call(obj);
      if (myClass in classToType) return classToType[myClass];
      return "object";
    };

    function ObjectValidator(schema) {
      this.schema = schema;
    }

    ObjectValidator.prototype._toArrayIfNot = function(val) {
      if (this._isArray(val)) {
        return [].push(val);
      } else {
        return val;
      }
    };

    ObjectValidator.prototype._validatePresence = function(field, obj) {
      if (field in obj) if (obj[field] != null) return true;
      return false;
    };

    ObjectValidator.prototype._validateAbsence = function(field, obj) {
      return !(field in obj);
    };

    ObjectValidator.prototype._in = function(val, values) {
      return __indexOf.call(values, val) >= 0;
    };

    ObjectValidator.prototype._isKey = function(key, obj) {
      return key in obj;
    };

    ObjectValidator.isValid = function(obj, validation_schema) {
      var field, fields, key, objectKey, rules, schema, type, values, _i, _j, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4;
      if (!(obj != null)) return false;
      schema = validation_schema || this.schema;
      if ('presence_of' in obj) {
        fields = _toArrayIfNot(schema['presence_of']);
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          if (!_validatePresence(field, obj)) return false;
        }
        if (obj.strict_presence) {
          for (key in obj) {
            if (_ref = !key, __indexOf.call(fields, _ref) >= 0) return false;
          }
        }
      }
      if ('absence_of') {
        fields = _toArrayIfNot(schema['absence_of']);
        for (_j = 0, _len2 = fields.length; _j < _len2; _j++) {
          field = fields[_j];
          if (!_validateAbsence(field, obj)) return false;
        }
      }
      if ('value_in') {
        rules = schema['value_in'];
        for (objectKey in rules) {
          values = rules[objectKey];
          if (!_validatePresence(objectKey, obj)) return false;
          if (!(_ref2 = obj[objectKey], __indexOf.call(values, _ref2) >= 0)) {
            return false;
          }
        }
      }
      if ('value_not_in') {
        rules = schema['value_not_in'];
        for (objectKey in rules) {
          values = rules[objectKey];
          if (!_validatePresence(objectKey, obj)) return false;
          if ((_ref3 = obj[objectKey], __indexOf.call(values, _ref3) >= 0)) {
            return false;
          }
        }
      }
      if ('type_check') {
        _ref4 = schema['type_check'];
        for (type = 0, _len3 = _ref4.length; type < _len3; type++) {
          key = _ref4[type];
          if (!_validatePresence(key, obj)) return false;
          if (this._typeOf(obj[key]) !== type) return false;
        }
      }
      return true;
    };

    return ObjectValidator;

  })();

}).call(this);
