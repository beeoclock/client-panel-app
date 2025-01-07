import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {
	bootstrapArchive,
	bootstrapChatText,
	bootstrapCheck2,
	bootstrapCheck2All,
	bootstrapExclamation,
	bootstrapHourglassSplit,
	bootstrapPersonAdd,
	bootstrapSearch,
	bootstrapX,
	bootstrapXLg
} from "@ng-icons/bootstrap-icons";

import {tdesignUserUnknown} from "@ng-icons/tdesign-icons";
import {remixStickyNoteAddLine} from "@ng-icons/remixicon";

const bootstrapIcons = {
	bootstrapPersonAdd,
	bootstrapChatText,
	bootstrapCheck2All,
	bootstrapX,
	bootstrapXLg,
	bootstrapCheck2,
	bootstrapHourglassSplit,
	bootstrapExclamation,
	bootstrapSearch,
	bootstrapArchive
};

const tdesignIcons = {
	tdesignUserUnknown
};

const remixIcons = {
	remixStickyNoteAddLine
};

export type IconNameType =
	keyof typeof bootstrapIcons |
	keyof typeof remixIcons |
	keyof typeof tdesignIcons;

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	selector: 'app-icon',
	template: `
		<ng-icon [name]="name"/>
	`,
	host: {
		class: 'contents'
	},
	imports: [
		NgIconComponent
	],
	viewProviders: [
		provideIcons({
			...bootstrapIcons,
			...tdesignIcons,
			...remixIcons,
		})
	]
})
export class IconComponent {

	@Input({required: true})
	public name!: IconNameType;

}
