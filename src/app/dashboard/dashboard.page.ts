import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, TranslateModule,CommonModule],
})
export class Dashboard {

  languageList:any = [];
  selected ='en'; //set default language here  {en= English ; es = spanish}
  compareWith : any ;
  constructor(private translateService :TranslateService,private languageService: LanguageService) { }
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
}
