import {Pipe, PipeTransform, input} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {

  public readonly class = input<string>();

  constructor(
    private readonly sanitizer: DomSanitizer
  ) {
  }

  public transform(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
