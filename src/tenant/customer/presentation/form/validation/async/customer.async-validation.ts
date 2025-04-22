import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {from, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Injectable} from "@angular/core";


@Injectable()
export class CustomerAsyncValidation {

	public constructor(
		private readonly sharedUow: SharedUow,
	) {
	}

	public emailExistAsyncValidator(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			const email = control.value;

			if (!email) {
				return of(null); // No validation error if the email is empty
			}

			return of(email).pipe(
				switchMap(() =>
					from(this.sharedUow.customer.fundOneByEmail(email)).pipe(
						map((customer) => !!customer), // Check if customer exists
						map((exists: boolean) => (exists ? {emailExists: true} : null)),
						catchError(() => of(null)) // Handle errors gracefully
					)
				)
			);
		};
	}

	public phoneExistAsyncValidator(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			const phone = control.value;

			if (!phone) {
				return of(null); // No validation error if the phone is empty
			}

			return of(phone).pipe(
				switchMap(() =>
					from(
						this.sharedUow.customer.fundOneByPhone(phone)
					).pipe(
						map((customer) => !!customer), // Check if customer exists
						switchMap((exists: boolean) => {
							if (exists && !phone.startsWith('+')) {
								return of(exists);
							}
							return from(
								this.sharedUow.customer.fundOneByPhone(phone.replace('+', ''))
							).pipe(
								map((customer) => !!customer) // Check if customer exists
							)
						}),
						map((exists: boolean) => (exists ? {phoneExists: true} : null)),
						catchError(() => of(null)) // Handle errors gracefully
					)
				)
			);
		};
	}
}
