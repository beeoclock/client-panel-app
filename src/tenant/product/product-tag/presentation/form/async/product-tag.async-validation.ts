import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {from, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Injectable} from "@angular/core";


@Injectable()
export class ProductTagAsyncValidation {

	public constructor(
		private readonly sharedUow: SharedUow,
	) {
	}

	public nameExistAsyncValidator(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			const name = control.value;

			if (!name) {
				return of(null); // No validation error if the name is empty
			}

			return of(name).pipe(
				switchMap(() =>
					from(this.sharedUow.productTag.findByName(name)).pipe(
						map((customer) => !!customer), // Check if customer exists
						map((exists: boolean) => (exists ? {nameExists: true} : null)),
						catchError(() => of(null)) // Handle errors gracefully
					)
				)
			);
		};
	}
}
