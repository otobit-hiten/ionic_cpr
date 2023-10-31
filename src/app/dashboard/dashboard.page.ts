import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { Directory, Encoding, Filesystem, } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, TranslateModule, CommonModule],
})
export class Dashboard {

  languageList: any = [];
  selected = ''; //set default language here  {en= English ; es = spanish}
  compareWith: any;
  constructor(private toastController: ToastController,private http: HttpClient, public languageService: LanguageService) {
  }
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



  async downloadForm() {
    let base64: string = ''
    this.http.get('/assets/form.pdf', { responseType: 'blob' as 'json' })
      .subscribe(async res => {
        const reader = new FileReader();
        reader.readAsDataURL(res as Blob);
        reader.onloadend = function () {
          base64 = reader.result?.toString()!;
          console.log(base64.substring(28));
        }
      });

    const fileName = new Date().getTime() + '.pdf';
    await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Documents,
    });
  }

  public async openFile() {
    const filepath: string = `assets/form.pdf`;
    this.openLocalFileOnFileOpener(filepath);
  }

  async openLocalFileOnFileOpener(filepath: string, contentType: string = 'application/pdf') {
    return this.http.get(filepath, { responseType: 'arraybuffer' }).subscribe(async (response) => {
      //
      // Get base64 data
      const binaryData = new Uint8Array(response);
      let binary = '';
      const bytes = new Uint8Array(binaryData);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Data = window.btoa(binary);
      // Create temporary file
      await Filesystem.writeFile({
        path: 'Accord Form.pdf',
        data: base64Data,
        directory: Directory.Documents,
      });

      this.sendNotification()
    });
  }
  async sendNotification() {
    let option : ScheduleOptions = {
      notifications:[
        {
          id:1,
          title:'CPR Insurnace',
          body:'Form Downloaded',
          smallIcon:'assets/cpr_logo.png'
        }
      ]
    }
    try{
        await LocalNotifications.schedule(option)
        this.presentToast('top')
    }catch(e:any){

    }

  }

 
    async presentToast(position: 'top') {
      const toast = await this.toastController.create({
        message: "File Downloaded",
        duration: 1500,
        position,
        color: 'primary'
      });
      await toast.present();
    }
  
}
