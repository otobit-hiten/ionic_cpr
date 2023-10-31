import { LanguageService } from './../services/language.service';
import { UserService } from './../services/user.service';
import { User } from './../services/user';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core'
import { profile } from 'console';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class ProfilePage implements OnInit {
  user: User = { name: '', phone: '', email: '', policyNo: '', image:[] }
  public name: string = "";
  public phone: string = "";
  public email: string = "";
  public policyNo: string = "";
  public pro: PickedFile[] =[]
  public imageData = { name: '', base64: '', path: '', localPath: '' };
  public isEdit: boolean = false;
  public dataExists: boolean = false;
  private localPath: string = "";
  constructor(private userService: UserService, public readonly domSanitizer: DomSanitizer, public languageService: LanguageService,private changeRef: ChangeDetectorRef) { }
  public selected = '';   //set default language here  {en= English ; es = spanish}
  languageList: any = []
  ionChange(event:any) {
    console.log(event)
    console.log(event.target.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
    console.log(this.languageService.selectedLanguage)
  }
  compareWith: any;
  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };
  ngOnInit() {
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
    this.get()

  }
  ionViewDidEnter(){
    console.log(this.selected)
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
    this.changeRef.detectChanges()
  }
  set() {
    this.isEdit = false;
    let user: User = { name: this.name, phone: this.phone, email: this.email, policyNo: this.policyNo, image: this.pro }
    this.userService.get("user").then((data: any) => {
      if (data === "" || data === null || data.value === null) {
        this.userService.create("user", JSON.stringify(user));
      } else {
        this.userService.update("user", JSON.stringify(user));
      }
    })
  }
  async get() {
    await this.userService.get("user").then((data: any) => {
      if (data.value != null) {
        console.log(data)
        let userData = JSON.parse(data.value);
        this.user = userData;
        this.name = this.user.name;
        this.phone = this.user.phone;
        this.email = this.user.email;
        this.policyNo = this.user.policyNo;
        if (this.name === "" && this.phone === "" && this.email === "" && this.policyNo === "") {
          this.isEdit = true
          console.log(this.isEdit)
        } else {
          this.isEdit = false
          console.log(this.isEdit)
        }
        console.log("read")
        console.log(this.user.image)
        
          Filesystem.readFile({
            path: this.user.image[0].name,
            directory: Directory.Data,
          }).then((res: any) => {
              console.log(res,"read")
          });
          this.pro = this.user.image
        
     
      } else {
        this.isEdit = true
        console.log(this.isEdit)
      }
    }
    );
  }
  update() {
    console.log(this.isEdit)
    this.isEdit = true;
    console.log(this.isEdit)
  }
  clear() {
  }
  public convertPathToWebPath(path: string): SafeUrl {
    const fileSrc = Capacitor.convertFileSrc(path);
    return this.domSanitizer.bypassSecurityTrustUrl(fileSrc);
  }
  async openGallery() {
    await FilePicker.pickImages({
      multiple: false,
      readData: true,
    }).then(data => {
      this.pro = data.files
      console.log(this.pro);
    });

    const fileName = Date.now() + '.jpeg';
    await Filesystem.writeFile({ 
      data: this.pro[0].name, 
      path: fileName,
      directory: Directory.Data 
    }).then((data: any) => { 
      console.log(data,"Write")
    });
  }
  removeImage() {
    let user: User = { name: this.name, phone: this.phone, email: this.email, policyNo: this.policyNo, image: []}
    this.userService.update("user", JSON.stringify(user));
    this.pro = []
    this.imageData.name = "";
    this.imageData.base64 = "";
    this.imageData.path = "";
    this.imageData.localPath = "";
    this.get()
  }
}
