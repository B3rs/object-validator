validator = require "validator"

class ObjectValidator
	@_isArray = ( value ) ->
	    value and
	        typeof value is 'object' and
	        value instanceof Array and
	        typeof value.length is 'number' and
	        typeof value.splice is 'function' and
	        not ( value.propertyIsEnumerable 'length' )

	@_typeOf = (obj) ->
		if obj == undefined or obj == null
	    	return String obj
	  	classToType = new Object
	  	for name in "Boolean Number String Function Array Date RegExp".split(" ")
	    	classToType["[object " + name + "]"] = name.toLowerCase()
	  	myClass = Object.prototype.toString.call obj
	  	if myClass of classToType
	    	return classToType[myClass]
	  	return "object"


	constructor:(@schema)->

	_toArrayIfNot: (val)->
		return if @_isArray(val) then [].push(val) else val

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

	@isValid: (obj, validation_schema)->
		return false if not obj?
		schema = validation_schema || @schema

		if 'presence_of' of obj
			fields = _toArrayIfNot schema['presence_of']

			for field in fields
				return false if not _validatePresence(field, obj) 

			if obj.strict_presence
				#strict validation is required
				for key of obj 
					return false if not key in fields

		if 'absence_of'
			fields = _toArrayIfNot schema['absence_of']
			for field in fields
				return false if not _validateAbsence field, obj

		if 'value_in'
			#i am expecting a {}
			rules = schema['value_in']

			for objectKey, values of rules
				return false if not _validatePresence objectKey, obj 
				return false if not (obj[objectKey] in values)  

		if 'value_not_in'
			#i am expecting a {}
			rules = schema['value_not_in']

			for objectKey, values of rules
				return false if not _validatePresence objectKey, obj 
				return false if (obj[objectKey] in values)  

		if 'type_check'
			for key, type in schema['type_check']
				return false if not _validatePresence key, obj 
				return false if @_typeOf(obj[key]) != type

		return true
