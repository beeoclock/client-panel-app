import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {identityRouters} from "@identity/identity.routers";

@NgModule({
	imports: [
		RouterModule.forChild(identityRouters),
	]
})
export class IdentityModule {

}

export default IdentityModule;
