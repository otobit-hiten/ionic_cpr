import { LanguageService } from './../services/language.service';
import { UserService } from './../services/user.service';
import { User } from './../services/user';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class ProfilePage implements OnInit {
  user: User = { name: '', phone: '', email: '', policyNo: '', image: { name: '', localPath: '' } }
  public name: string = "";
  public phone: string = "";
  public email: string = "";
  public policyNo: string = "";
  public imageData = { name: '', base64: '', path: '', localPath: '' };
  public isEdit: boolean = false;
  public dataExists: boolean = false;
  private localPath: string = "";
  constructor(private userService: UserService,private readonly domSanitizer: DomSanitizer,private languageService:LanguageService) { }

  public selected = 'en';

  languageList : any = []


  ionChange(event: any) {
    console.log(event.detail.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
  }
  compareWith: any;
  MyDefaultValue: String = "en";  //set default language here  {en= English ; es = spanish}

  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };


  ngOnInit() {
    this.languageList = this.languageService.getLanguage();
    console.log("languageList")
    console.log(this.languageList)
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
    console.log(this.selected)
    this.get()

  }

  set() {
    this.isEdit = false;
    let user: User = { name: this.name, phone: this.phone, email: this.email, policyNo: this.policyNo, image: this.imageData }
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
        this.imageData.name = this.user.image.name;
        this.imageData.localPath = this.user.image.localPath;
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
      data.files.forEach(file => {
        this.imageData.name = file.name;
        this.imageData.path = file.path!;
      })
      console.log(data);
    });
     await Filesystem.copy({ from: this.imageData.path, to: "photo.jpg" , directory: Directory.External,toDirectory:Directory.Data }).then((data: any) => {
      console.log("data")
      console.log(data)
      this.imageData.localPath = data.uri
    });
  }

  removeImage() {
    this.imageData.name = "";
    this.imageData.base64 = "";
    this.imageData.path = "";
    this.imageData.localPath = "";
    this.get()
  }

}
