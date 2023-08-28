import {Directive, HostBinding, OnInit} from "@angular/core";

export const enum ButtonStyleTypeEnum {
  primary = 'primary',
  default = 'default',
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

  public static getButtonClassList(buttonStyleType: ButtonStyleTypeEnum): string[] {
    const classList = [
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
    ];
    switch (buttonStyleType) {
      case ButtonStyleTypeEnum.primary:
        classList.push('bg-blue-600', 'hover:bg-blue-500', 'focus-visible:outline-blue-600');
        break;
      case ButtonStyleTypeEnum.default:
        classList.push('bg-neutral-600', 'hover:bg-neutral-500', 'focus-visible:outline-neutral-600');
        break;
    }
    return classList;
  }

}
