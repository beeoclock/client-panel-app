import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Auth, ParsedToken} from '@angular/fire/auth';
import {RouterLink} from "@angular/router";

export interface BeeoclockParsedToken extends ParsedToken {
  role: string[];
}

@Component({
    selector: 'utility-dashboard-page',
    templateUrl: 'index.html',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        RouterLink
    ]
})
export default class Index implements OnInit {

  private readonly auth: Auth = inject(Auth);

  public ngOnInit(): void {
    this.auth.onAuthStateChanged(async (result) => {
      console.log(result);
      if (result) {
        const token = await result.getIdTokenResult(true);
        console.log(token);
        console.log(token.claims);
        const claims: BeeoclockParsedToken = token.claims as unknown as BeeoclockParsedToken;
        console.log(claims.role);
      }
    });
  }

}
