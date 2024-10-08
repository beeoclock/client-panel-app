import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {
	bootstrapArrowClockwise,
	bootstrapArrowLeft,
	bootstrapArrowRepeat,
	bootstrapArrowRight,
	bootstrapArrowUpRight,
	bootstrapBellFill,
	bootstrapBoxArrowLeft,
	bootstrapBoxArrowRight,
	bootstrapBuildings,
	bootstrapCalendar,
	bootstrapCalendarX,
	bootstrapCart,
	bootstrapChatHeart,
	bootstrapChatText,
	bootstrapCheck2,
	bootstrapCheck2All,
	bootstrapCheckCircle,
	bootstrapCheckLg,
	bootstrapChevronDown,
	bootstrapChevronLeft,
	bootstrapChevronRight,
	bootstrapCircle,
	bootstrapClock,
	bootstrapCupHotFill,
	bootstrapDash,
	bootstrapDashCircle,
	bootstrapEnvelopeArrowUpFill,
	bootstrapEnvelopeAt,
	bootstrapEnvelopeExclamationFill,
	bootstrapExclamation,
	bootstrapExclamationTriangleFill,
	bootstrapEye,
	bootstrapEyeSlash,
	bootstrapFilePerson,
	bootstrapGear,
	bootstrapHourglass,
	bootstrapHourglassSplit,
	bootstrapList,
	bootstrapListCheck,
	bootstrapPencil,
	bootstrapPerson,
	bootstrapPersonAdd,
	bootstrapPersonCircle,
	bootstrapPlus,
	bootstrapPlusCircle,
	bootstrapPlusLg,
	bootstrapReceipt,
	bootstrapSend,
	bootstrapSortAlphaDown,
	bootstrapSortAlphaUp,
	bootstrapTelephone,
	bootstrapThreeDotsVertical,
	bootstrapToggleOff,
	bootstrapToggleOn,
	bootstrapTranslate,
	bootstrapTrash,
	bootstrapTrash3,
	bootstrapX,
	bootstrapXCircle,
	bootstrapXLg
} from "@ng-icons/bootstrap-icons";

import {tdesignUserUnknown} from "@ng-icons/tdesign-icons";

const bootstrapIcons = {
	bootstrapPerson,
	bootstrapPersonAdd,
	bootstrapChatText,
	bootstrapCheck2All,
	bootstrapX,
	bootstrapCheck2,
	bootstrapHourglassSplit,
	bootstrapExclamation,
	bootstrapChevronLeft,
	bootstrapChevronRight,
	bootstrapChevronDown,
	bootstrapTelephone,
	bootstrapEnvelopeAt,
	bootstrapSend,
	bootstrapArrowRight,
	bootstrapArrowLeft,
	bootstrapTrash,
	bootstrapTrash3,
	bootstrapToggleOn,
	bootstrapToggleOff,
	bootstrapEye,
	bootstrapEyeSlash,
	bootstrapPencil,
	bootstrapPersonCircle,
	bootstrapXLg,
	bootstrapCupHotFill,
	bootstrapCircle,
	bootstrapCheckCircle,
	bootstrapListCheck,
	bootstrapExclamationTriangleFill,
	bootstrapClock,
	bootstrapCart,
	bootstrapFilePerson,
	bootstrapArrowUpRight,
	bootstrapArrowClockwise,
	bootstrapPlusLg,
	bootstrapChatHeart,
	bootstrapGear,
	bootstrapDash,
	bootstrapPlus,
	bootstrapEnvelopeExclamationFill,
	bootstrapEnvelopeArrowUpFill,
	bootstrapBuildings,
	bootstrapHourglass,
	bootstrapXCircle,
	bootstrapCheckLg,
	bootstrapPlusCircle,
	bootstrapDashCircle,
	bootstrapReceipt,
	bootstrapBoxArrowLeft,
	bootstrapBellFill,
	bootstrapThreeDotsVertical,
	bootstrapTranslate,
	bootstrapArrowRepeat,
	bootstrapCalendar,
	bootstrapCalendarX,
	bootstrapBoxArrowRight,
	bootstrapSortAlphaDown,
	bootstrapSortAlphaUp,
	bootstrapList,
};

const tdesignIcons = {
	tdesignUserUnknown
};

export type IconNameType =
	keyof typeof bootstrapIcons |
	keyof typeof tdesignIcons;

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [
		`
			:host {
				display: inline-block;
				width: var(--ng-icon__size, 1em);
				height: var(--ng-icon__size, 1em);
				line-height: initial;
				vertical-align: initial;
				overflow: hidden;
			}
		`
	],
	selector: 'app-icon',
	template: `
		<ng-icon [name]="name"/>
	`,
	imports: [
		NgIconComponent
	],
	viewProviders: [
		provideIcons({
			...bootstrapIcons,
			...tdesignIcons,
		})
	]
})
export class IconComponent {

	@Input({required: true})
	public name!: IconNameType;

}
