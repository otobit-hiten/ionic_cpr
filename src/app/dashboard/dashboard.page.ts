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
  selected =''; //set default language here  {en= English ; es = spanish}
  compareWith : any ;
  constructor(public languageService: LanguageService) { }
  ngOnInit(){
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
  }
  ionViewDidEnter(){
    console.log(this.selected)
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
  }
  ionChange(event:any) {
    console.log(event)
    console.log(event.target.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
    console.log(this.languageService.selectedLanguage)
  }
}
