import {Component, ViewEncapsulation} from '@angular/core';
import {ParsedToken} from '@angular/fire/auth';
import {RouterLink} from "@angular/router";
import {CardComponent} from "@utility/presentation/component/card/card.component";

export interface BeeoclockParsedToken extends ParsedToken {
  role: string[];
  accountId: string;
  clientId: string;
}

@Component({
  selector: 'utility-dashboard-page',
  templateUrl: 'index.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
    imports: [
        RouterLink,
        CardComponent
    ]
})
export default class Index {

}
