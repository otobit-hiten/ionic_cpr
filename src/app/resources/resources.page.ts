import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule,RouterModule]
})
export class ResourcesPage implements OnInit {
  languageList = [
    {
       code: "en", title: "English", text: "English"
    },
    {
      code: "es", title: "Spanish", text: "Española"
    }
  ]
  constructor(private translateService :TranslateService) { }

  ionChange(event:any) {
    console.log(event.detail.value)
    this.translateService.use(event.target.value ? event.target.value : "en")
  }
  compareWith : any ;
  MyDefaultValue: String ="en";  //set default language here  {en= English ; es = spanish}

  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };

  ngOnInit() {
  }

  async openbrowser(event:string){
    if(event === 'tow'){
      await Browser.open({ url: 'https://www.google.co.in/maps/search/tow/@21.1797475,72.8059125' });

    }
  }

}
