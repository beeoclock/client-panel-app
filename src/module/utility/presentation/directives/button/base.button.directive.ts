import {Directive, HostBinding, OnInit} from "@angular/core";

export const enum ButtonStyleTypeEnum {
  link = 'link',
  primary = 'primary',
  default = 'default',
}

export const baseButtonClassList = [
  "transition-all",
  "flex",
  "w-full",
  "justify-center",
  "rounded-md",
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
]

export const classListByButtonStyleType = {
  [ButtonStyleTypeEnum.link]: [
    'text-blue-600',
    'rounded-2xl',
    'px-4',
    'py-2',
    'hover:bg-blue-100',
    'dark:hover:bg-beeDarkColor-800',
    'flex',
    'items-center',
    'justify-start',
    'gap-3',
  ],
  [ButtonStyleTypeEnum.primary]: [
    'bg-blue-600', 'hover:bg-blue-500', 'focus-visible:outline-blue-600'
  ],
  [ButtonStyleTypeEnum.default]: [
    'bg-neutral-600', 'hover:bg-neutral-500', 'focus-visible:outline-neutral-600'
  ]
}

@Directive({
  selector: 'button[base]',
  standalone: true,
})
export class BaseButtonDirective implements OnInit {

  @HostBinding('class')
  public class: string[] = [];

  protected buttonStyleType = ButtonStyleTypeEnum.default;

  public ngOnInit(): void {
    this.class = BaseButtonDirective.getButtonClassList(this.buttonStyleType);
  }

  // TODO think about how to divide classes: text and background
  public static getButtonClassList(buttonStyleType: ButtonStyleTypeEnum): string[] {
    const classList: string[] = [];
    switch (buttonStyleType) {
      case ButtonStyleTypeEnum.primary:
        classList.push(
          ...baseButtonClassList,
          ...classListByButtonStyleType[ButtonStyleTypeEnum.primary]
        );
        break;
      case ButtonStyleTypeEnum.default:
        classList.push(
          ...baseButtonClassList,
          ...classListByButtonStyleType[ButtonStyleTypeEnum.default]
        );
        break;
      case ButtonStyleTypeEnum.link:
        classList.push(...classListByButtonStyleType[ButtonStyleTypeEnum.link]);
        break;
    }
    return classList;
  }

}
