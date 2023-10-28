import { LanguageService } from './services/language.service';
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
  constructor(private languageService: LanguageService) {
    // this.translateService.setDefaultLang('en');
    // this.translateService.addLangs(['en','es']);
    this.initilize();
  }

  async initilize(){
    this.languageService.initialLanguage();
  }
}
