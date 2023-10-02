import {Pipe, PipeTransform} from '@angular/core';
import {getFirstKey} from '@utility/domain/first-key-name';

@Pipe({
	name: 'firstKeyName'
})
export class FirstKeyNamePipe implements PipeTransform {

	/**
	 * Author: Ivan Karbashevskyi
	 * @param value
	 * @param args
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public transform(value: any, ...args: unknown[]): string {
		return getFirstKey(value);
	}

}
