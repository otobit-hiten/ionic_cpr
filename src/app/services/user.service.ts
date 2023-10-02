import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

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
}
