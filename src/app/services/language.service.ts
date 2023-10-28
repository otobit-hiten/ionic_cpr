import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const KEY = 'SELECTED_LANGUAGE'; 

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private _storage: Storage | null = null;
  selectedLanguage ='';

  constructor(private translateService:TranslateService, private storage : Storage) {}

   async initialLanguage(){
    const storage = await this.storage.create();
    this._storage = storage;
    this._storage?.get(KEY).then((data: any) => {
      console.log(data,"MILA")
      if(data){
        this.translateService.setDefaultLang(data);
        this.setLanguage(data);
        this.selectedLanguage = data;
      }else{
        let language = this.translateService.getBrowserLang()
        this.translateService.setDefaultLang(language!);
      }
    })
  }

  setLanguage(lng:any){
    this.translateService.use(lng)
    this.selectedLanguage = lng;
    this._storage?.set(KEY,lng)
  }

  getLanguage(){
    return [
      {
         code: "en", title: "English", text: "English"
      },
      {
        code: "es", title: "Spanish", text: "Española"
      }
    ]
  }
}
