import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { LanguageService } from '../services/language.service';
import { Geolocation } from '@capacitor/geolocation';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, RouterModule]
})
export class ResourcesPage implements OnInit {
  languageList: any = []
  selected = "" //set default language here  {en= English ; es = spanish}
  lat = 0
  lng = 0
  constructor(public languageService: LanguageService) { }
  compareWith: any;
  MyDefaultValue: String = "";
  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };
  async ngOnInit() {
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
  }
  ionViewDidEnter() {
    console.log(this.selected)
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
  }
  ionChange(event: any) {
    console.log(event)
    console.log(event.target.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
    console.log(this.languageService.selectedLanguage)
  }
  async openbrowser(event: string) {

    if (event === 'tow') {
      this.location()
    }
  
    // if(event === 'web'){
    //   this.location()
    //   await Browser.open({ url: 'https://cprins.com/' });
    // }
    // if(event === 'office'){
    //   await Browser.open({ url: 'https://www.google.com/maps/place/CPR+Insurance/@32.8568238,-96.9353953,17z/data=!3m1!4b1!4m6!3m5!1s0x864e82c5d01bdc95:0x134431ed313cd05d!8m2!3d32.8568238!4d-96.9328204!16s%2Fg%2F11c1s6m465?entry=ttu' });
    // }
  }

  async location() {
    try {
      const status = await Geolocation.checkPermissions()
      if (status.coarseLocation === 'denied' || status.location === 'denied') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.coarseLocation === 'denied' || requestStatus.location === 'denied') {
          this.openNativeSettings(true)
          return
        } else {
          this.getCurrentlocation()
        }
      } else {
        this.getCurrentlocation()
      }
    } catch (e: any) {
      if (e.message === 'Location services are not enabled') {
        this.openNativeSettings()
      }
    }
  }

  async getCurrentlocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current position:', coordinates);
    this.lat = coordinates.coords.latitude
    this.lng = coordinates.coords.latitude
    console.log('Current position:', this.lat, this.lng);
    await Browser.open({ url: `https://www.google.co.in/maps/search/tow/@${this.lat},${this.lng}` });

  }

  openNativeSettings(app = false) {
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    })
  }
}
