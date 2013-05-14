validator = require "validator"

class ObjectValidator
	constructor:(@schema)->

	_isArray = ( value ) ->
		return Array.isArray value

	_typeOf = (obj) ->
		if obj == undefined or obj == null
	    	return String obj
	  	classToType = new Object
	  	for name in "Boolean Number String Function Array Date RegExp".split(" ")
	    	classToType["[object " + name + "]"] = name.toLowerCase()
	  	myClass = Object.prototype.toString.call obj
	  	if myClass of classToType
	    	return classToType[myClass]
	  	return "object"

	_toArrayIfNot: (val)->
		if _isArray(val) 
			return val
		else 
			return new Array(val) 

	_validatePresence: (field, obj)->
		if (field of obj)
			if obj[field]?
				return true
		return false

	_validateAbsence: (field, obj)->
		return not (field of obj)

	_in: (val, values)->
		return val in values

	_isKey: (key, obj)->
		return key of obj

	isValid: (obj, validation_schema)->
		return false if not obj?
		schema = validation_schema || @schema

		if 'presence_of' of schema
			fields = @_toArrayIfNot schema['presence_of']
			for field in fields
				return false if not @_validatePresence(field, obj) 

			if schema.strict_presence
				#strict validation is required
				for key of obj 
					return false if not (key in fields)

		if 'absence_of' of schema
			fields = @_toArrayIfNot schema['absence_of']
			for field in fields
				return false if not @_validateAbsence field, obj

		if 'value_in' of schema
			#i am expecting a {}
			rules = schema['value_in']

			for objectKey, values of rules
				return false if not @_validatePresence objectKey, obj 
				return false if not (obj[objectKey] in @_toArrayIfNot values)  

		if 'value_not_in' of schema
			#i am expecting a {}
			rules = schema['value_not_in']

			for objectKey, values of rules
				return false if not @_validatePresence objectKey, obj 
				return false if (obj[objectKey] in @_toArrayIfNot values)  

		if 'type_check' of schema
			for key, type of schema['type_check']
				return false if not @_validatePresence key, obj
				return false if _typeOf(obj[key]) != type

		return true

exports.ObjectValidator = ObjectValidator
