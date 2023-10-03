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
  isEdit: boolean = true;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.get()
  }

  set() {
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
