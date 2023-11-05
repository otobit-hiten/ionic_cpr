import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { LanguageService } from '../services/language.service';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-emergency-services',
  templateUrl: './emergency-services.page.html',
  styleUrls: ['./emergency-services.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, RouterModule]
})
export class EmergencyServicesPage implements OnInit {


  constructor(public languageService: LanguageService) { }

  languageList: any = [];
  selected = ''; //set default language here  {en= English ; es = spanish}
  compareWith: any;

  ngOnInit() {
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
  }
  ionViewDidEnter() {
    console.log(this.selected)
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
  }
  ionChange(event: any) {
    console.log(event)
    console.log(event.target.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
    console.log(this.languageService.selectedLanguage)
  }



  openbrowser(event: string) {
    this.location(event)
  }


  call() {
    window.open('tel:911');
  }

  async location(event: string) {
    try {
      const status = await Geolocation.checkPermissions()
      if (status.coarseLocation === 'denied' || status.location === 'denied') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.coarseLocation === 'denied' || requestStatus.location === 'denied') {
          this.openNativeSettings(true)
          return
        } else {
          const coordinates = await Geolocation.getCurrentPosition();
          console.log('Current position:', coordinates);
          let lat = coordinates.coords.latitude
          let lng = coordinates.coords.longitude
          if (event === 'hospital') {
            await Browser.open({ url: `https://www.google.co.in/maps/search/Hospitals/@${lat},${lng}` });
          }
           else if (event === 'police') {
            await Browser.open({ url: `https://www.google.co.in/maps/search/Police/@${lat},${lng}` });
          } 
          else if (event === 'fire') {
            await Browser.open({ url: `https://www.google.co.in/maps/search/FireStation/@${lat},${lng}` });
          }
        }
      } else {
        const coordinates = await Geolocation.getCurrentPosition();
        console.log('Current position:', coordinates);
        let lat = coordinates.coords.latitude
        let lng = coordinates.coords.longitude
        if (event === 'hospital') {
          await Browser.open({ url: `https://www.google.co.in/maps/search/Hospitals/@${lat},${lng}` });
        }
         else if (event === 'police') {
          await Browser.open({ url: `https://www.google.co.in/maps/search/Police/@${lat},${lng}` });
        } 
        else if (event === 'fire') {
          await Browser.open({ url: `https://www.google.co.in/maps/search/FireStation/@${lat},${lng}` });
        }
      }
    } catch (e: any) {
      if (e.message === 'Location services are not enabled') {
        this.openNativeSettings()
      }
    }
  }

  openNativeSettings(app = false) {
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    })
  }
}
