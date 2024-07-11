import {inject, Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Auth} from "@angular/fire/auth";
import {NGXLogger} from "ngx-logger";
import {TENANT_ID} from "@src/token";

@Injectable({
	providedIn: 'root'
})
export class LogoutService {

	private readonly router = inject(Router);
	private readonly auth = inject(Auth);
	private readonly logger = inject(NGXLogger);
	private readonly tenantId$ = inject(TENANT_ID);

	public logout(): void {
		this.auth.signOut()
			.then(() => {
				this.tenantId$.next(null);
				this.router.navigate(['/']).then();
			})
			.catch((error) => {
				this.logger.error(LogoutService.name, error);
			});
	}
}
