import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-emergency-services',
  templateUrl: './emergency-services.page.html',
  styleUrls: ['./emergency-services.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule,RouterModule]
})
export class EmergencyServicesPage implements OnInit {

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
    if(event === 'hospital'){
      await Browser.open({ url: 'https://www.google.co.in/maps/search/Hospitals/@21.1797475,72.8059125' });

    }else if(event === 'police'){
      await Browser.open({ url: 'https://www.google.co.in/maps/search/Police/@21.1797475,72.8059125' });

    }else if(event === 'fire')
    await Browser.open({ url: 'https://www.google.co.in/maps/search/FireStation/@21.1797475,72.8059125' });
  }
}
