import {inject, Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Auth} from "@angular/fire/auth";
import {NGXLogger} from "ngx-logger";
import {TENANT_ID} from "@src/token";
import {Store} from "@ngxs/store";
import {IdentityActions} from "@identity/module/identity/infrastructure/state/identity/identity.actions";

@Injectable({
	providedIn: 'root'
})
export class LogoutService {

	private readonly router = inject(Router);
	private readonly store = inject(Store);
	private readonly auth = inject(Auth);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly tenantId$ = inject(TENANT_ID);

	public logout(): void {
		this.ngxLogger.info(LogoutService.name, 'logout');
		this.auth.signOut()
			.then(() => {
				this.store.dispatch(new IdentityActions.ClearToken());
				this.tenantId$.next(null);
				this.router.navigate(['/', 'identity']).then();
			})
			.catch((error) => {
				this.ngxLogger.error(LogoutService.name, error);
			});
	}
}
