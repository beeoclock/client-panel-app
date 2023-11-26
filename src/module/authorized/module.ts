import {RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {routers} from "@authorized/presentation";
import {EventRequestedState} from "@event/state/event-requested/event-requested.state";


@NgModule({
	imports: [
		NgxsModule.forFeature([EventRequestedState]),
		RouterModule.forChild(routers),
	]
})
export class Module {
}
