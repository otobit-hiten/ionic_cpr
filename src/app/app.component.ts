import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule],
})
export class AppComponent {
  constructor(private translateService : TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.addLangs(['en','es']);
  }
}
