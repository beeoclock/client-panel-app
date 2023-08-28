import {Directive, HostBinding} from "@angular/core";

@Directive({
  selector: 'input[default]',
  standalone: true,
})
export class DefaultInputDirective {

  @HostBinding('class')
  public class: string[] = [
    'px-3',
    'block',
    'w-full',
    'rounded-md',
    'py-1.5',
    'text-beeColor-900',
    'dark:text-beeDarkColor-100',
    'dark:bg-beeDarkColor-900',
    'outline-0',
    'border',
    'border-beeColor-300',
    'dark:border-beeColor-700',
    'placeholder:text-beeColor-400',
    'focus:ring-2',
    'sm:text-sm',
    'sm:leading-6'
  ];

}
