import {Pipe, PipeTransform} from '@angular/core';
import {getFirstKey} from '@utility/domain/first-key-name';

@Pipe({
	name: 'firstKeyName',
	standalone: true
})
export class FirstKeyNamePipe implements PipeTransform {

	/**
	 * Author: Ivan Karbashevskyi
	 * @param value
	 */
	 
	public transform(value: unknown): string {
		return getFirstKey(value);
	}

}
