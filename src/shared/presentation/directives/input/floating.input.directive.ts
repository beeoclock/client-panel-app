import {Directive, HostBinding} from "@angular/core";

@Directive({
  selector: 'input[floating]',
  standalone: true,
})
export class FloatingInputDirective {

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
    'sm:leading-6',
		// Floating
		'block',
		'w-full',
		'text-sm',
		'text-gray-900',
		'bg-transparent',
		'rounded-lg',
		'border-1',
		'border-gray-300',
		'appearance-none',
		'dark:text-white',
		'dark:border-gray-600',
		'dark:focus:border-blue-500',
		'focus:outline-none',
		'focus:ring-0',
		'focus:border-blue-600',
		'peer'
  ];

}
