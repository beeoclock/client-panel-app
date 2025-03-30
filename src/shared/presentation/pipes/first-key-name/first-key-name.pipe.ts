import {Pipe, PipeTransform} from '@angular/core';
import {getFirstKey} from '@shared/domain/first-key-name';

@Pipe({
	name: 'firstKeyName',
	standalone: true
})
export class FirstKeyNamePipe implements PipeTransform {

	/**
	 * Author: Ivan Karbashevskyi
	 * @param value
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public transform(value: unknown): string {
		return getFirstKey(value);
	}

}
