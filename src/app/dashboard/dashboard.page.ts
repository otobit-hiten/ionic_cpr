import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, TranslateModule,CommonModule],
})
export class Dashboard {

  languageList = [
    {
       code: "english", title: "English", text: "English"
    },
    {
      code: "spanish", title: "Spanish", text: "Española"
    }
  ]
  constructor(private translateService :TranslateService) { }

  ionChange(event:any) {
    console.log(event.detail.value)
    this.translateService.use(event.target.value ? event.target.value : "english")
  }
}
