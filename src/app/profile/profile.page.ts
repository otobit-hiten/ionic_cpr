import { LanguageService } from './../services/language.service';
import { UserService } from './../services/user.service';
import { Image, User } from './../services/user';
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
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import { MaskitoModule } from '@maskito/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MaskitoModule ,FormsModule, TranslateModule]
})
export class ProfilePage implements OnInit {
  
  readonly phoneMask: MaskitoOptions = {
    mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  user: User = { name: '', phone: '', email: '', company_name: '' }
  image: Image = { name: '', path: '', localPath: '' }
  public name: string = "";
  public phone: string = "";
  public email: string = "";
  public company_name: string = "";
  public pro: PickedFile[] = []
  public imageData = { name: '', base64: '', path: '', localPath: '' };
  public isEdit: boolean = false;
  public dataExists: boolean = false;
  private localPath: string = "";
  public imagePath: string = '';
  constructor(private userService: UserService, public readonly domSanitizer: DomSanitizer, public languageService: LanguageService, private changeRef: ChangeDetectorRef) { }
  public selected = '';   //set default language here  {en= English ; es = spanish}
  languageList: any = []
  ionChange(event: any) {
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
  ionViewDidEnter() {
    this.get();
    console.log(this.selected)
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
    this.changeRef.detectChanges()
  }
  set() {
    this.isEdit = false;
    let user: User = { name: this.name, phone: this.phone, email: this.email, company_name: this.company_name }
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
        this.company_name = this.user.company_name;
        if (this.name === "" && this.phone === "" && this.email === "" && this.company_name === "") {
          this.isEdit = true
          console.log(this.isEdit)
        } else {
          this.isEdit = false
          console.log(this.isEdit)
        }
        console.log("read")
      } else {
        this.isEdit = true
        console.log(this.isEdit)
      }
    }
    );
    await this.userService.get("image").then((data: any) => {
      if (data != null && data.value != null) {
        console.log(data)
        console.log(data.value)
        let imageData = JSON.parse(data.value);
        if (this.image !=null) {
          this.image=imageData
          console.log("imagedata")
        }
        console.log(this.image)
      }
    })
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
      console.log("here reached")
      const fileName = Date.now() + '.jpeg';
      Filesystem.writeFile({
        data: data.files[0].data!,
        path: fileName,
        directory: Directory.Data

      }).then((data: any) => {
        console.log(data, "Write");
        this.image.name = fileName;
        this.image.path = data.uri;
        var win: any = window;
        this.image.localPath = win.Ionic.WebView.convertFileSrc(data.uri);
        this.userService.create("image", JSON.stringify(this.image));
        console.log("imagepath")
        console.log(this.image.localPath)
        this.get();
      });
    });



  }
  removeImage() {
    this.image.name = "";
    this.image.path = "";
    this.image.localPath=""
    this.userService.create("image", JSON.stringify(this.image));
    this.get()
  }
}
