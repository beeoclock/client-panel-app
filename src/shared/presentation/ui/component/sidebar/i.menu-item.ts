import {IsActiveMatchOptions} from "@angular/router";


export interface IMenuItem {
	order: number;
	url?: string;
	icon?: string;
	badge?: string;
	translateKey: string;
	target?: '_blank';
	disabled?: boolean;
	externalLink?: boolean;
	visible: boolean;
	beta?: boolean;
	routerLinkActiveOptions: {
		exact: boolean;
	} | IsActiveMatchOptions;
	items?: IMenuItem[]
}
