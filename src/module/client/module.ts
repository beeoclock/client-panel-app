import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {routers} from ".//presentation";


@NgModule({
	imports: [
		RouterModule.forChild(routers)
	]
})
export class Module {

}
