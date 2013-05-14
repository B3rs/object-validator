(function() {
  var ObjectValidator, validator,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  validator = require("validator");

  ObjectValidator = (function() {
    var _isArray, _typeOf;

    function ObjectValidator(schema) {
      this.schema = schema;
    }

    _isArray = function(value) {
      return Array.isArray(value);
    };

    _typeOf = function(obj) {
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

    ObjectValidator.prototype._toArrayIfNot = function(val) {
      if (_isArray(val)) {
        return val;
      } else {
        return new Array(val);
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

    ObjectValidator.prototype.isValid = function(obj, validation_schema) {
      var field, fields, key, objectKey, rules, schema, type, values, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      if (!(obj != null)) return false;
      schema = validation_schema || this.schema;
      if ('presence_of' in schema) {
        fields = this._toArrayIfNot(schema['presence_of']);
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          if (!this._validatePresence(field, obj)) return false;
        }
        if (schema.strict_presence) {
          for (key in obj) {
            if (!(__indexOf.call(fields, key) >= 0)) return false;
          }
        }
      }
      if ('absence_of' in schema) {
        fields = this._toArrayIfNot(schema['absence_of']);
        for (_j = 0, _len2 = fields.length; _j < _len2; _j++) {
          field = fields[_j];
          if (!this._validateAbsence(field, obj)) return false;
        }
      }
      if ('value_in' in schema) {
        rules = schema['value_in'];
        for (objectKey in rules) {
          values = rules[objectKey];
          if (!this._validatePresence(objectKey, obj)) return false;
          if (!(_ref = obj[objectKey], __indexOf.call(this._toArrayIfNot(values), _ref) >= 0)) {
            return false;
          }
        }
      }
      if ('value_not_in' in schema) {
        rules = schema['value_not_in'];
        for (objectKey in rules) {
          values = rules[objectKey];
          if (!this._validatePresence(objectKey, obj)) return false;
          if ((_ref2 = obj[objectKey], __indexOf.call(this._toArrayIfNot(values), _ref2) >= 0)) {
            return false;
          }
        }
      }
      if ('type_check' in schema) {
        _ref3 = schema['type_check'];
        for (key in _ref3) {
          type = _ref3[key];
          if (!this._validatePresence(key, obj)) return false;
          if (_typeOf(obj[key]) !== type) return false;
        }
      }
      return true;
    };

    return ObjectValidator;

  })();

  exports.ObjectValidator = ObjectValidator;

}).call(this);
