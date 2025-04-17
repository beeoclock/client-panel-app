import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	standalone: true,
	selector: 'no-available',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslatePipe
	],
	host: {
		class: 'text-neutral-400 italic',
	},
	template: `
		<span [title]="'keyword.capitalize.noAvailable' | translate">
			{{ 'keyword.uppercase.noAvailable' | translate }}
		</span>
	`
})
export class NoAvailable {

}
