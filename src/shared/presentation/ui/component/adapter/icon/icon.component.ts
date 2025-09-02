import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
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
import {ionAddOutline, ionRemoveOutline} from "@ng-icons/ionicons";

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

const ionicons = {
	ionAddOutline,
	ionRemoveOutline,
};

export type IconNameType =
	keyof typeof bootstrapIcons |
	keyof typeof remixIcons |
	keyof typeof ionicons |
	keyof typeof tdesignIcons;

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	selector: 'app-icon',
	template: `
		<ng-icon [name]="name()"/>
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
			...ionicons,
		})
	]
})
export class IconComponent {

	public readonly name = input.required<IconNameType>();

}
