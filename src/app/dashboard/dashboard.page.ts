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
  selected ='';
  constructor(private translateService :TranslateService,private languageService: LanguageService) { }

  ngOnInit(){
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected,"Selected")
  }
  ionChange(event:any) {
    console.log(event.detail.value,"language")
    this.languageService.setLanguage(event.target.value ? event.target.value : "en")
    // this.translateService.use(event.target.value ? event.target.value : "en")
  }
  compareWith : any ;
  MyDefaultValue: String ="en";  //set default language here  {en= English ; es = spanish}

  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };

}
