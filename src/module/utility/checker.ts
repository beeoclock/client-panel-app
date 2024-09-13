import * as check from '@p4ck493/checker';

export const is = {
	...check.is,

	TouchEvent(value: any): value is TouchEvent {
		return value instanceof TouchEvent;
	},

	Document(value: any): value is Document {
		return value instanceof Document;
	},

	not_string(value: any): boolean {
		return !check.is.string(value);
	},

	not_object<RETURN_TYPE>(value: any): RETURN_TYPE {
		return !check.is.object(value) as RETURN_TYPE;
	},

	not_empty(value: any): boolean {
		return !check.is.empty(value);
	},

	not_boolean(value: any): boolean {
		return !check.is.boolean(value);
	},

	string_not_null(value: any): boolean {
		return check.is.string(value) && !check.is.null(value);
	},

	number_or_string(value: any): boolean {
		return check.is.number(value) || check.is.string(value);
	},

	not_number(value: any): boolean {
		return !check.is.number(value);
	},

	not_zero(value: any): boolean {
		return !check.is.zero(value);
	},

	not_array(value: any): boolean {
		return !check.is.array(value);
	},

	object_or_array(value: any): boolean {
		return check.is.object(value) || check.is.array(value);
	},

	HTMLElement(value: any): value is HTMLElement {
		return value instanceof HTMLElement;
	},

	not_HTMLElement(value: any): boolean {
		return !is.HTMLElement(value);
	},

	not_compare(value: any, compareValue: any): boolean {
		return !check.is.compare(value, compareValue);
	},

	object_not_null_or_empty<T>(value: any): value is T {
		return check.is.object(value) && !check.is.empty(value);
	},

	not_empty_or_null_or_undefined<T>(value: T): value is T {
		return !check.is.empty(value) && !check.is.null(value) && !check.is.undefined(value);
	},

	null_or_undefined_or_empty<T>(value: T): value is T {
		return check.is.null(value) || check.is.undefined(value) || check.is.empty(value);
	},

	not_undefined<T>(value: any): value is T {
		return !check.is.undefined(value);
	},

	not_null<T>(value: any): value is T {
		return !check.is.null(value);
	},

	null_or_undefined<T>(value: any): value is T {
		return check.is.null(value) || check.is.undefined(value);
	},

	not_null_or_undefined<T>(value: any): value is T {
		return !is.null_or_undefined(value);
	},

	not_null_or_undefined_or_empty<T>(value: T): boolean {
		return !is.null_or_undefined_or_empty(value);
	},

	string_or_object_not_empty(value: any): boolean {
		return check.is.string_not_empty(value) || check.is.object_not_empty(value);
	}
};
