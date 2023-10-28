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
  constructor(public languageService: LanguageService) { }
  ngOnInit(){
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
  }
  compareWith: any;
  ionChange(event:any) {
    console.log(event)
    console.log(event.target.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
    console.log(this.languageService.selectedLanguage)
  }

  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };
  ionViewDidEnter(){
    console.log(this.selected)
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
  }
}
