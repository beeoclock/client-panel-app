import {AfterViewInit, Directive, ElementRef, HostBinding, inject, input, Renderer2} from "@angular/core";

/**
 * Directive to apply specific styles to table rows based on their type (header, body, footer).
 * This directive uses Renderer2 for DOM manipulation to ensure compatibility with Angular's rendering engine.
 */
@Directive({
  selector: '[tableRowFlex]',
  standalone: true,
})
export class RowTableFlexDirective implements AfterViewInit {

  /**
   * Input property to specify the type of the table row.
   * Can be 'header', 'body', or 'footer'. Default is 'body'.
   */
  public readonly tableRowFlex = input<'header' | 'body' | 'footer'>('body');

  /**
   * HostBinding to apply default classes to the table row element.
   */
  @HostBinding()
  public class = [
    'flex',
    'bg-white',
    'text-beeColor-700',
    'dark:bg-beeDarkColor-800',
    'dark:text-beeDarkColor-400',
  ];

  private readonly elementRef = inject(ElementRef<HTMLDivElement>);
  private readonly renderer = inject(Renderer2);

  /**
   * Lifecycle hook that is called after the view has been initialized.
   * Applies specific styles to the table row element based on the value of tableRowFlex.
   */
  public ngAfterViewInit() {
    const nativeElement = this.elementRef.nativeElement;

    switch (this.tableRowFlex()) {
      case 'header':
        this.renderer.addClass(nativeElement, 'font-bold');
        this.renderer.addClass(nativeElement, 'text-xs');
        this.renderer.addClass(nativeElement, 'uppercase');
        break;
      case 'body':
        this.renderer.addClass(nativeElement, 'hover:bg-beeColor-100');
        this.renderer.addClass(nativeElement, 'cursor-pointer');
        this.renderer.addClass(nativeElement, 'transition');
        this.renderer.addClass(nativeElement, 'even:bg-neutral-50');
        break;
    }
  }
}
