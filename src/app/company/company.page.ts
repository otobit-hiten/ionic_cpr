import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class CompanyPage implements OnInit {

  languageList: any = []
  selected ='';
  constructor(private languageService: LanguageService,private translateService: TranslateService) { }

  ionChange(event:any) {
    console.log(event.detail.value,"language")
    this.languageService.setLanguage(event.target.value ? event.target.value : "en")
    // this.translateService.use(event.target.value ? event.target.value : "en")
  }
  ngOnInit(){
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected,"Selected")
  }
  compareWith: any;
  MyDefaultValue: String = "en";  //set default language here  {en= English ; es = spanish}

  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };


}
