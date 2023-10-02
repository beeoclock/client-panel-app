import {Directive, HostBinding} from "@angular/core";


@Directive({
  selector: 'label[default]',
  standalone: true,
})
export class DefaultLabelDirective {

  @HostBinding('class')
  public class: string[] = [
    'dark:text-beeDarkColor-300',
    'block',
    'text-sm',
    'font-medium',
    'leading-6',
    'text-beeColor-900',
    'dark:text-white',
		'text-start',
  ];

}
