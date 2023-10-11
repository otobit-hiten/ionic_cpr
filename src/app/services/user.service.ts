import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  translateServiceHere: TranslateService;

  constructor( translateService :TranslateService) { this.translateServiceHere=translateService}

  async create(key: string,value:string){
    await Preferences.set({key,value});
  }

  async get(key: string){
    return (await Preferences.get({key}));
  }

  async update(key: string,value:string){
    await Preferences.set({key,value});
  }

  async clear(){
    Preferences.clear();
  }

  async getTranslationService(){
    return (await this.translateServiceHere);
  }
}
