import { UserService } from './../services/user.service';
import { User } from './../services/user';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class ProfilePage implements OnInit {
  user: User = { name: '', phone: '', email: '', policyNo: '', image:{name:'',base64:''} }
  public name: string = "";
  public phone: string = "";
  public email: string = "";
  public policyNo: string = "";
  public imageData = { name: '', base64: ''};
  public isEdit: boolean = false;
  public dataExists : boolean=false;
  constructor(private userService: UserService, private translateService: TranslateService,private languageService: LanguageService) { }

  languageList : any = []
  selected = '';
 
  ionChange(event:any) {
    console.log(event.detail.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : "en")
    // this.translateService.use(event.target.value ? event.target.value : "en")
  }
  compareWith : any ;
  MyDefaultValue: String ="en";  //set default language here  {en= English ; es = spanish}

  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };


  ngOnInit() {
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage
    this.get()
  }

  set() {
    this.isEdit=false;
    let user: User = { name: this.name, phone: this.phone, email: this.email, policyNo: this.policyNo, image: this.imageData }
    this.userService.create("user", JSON.stringify(user));
  }
  async get() {

    await this.userService.get("user").then((data: any) => {
      console.log(data)
        let userData = JSON.parse(data.value);
        this.user = userData;
        this.name = this.user.name;
        this.phone = this.user.phone;
        this.email = this.user.email;
        this.policyNo = this.user.policyNo;
        if(this.name===""&&this.phone===""&&this.email===""&&this.policyNo===""){
          this.isEdit=true
          console.log(this.isEdit)
        }else{
          this.isEdit=false
          console.log(this.isEdit)
        }
        this.imageData.name = this.user.image.name;
        this.imageData.base64 = this.user.image.base64;
    }
    );
  }

  update() {
    console.log(this.isEdit)
    this.isEdit=true;
    console.log(this.isEdit)
  }

  clear() {

  }

  async openGallery(){
    const image = await FilePicker.pickImages({
      multiple:false,
      readData: true,
    }).then(data => {
        data.files.forEach(file => {
          this.imageData.name = file.name;
          this.imageData.base64 = file.data!;
        })
        console.log(data);
    });

  }

  removeImage(){
    this.imageData.name ="";
    this.imageData.base64 =""
    this.get()
  }

}
