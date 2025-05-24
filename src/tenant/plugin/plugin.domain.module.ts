import {importProvidersFrom, NgModule} from "@angular/core";
import {TenantPluginModule} from "@tenant/plugin/tenant-plugin/tenant-plugin.module";
import {PluginModule} from "@tenant/plugin/plugin/plugin.module";

@NgModule({
	providers: [
		importProvidersFrom(
			TenantPluginModule,
			PluginModule,
		)
	]
})
export class PluginDomainModule {

}
