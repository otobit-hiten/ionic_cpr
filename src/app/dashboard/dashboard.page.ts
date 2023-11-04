import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { TranslateModule} from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { Directory, DownloadFileResult, Filesystem, WriteFileResult, } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { FileOpener } from '@capacitor-community/file-opener';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, TranslateModule, CommonModule],
})
export class Dashboard {

  languageList: any = [];
  selected = '';
  compareWith: any;
  constructor(private toastController: ToastController,private http: HttpClient, public languageService: LanguageService) {
  }
   async ngOnInit() {
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
     await Filesystem.requestPermissions()
     await LocalNotifications.requestPermissions()
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

  public async openFile() {

    Filesystem.downloadFile({
      url: 'https://drive.google.com/u/1/uc?id=1WaxQqtKB8ZjrdrcSiSs0Q4xixehti9M8&export=download',
      path: 'Accord_Cpe_form.pdf',
      recursive: true,
      progress: true,
      directory:Directory.Documents
    }).then((res)=>{
      const contentType = 'application/pdf'
      this.sendNotification(contentType,res.path!)
    })
    // const filepath: string = `assets/form.pdf`;
    // this.openLocalFileOnFileOpener(filepath);
  }

  async openLocalFileOnFileOpener(filepath: string, contentType: string = 'application/pdf') {
    return this.http.get(filepath, { responseType: 'arraybuffer' }).subscribe(async (response) => {
 
      const binaryData = new Uint8Array(response);
      let binary = '';
      const bytes = new Uint8Array(binaryData);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Data = window.btoa(binary);
     
      try{
          await Filesystem.writeFile({
          path: 'Accord_Form_cpr.pdf',
          data: base64Data,
          directory: Directory.Documents,
        }).then((res) => {
          this.sendNotification(contentType, res.uri)
        });
      }catch(e:any){
        this.presentToast('Try again later..','top')
      }
    });
  }
  async sendNotification(contentType:string,uri:string) {
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
        LocalNotifications.addListener('localNotificationActionPerformed', (payload) => {
            if(payload.actionId === 'tap'){
              FileOpener.open({
                filePath:uri,
                contentType:contentType,
                openWithDefault:true
              })
            }
    });
        this.presentToast('File Downloaded','top')
    }catch(e:any){
       
    }
  }

 
    async presentToast(msg: string, position: 'top') {
      const toast = await this.toastController.create({
        message: msg,
        duration: 1500,
        position,
      });
      await toast.present();
    }

   
  
}
