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
  selected="" //set default language here  {en= English ; es = spanish}
  constructor( public languageService :LanguageService) { }
  compareWith : any ;
  MyDefaultValue: String ="";
  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };
  ngOnInit(){
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
  }
  ionViewDidEnter(){
    console.log(this.selected)
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
  }
  ionChange(event:any) {
    console.log(event)
    console.log(event.target.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
    console.log(this.languageService.selectedLanguage)
  }
  async openbrowser(event:string){
    if(event === 'tow'){
      await Browser.open({ url: 'https://www.google.co.in/maps/search/tow/@21.1797475,72.8059125' });

    }
  }
}
