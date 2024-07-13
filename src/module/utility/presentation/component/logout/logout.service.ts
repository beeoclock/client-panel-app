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
	private readonly ngxLogger = inject(NGXLogger);
	private readonly tenantId$ = inject(TENANT_ID);

	public logout(): void {
		this.ngxLogger.info(LogoutService.name, 'logout');
		this.auth.signOut()
			.then(() => {
				this.tenantId$.next(null);
				this.router.navigate(['/', 'identity']).then();
			})
			.catch((error) => {
				this.ngxLogger.error(LogoutService.name, error);
			});
	}
}
