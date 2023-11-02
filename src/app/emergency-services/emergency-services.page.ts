import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-emergency-services',
  templateUrl: './emergency-services.page.html',
  styleUrls: ['./emergency-services.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule,RouterModule]
})
export class EmergencyServicesPage implements OnInit {

 
  constructor( public languageService: LanguageService) { }

  languageList: any = [];
  selected = ''; //set default language here  {en= English ; es = spanish}
  compareWith: any;

  ngOnInit() {
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
  }
  ionViewDidEnter() {
    console.log(this.selected)
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
  }
  ionChange(event: any) {
    console.log(event)
    console.log(event.target.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
    console.log(this.languageService.selectedLanguage)
  }



  async openbrowser(event:string){
    if(event === 'hospital'){
      await Browser.open({ url: 'https://www.google.co.in/maps/search/Hospitals/@21.1797475,72.8059125' });

    }else if(event === 'police'){
      await Browser.open({ url: 'https://www.google.co.in/maps/search/Police/@21.1797475,72.8059125' });

    }else if(event === 'fire')
    await Browser.open({ url: 'https://www.google.co.in/maps/search/FireStation/@21.1797475,72.8059125' });
  }
}
