import {inject, Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Auth} from "@angular/fire/auth";

@Injectable({
	providedIn: 'root'
})
export class LogoutService {

	public readonly router = inject(Router);
	public readonly auth = inject(Auth);

	public logout(): void {
		this.auth.signOut()
			.then(() => {
				this.router.navigate(['/']).then();
			})
			.catch((error) => {
				console.log(error);
			});
	}
}
