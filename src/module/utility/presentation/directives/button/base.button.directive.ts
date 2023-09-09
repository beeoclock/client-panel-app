import {Directive, HostBinding, HostListener, Input, OnInit} from "@angular/core";

export const enum ButtonTypeEnum {
	link = 'link',
	button = 'button',
}

export const enum ButtonColorEnum {
	primary = 'primary',
	default = 'default',
}

export const baseButtonClassList = [
	"transition-all",
	"flex",
	"w-full",
	"justify-center",
	"rounded-2xl",
	"dark:bg-black",
	"px-3",
	"py-1.5",
	"text-sm",
	"font-semibold",
	"leading-6",
	"text-white",
	"shadow-sm",
	"focus-visible:outline",
	"focus-visible:outline-2",
	"focus-visible:outline-offset-2"
];

export const baseLinkClassList = [
	'rounded-2xl',
	'px-4',
	'py-2',
	'flex',
	'items-center',
	'justify-start',
	'gap-2',
];

export const classListByButtonStyleType = {
	[ButtonTypeEnum.button]: {
		[ButtonColorEnum.primary]: [
			'bg-blue-600', 'hover:bg-blue-500', 'focus-visible:outline-blue-600'
		],
		[ButtonColorEnum.default]: [
			'bg-neutral-600', 'hover:bg-neutral-500', 'focus-visible:outline-neutral-600'
		]
	},
	[ButtonTypeEnum.link]: {
		[ButtonColorEnum.primary]: [
			'text-blue-600', 'hover:bg-blue-100', 'dark:hover:bg-beeDarkColor-800',
		],
		[ButtonColorEnum.default]: [
			'text-beeColor-800', 'hover:bg-beeColor-300', 'dark:text-white', 'dark:hover:800/50',
		]
	},
}

@Directive({
	selector: 'button[base]',
	standalone: true,
})
export class BaseButtonDirective implements OnInit {

	@Input()
	public scrollToFirstError: boolean = false;

	@HostBinding('class')
	public class: string[] = [];

	@HostListener('click', ['$event'])
	public onClick($event: MouseEvent): void {
		if (!this.scrollToFirstError) {
			return;
		}
		// TODO move the code below to service
		const {target} = $event;
		if (target instanceof HTMLButtonElement) {
			const {parentElement} = target;
			if (parentElement) {
				const invalidElement = parentElement.querySelector('.ng-invalid');
				if (invalidElement) {
					invalidElement.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'nearest',
					});
					if (invalidElement instanceof HTMLInputElement) {
						invalidElement.focus({
							preventScroll: true,
						});
					}
				}
			}
		}

	}

	protected type: ButtonTypeEnum = ButtonTypeEnum.button;
	protected color: ButtonColorEnum = ButtonColorEnum.primary

	public ngOnInit(): void {
		this.class = BaseButtonDirective.getTypeClassList(this.type);
		this.class = this.class.concat(BaseButtonDirective.getColorClassList(this.type, this.color));
	}

	public static getTypeClassList(buttonStyleType: ButtonTypeEnum): string[] {
		switch (buttonStyleType) {
			case ButtonTypeEnum.button:
				return baseButtonClassList;
			case ButtonTypeEnum.link:
				return baseLinkClassList;
		}
	}

	public static getColorClassList(type: ButtonTypeEnum, color: ButtonColorEnum): string[] {

		switch (color) {
			case ButtonColorEnum.primary:
				return classListByButtonStyleType[type][ButtonColorEnum.primary];
			case ButtonColorEnum.default:
				return classListByButtonStyleType[type][ButtonColorEnum.default];
		}

	}

}
