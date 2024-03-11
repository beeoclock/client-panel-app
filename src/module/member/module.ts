import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {routers} from "@member/presentation";


@NgModule({
	imports: [
		RouterModule.forChild(routers)
	]
})
export class Module {
}
