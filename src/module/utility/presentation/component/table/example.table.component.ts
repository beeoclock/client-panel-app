import {Component, Input, ViewEncapsulation} from '@angular/core';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/component/pagination/pagination.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'utility-example-table-component',
  standalone: true,
  imports: [
    TableComponent,
    HeaderTableComponent,
    BodyTableComponent,
    PaginationComponent,
    NgForOf
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <utility-table-component>
      <thead utility-header-table-component>
      <tr>
        <th class="sort pe-1 align-middle white-space-nowrap desc" data-sort="name">
          Customer
        </th>
        <th class="sort pe-1 align-middle white-space-nowrap" data-sort="email">
          Email
        </th>
        <th class="sort align-middle white-space-nowrap text-end pe-4" data-sort="payment">
          Payment
        </th>
      </tr>
      </thead>
      <tbody utility-body-table-component>
      <tr class="btn-reveal-trigger" *ngFor="let item of items">
        <th class="align-middle white-space-nowrap name">
          <a href="../../app/e-commerce/customer-details.html">
            {{ item.fullName }}
          </a>
        </th>
        <td class="align-middle white-space-nowrap email">
          {{ item.email }}
        </td>
        <td class="align-middle text-end fs-0 white-space-nowrap payment">
            <span class="badge badge rounded-pill badge-soft-success">
              {{ item.payment ? 'success' : 'bad' }}
            </span>
        </td>
      </tr>
      </tbody>
    </utility-table-component>
    <utility-pagination-component></utility-pagination-component>
  `
})
export class ExampleTableComponent {

  @Input()
  public total = 5;

  public readonly mocItems = [
    {
      "fullName": "Sybila Colvin",
      "email": "scolvin0@edublogs.org",
      "payment": true
    }, {
      "fullName": "Sheppard Emslie",
      "email": "semslie1@who.int",
      "payment": false
    }, {
      "fullName": "Vonni Alderwick",
      "email": "valderwick2@umich.edu",
      "payment": false
    }, {
      "fullName": "Philip Klementz",
      "email": "pklementz3@homestead.com",
      "payment": true
    }, {
      "fullName": "Gilberto Takis",
      "email": "gtakis4@icq.com",
      "payment": true
    }, {
      "fullName": "Binny Sailor",
      "email": "bsailor5@twitter.com",
      "payment": false
    }, {
      "fullName": "Dilan Stiffell",
      "email": "dstiffell6@freewebs.com",
      "payment": false
    }, {
      "fullName": "Cassie Grute",
      "email": "cgrute7@wufoo.com",
      "payment": false
    }, {
      "fullName": "Christian Hance",
      "email": "chance8@un.org",
      "payment": false
    }, {
      "fullName": "Temp Boutcher",
      "email": "tboutcher9@ted.com",
      "payment": true
    }, {
      "fullName": "Ninnetta Doud",
      "email": "ndouda@amazonaws.com",
      "payment": false
    }, {
      "fullName": "Rozina Burnsyde",
      "email": "rburnsydeb@simplemachines.org",
      "payment": true
    }, {
      "fullName": "Malachi Copozio",
      "email": "mcopozioc@businessweek.com",
      "payment": false
    }, {
      "fullName": "Johann Wetherhead",
      "email": "jwetherheadd@hc360.com",
      "payment": true
    }, {
      "fullName": "Matteo Spaldin",
      "email": "mspaldine@springer.com",
      "payment": true
    }, {
      "fullName": "Evvie Stobart",
      "email": "estobartf@adobe.com",
      "payment": false
    }, {
      "fullName": "beeColor Biskupiak",
      "email": "gbiskupiakg@netvibes.com",
      "payment": false
    }, {
      "fullName": "Vale Farfalameev",
      "email": "vfarfalameevh@unesco.org",
      "payment": true
    }, {
      "fullName": "Bobbi MacTrustam",
      "email": "bmactrustami@blogspot.com",
      "payment": false
    }, {
      "fullName": "Jeannine Shimmings",
      "email": "jshimmingsj@reddit.com",
      "payment": false
    }, {
      "fullName": "Edy Angeli",
      "email": "eangelik@weebly.com",
      "payment": true
    }, {
      "fullName": "Kacy Sprull",
      "email": "ksprulll@oaic.gov.au",
      "payment": true
    }, {
      "fullName": "Dalston Beddoes",
      "email": "dbeddoesm@sphinn.com",
      "payment": false
    }, {
      "fullName": "Georgia Velareal",
      "email": "gvelarealn@dell.com",
      "payment": false
    }, {
      "fullName": "Frederica Layhe",
      "email": "flayheo@harvard.edu",
      "payment": true
    }, {
      "fullName": "Dawn Baynard",
      "email": "dbaynardp@creativecommons.org",
      "payment": true
    }, {
      "fullName": "Dedie Ingon",
      "email": "dingonq@rakuten.co.jp",
      "payment": true
    }, {
      "fullName": "Brooks Harlow",
      "email": "bharlowr@privacy.gov.au",
      "payment": false
    }, {
      "fullName": "Lazarus Haynesford",
      "email": "lhaynesfords@zdnet.com",
      "payment": false
    }, {
      "fullName": "Ronalda Beinke",
      "email": "rbeinket@is.gd",
      "payment": true
    }, {
      "fullName": "Augy Elms",
      "email": "aelmsu@europa.eu",
      "payment": false
    }, {
      "fullName": "Tammie Hedlestone",
      "email": "thedlestonev@ehow.com",
      "payment": false
    }, {
      "fullName": "Halimeda Arzu",
      "email": "harzuw@yale.edu",
      "payment": false
    }, {
      "fullName": "Waneta Chavez",
      "email": "wchavezx@shinystat.com",
      "payment": true
    }, {
      "fullName": "Sawyere Pavis",
      "email": "spavisy@ucsd.edu",
      "payment": false
    }, {
      "fullName": "Kele Bartolomeu",
      "email": "kbartolomeuz@hc360.com",
      "payment": false
    }, {
      "fullName": "Edin Biagini",
      "email": "ebiagini10@google.cn",
      "payment": false
    }, {
      "fullName": "Howie Dyment",
      "email": "hdyment11@seesaa.net",
      "payment": true
    }, {
      "fullName": "Masha Halgarth",
      "email": "mhalgarth12@twitpic.com",
      "payment": true
    }, {
      "fullName": "Wallache Shilleto",
      "email": "wshilleto13@example.com",
      "payment": true
    }, {
      "fullName": "Roma Szymanzyk",
      "email": "rszymanzyk14@skyrock.com",
      "payment": false
    }, {
      "fullName": "Bern McComas",
      "email": "bmccomas15@hubpages.com",
      "payment": true
    }, {
      "fullName": "Gradeigh Tille",
      "email": "gtille16@nytimes.com",
      "payment": true
    }, {
      "fullName": "Theodosia Haywood",
      "email": "thaywood17@dell.com",
      "payment": true
    }, {
      "fullName": "Blakeley holmes",
      "email": "bholmes18@xinhuanet.com",
      "payment": true
    }, {
      "fullName": "Parke Grattage",
      "email": "pgrattage19@moonfruit.com",
      "payment": false
    }, {
      "fullName": "Kerr Ifill",
      "email": "kifill1a@bloglovin.com",
      "payment": false
    }, {
      "fullName": "Nikaniki Blackaller",
      "email": "nblackaller1b@blogspot.com",
      "payment": false
    }, {
      "fullName": "Goldie Mainland",
      "email": "gmainland1c@people.com.cn",
      "payment": true
    }, {
      "fullName": "Tandie Sandaver",
      "email": "tsandaver1d@oaic.gov.au",
      "payment": false
    }, {
      "fullName": "Salome Trimnell",
      "email": "strimnell1e@ftc.gov",
      "payment": true
    }, {
      "fullName": "Lorry Burlingham",
      "email": "lburlingham1f@ebay.com",
      "payment": true
    }, {
      "fullName": "Torrie Alelsandrowicz",
      "email": "talelsandrowicz1g@arstechnica.com",
      "payment": false
    }, {
      "fullName": "Bette Deaconson",
      "email": "bdeaconson1h@slate.com",
      "payment": false
    }, {
      "fullName": "Cassie Spellard",
      "email": "cspellard1i@constantcontact.com",
      "payment": true
    }, {
      "fullName": "Rudolf Shayes",
      "email": "rshayes1j@msu.edu",
      "payment": false
    }, {
      "fullName": "Catlee Alasdair",
      "email": "calasdair1k@apple.com",
      "payment": true
    }, {
      "fullName": "Gerrie Carlesi",
      "email": "gcarlesi1l@google.com.hk",
      "payment": false
    }, {
      "fullName": "Mariquilla McBeth",
      "email": "mmcbeth1m@rediff.com",
      "payment": true
    }, {
      "fullName": "Benton Fern",
      "email": "bfern1n@dyndns.org",
      "payment": true
    }, {
      "fullName": "Lane Chelnam",
      "email": "lchelnam1o@biblegateway.com",
      "payment": true
    }, {
      "fullName": "Davie Boyn",
      "email": "dboyn1p@senate.gov",
      "payment": false
    }, {
      "fullName": "Humfrey Griffiths",
      "email": "hgriffiths1q@moonfruit.com",
      "payment": true
    }, {
      "fullName": "Timothy Aime",
      "email": "taime1r@bravesites.com",
      "payment": true
    }, {
      "fullName": "Lesley Baradel",
      "email": "lbaradel1s@dmoz.org",
      "payment": false
    }, {
      "fullName": "Tilly Tuminini",
      "email": "ttuminini1t@psu.edu",
      "payment": true
    }, {
      "fullName": "Berty Siveyer",
      "email": "bsiveyer1u@businessweek.com",
      "payment": false
    }, {
      "fullName": "Corene Tompsett",
      "email": "ctompsett1v@oakley.com",
      "payment": false
    }, {
      "fullName": "Orelie Ecclesall",
      "email": "oecclesall1w@vimeo.com",
      "payment": true
    }, {
      "fullName": "Kippar Marsie",
      "email": "kmarsie1x@ifeng.com",
      "payment": false
    }, {
      "fullName": "Goldina Zanini",
      "email": "gzanini1y@yolasite.com",
      "payment": false
    }, {
      "fullName": "Stephie McSporrin",
      "email": "smcsporrin1z@webmd.com",
      "payment": true
    }, {
      "fullName": "Kristan Perel",
      "email": "kperel20@uiuc.edu",
      "payment": false
    }, {
      "fullName": "Ulysses Tumasian",
      "email": "utumasian21@issuu.com",
      "payment": false
    }, {
      "fullName": "Leanna Kobisch",
      "email": "lkobisch22@homestead.com",
      "payment": true
    }, {
      "fullName": "Friederike Livens",
      "email": "flivens23@tiny.cc",
      "payment": false
    }, {
      "fullName": "Caron Emmanuel",
      "email": "cemmanuel24@parallels.com",
      "payment": true
    }, {
      "fullName": "Jackquelin D'Antuoni",
      "email": "jdantuoni25@walmart.com",
      "payment": false
    }, {
      "fullName": "Rogerio Quiddinton",
      "email": "rquiddinton26@tinypic.com",
      "payment": false
    }, {
      "fullName": "Cassie MacCosty",
      "email": "cmaccosty27@deviantart.com",
      "payment": true
    }, {
      "fullName": "Fleur M'Quhan",
      "email": "fmquhan28@vkontakte.ru",
      "payment": false
    }, {
      "fullName": "Minne McColley",
      "email": "mmccolley29@1688.com",
      "payment": false
    }, {
      "fullName": "Brian Redgate",
      "email": "bredgate2a@1688.com",
      "payment": false
    }, {
      "fullName": "Margy Mantrup",
      "email": "mmantrup2b@amazon.com",
      "payment": true
    }, {
      "fullName": "Paulo Hallum",
      "email": "phallum2c@ihg.com",
      "payment": true
    }, {
      "fullName": "Robbert Sames",
      "email": "rsames2d@ask.com",
      "payment": true
    }, {
      "fullName": "Christye Coverdill",
      "email": "ccoverdill2e@xinhuanet.com",
      "payment": false
    }, {
      "fullName": "Glenine McKaile",
      "email": "gmckaile2f@drupal.org",
      "payment": false
    }, {
      "fullName": "Tome Stoak",
      "email": "tstoak2g@usatoday.com",
      "payment": false
    }, {
      "fullName": "Myranda Geering",
      "email": "mgeering2h@taobao.com",
      "payment": false
    }, {
      "fullName": "Dev Drepp",
      "email": "ddrepp2i@google.fr",
      "payment": false
    }, {
      "fullName": "Rosanne O'Sherin",
      "email": "rosherin2j@weibo.com",
      "payment": false
    }, {
      "fullName": "Griz Staniford",
      "email": "gstaniford2k@t-online.de",
      "payment": true
    }, {
      "fullName": "Lira Mac",
      "email": "lmac2l@smugmug.com",
      "payment": true
    }, {
      "fullName": "Nonie Stroud",
      "email": "nstroud2m@tripod.com",
      "payment": true
    }, {
      "fullName": "Olin Clymer",
      "email": "oclymer2n@sakura.ne.jp",
      "payment": true
    }, {
      "fullName": "Michell Matskevich",
      "email": "mmatskevich2o@usda.gov",
      "payment": true
    }, {
      "fullName": "Terrell Palomba",
      "email": "tpalomba2p@ucsd.edu",
      "payment": true
    }, {
      "fullName": "Neile Stood",
      "email": "nstood2q@ft.com",
      "payment": true
    }, {
      "fullName": "Ardeen Filipyev",
      "email": "afilipyev2r@facebook.com",
      "payment": true
    }];

  public readonly items: any[] = [];

  constructor() {
    for (let i = 0; i < this.total; i++) {
      this.items.push(this.mocItems[Math.floor(Math.random() * 100)])
    }
  }

}
