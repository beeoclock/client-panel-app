import {Input, Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {

  @Input()
  public class: undefined | string;

  constructor(
    private readonly sanitizer: DomSanitizer
  ) {
  }

  public transform(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
