import {Directive, HostBinding} from "@angular/core";


@Directive({
	selector: 'label[floating]',
	standalone: true,
})
export class FloatingLabelDirective {

	@HostBinding()
	public class: string[] = [
		'dark:text-beeDarkColor-300',
		'block',
		'text-sm',
		'font-medium',
		'leading-6',
		'text-beeColor-900',
		'dark:text-white',
		'text-start',
		// Floating
		'absolute',
		'text-sm',
		'text-gray-400',
		'dark:text-gray-500',
		'duration-300',
		'transform',
		'-translate-y-4',
		'scale-75',
		'top-2',
		'z-10',
		'origin-[0]',
		'bg-white',
		'dark:bg-gray-900',
		'px-2',
		'peer-focus:px-2',
		'peer-focus:text-blue-600',
		'peer-focus:dark:text-blue-500',
		'peer-placeholder-shown:scale-100',
		'peer-placeholder-shown:-translate-y-1/2',
		'peer-placeholder-shown:top-1/2',
		'peer-focus:top-2',
		'peer-focus:scale-75',
		'peer-focus:-translate-y-4',
		'left-1'
	];

}
