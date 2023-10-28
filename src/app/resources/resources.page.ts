import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule,RouterModule]
})
export class ResourcesPage implements OnInit {
  languageList:any = []
  selected="en" //set default language here  {en= English ; es = spanish}
  constructor(private languageService :LanguageService) { }
  compareWith : any ;
  MyDefaultValue: String ="en";
  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };
  ngOnInit(){
    this.languageService.initialLanguage();
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
  }
  ionViewDidEnter(){
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
  }
  ionChange(event:any) {
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
  }
  async openbrowser(event:string){
    if(event === 'tow'){
      await Browser.open({ url: 'https://www.google.co.in/maps/search/tow/@21.1797475,72.8059125' });

    }
  }
}
