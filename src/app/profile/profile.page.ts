import { UserService } from './../services/user.service';
import { User } from './../services/user';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
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
  constructor(private userService: UserService) { }

  languageList = [
    {
       code: "en", title: "English", text: "English"
    },
    {
      code: "es", title: "Spanish", text: "Española"
    }
  ]

  ionChange(event:any) {
    console.log(event.detail.value)
    this.userService.getTranslationService().then((data:any)=>{
      data.use(event.target.value ? event.target.value : "en")
    })
  }
  compareWith : any ;
  MyDefaultValue: String ="en";  //set default language here  {en= English ; es = spanish}

  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };


  ngOnInit() {
    this.get()
  }

  set() {
    this.isEdit=false;
    let user: User = { name: this.name, phone: this.phone, email: this.email, policyNo: this.policyNo, image: this.imageData }
    this.userService.create("user", JSON.stringify(user));
    // this.userService.create("user","da÷ta");
  }
  async get() {
    if (this.isEdit) {
      this.isEdit = false;
    }
    await this.userService.get("user").then((data: any) => {
      if (data.value) {
        this.dataExists=true;
        let userData = JSON.parse(data.value);
        this.user = userData;
        this.name = this.user.name;
        this.phone = this.user.phone;
        this.email = this.user.email;
        this.policyNo = this.user.policyNo;
        this.imageData.name = this.user.image.name;
        this.imageData.base64 = this.user.image.base64;
        this.isEdit = true;
      }
    }
    );
  }

  update() {
    console.log(this.isEdit)
    this.isEdit=true;
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
