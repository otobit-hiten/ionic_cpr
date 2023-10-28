import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import * as  Parse from 'parse';
import { Swiper } from 'swiper'
import { FilePicker, PickFilesResult, PickedFile } from '@capawesome/capacitor-file-picker';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';
import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Cloudinary, ResourceType } from '@capawesome/capacitor-cloudinary';
import { LanguageService } from '../services/language.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, RouterModule]
})
export class FormPage implements OnInit {

  languageList: any = []
  selected='';

  ngOnInit(){
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage

    this.swiperReady()
    VoiceRecorder.requestAudioRecordingPermission()
    // this.loadAudio();
    this.witnessArray.push(this.witnessObj)
    console.log(this.witnessArray.length)
    this.initialize();
  }
  ionViewDidEnter(){
    console.log(this.selected)
    this.selected = this.languageService.selectedLanguage
    console.log(this.selected)
  }
  ionChange(event:any) {
    console.log(event)
    console.log(event.target.value)
    this.languageService.setLanguage(event.target.value ? event.target.value : this.selected)
    console.log(this.languageService.selectedLanguage)
  }

  compareWith: any;
  MyDefaultValue: String = "en";  //set default language here  {en= English ; es = spanish}
  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper
  slideOneForm: FormGroup
  slideTwoForm: FormGroup
  slideThreeForm: FormGroup
  recording: boolean = false;
  displayTime = '';
  time = 0;
  storedAudio: FileInfo[] = [];
  uploadAudio: any[] = [];
  public playback = false;
  ref = new Audio();
  selectedItem: any;
  track: any;
  witnessObj = { name: '', phone: '', email: '', image: [] }
  witnessArray: any = []
  public actualAreaOfDamage: PickedFile[] = [];
  public nearestStreet: PickedFile[] = [];
  public liscenseAndNoPlate: PickedFile[] = [];
  public insuranceIdImage: PickedFile[] = [];
  public policeReport: PickedFile[] = [];
  public licensePlate: PickedFile[] = [];
  public vinNo: PickedFile[] = [];
  public allFourSide: PickedFile[] = [];
  public closeUp: PickedFile[] = [];
  public otherPartyCarImage: PickedFile[] = [];
  public otherPartyCloseUpImage: PickedFile[] = [];
  public otherPartyVinNo: PickedFile[] = [];
  public otherPartylicensePlate: PickedFile[] = [];
  latAndLng: string = "";

  involvedPartiesArray : any =[];
  involvedPartiesObject = {idImage: [], insuranceImage: [] };

  constructor(public formBuilder: FormBuilder, private changeRef: ChangeDetectorRef, private readonly domSanitizer: DomSanitizer, public languageService: LanguageService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      if(typeof params['lat'] === "undefined" || typeof params['lng'] === "undefined" ){
        this.latAndLng = 'Address of Accident';
      }else{
        this.latAndLng = `${params['lat']},${params['lng']}`;
      }
      console.log(params['lat'] || 'empty');
      console.log(params['lng'] || 'empty');
      console.log("COORDINATES RECEIVED");

    });
    console.log(this.swiperRef?.nativeElement.swiper);
    console.log(this.swiperRef);
    Parse.initialize('4fJYYN0bBUsmOumrcXWZolpXm0OCBId8S0lKr45l', 'RRTqRi9mWSC3Udfu6RQglRK3MDx7N1hjSOQs0RPj');
    (Parse as any).serverURL = "https://parseapi.back4app.com/";

    this.slideOneForm = formBuilder.group({
      name_insured: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])],
      policy_no: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('^\\d+$')])],
      tell_us_what_happened: ['', Validators.compose([Validators.maxLength(30)])],
    });

    this.slideTwoForm = formBuilder.group({

    });

    this.slideThreeForm = this.formBuilder.group({
        involvedParties: this.formBuilder.array([]),
        witness: this.formBuilder.array([]),
    })
  }

  involvedParties():FormArray{
    return this.slideThreeForm.get("involvedParties") as FormArray
  }
  newInvolvedParties():FormGroup{
    return this.formBuilder.group({
        name:'',
        idImage:[],
        number:'',
        insuranceCompany: '',
        insuranceImage:[]
    })
  }
  addInvolvedParties(){
    let involvedPartiesObjects = {idImage: [], insuranceImage: [] };
    this.involvedPartiesArray.push(involvedPartiesObjects)
    this.involvedParties().push(this.newInvolvedParties());
  }
  removeInvolvedParties(i:number){
    this.involvedPartiesArray.splice(i,1)
    this.involvedParties().removeAt(i)
  }


  witness():FormArray{
    return this.slideThreeForm.get("witness") as FormArray
  }
  newWitness():FormGroup{
    return this.formBuilder.group({
      name:'',
      number:'',
    })
  }
  addWitness(){
    this.witness().push(this.newWitness());
  }
  removeWitness(i:number){
    this.witness().removeAt(i)
  }



  async initialize() {
    await Cloudinary.initialize({ cloudName: 'dbdfrtxli' });
    console.log('initialize');
  };


  get errorControl() {
    return this.slideOneForm.controls;
  }

  submitOneForm = async () => {
    if (this.slideOneForm.valid) {
      console.log(this.slideOneForm.value);
      this.swiper = await this.swiperRef?.nativeElement.swiper;
      this.goNext();
      this.uploadAudioToCloudinary()
    } else {
      return console.log('Please provide all the required values!');
    }
  }
  submitTwoForm = async () => {
    if (this.slideTwoForm.valid) {
      console.log(this.slideTwoForm.value);
      this.swiper = await this.swiperRef?.nativeElement.swiper;
      this.goNext();
    } else {
      return console.log('Please provide all the required values!');
    }
  }





  steps = {
    email: "hitenchandora21@gmail.com",
    name: "",
    location: "",
    injured: [
      {
        name: "",
        images: [
          {
            url: "",
            name: "image1"
          },
          {
            url: "",
            name: "image1"
          }
        ]
      }
    ],
    witness: [
      {
        name: "",
        images: []
      }
    ],
    policeOfficer: {
      name: "",
      reportNumber: ""
    },
    audio: [
      {
        base64: "",
        name: ""
      }
    ],
    images: [
      {
        url: "http://res.cloudinary.com/dbdfrtxli/image/upload/v1695960777/qn0gqv0sagb15ndzppa1.jpg",
        name: "image1"
      },
      {
        url: "http://res.cloudinary.com/dbdfrtxli/image/upload/v1695960777/apzx7udrexbdi35atkit.jpg",
        name: "image2"
      }
    ]
  }





  async call() {
    try {
      console.log("Calling...")
      var Parse = require('parse');
      const query = await Parse.Cloud.run('result', this.steps)
      console.log(query)
    } catch (error) {
      console.log(error);
    }
  }


  async swiperReady() {
    this.swiper = await this.swiperRef?.nativeElement.swiper;
    console.log("rready")
    this.goNext();
  }

  goNext() {
    console.log('changed: ');
    this.swiper?.slideNext(500);
  }

  goPrev() {
    console.log('changed: ');
    this.swiper?.slidePrev(500);
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }


  //imagePicker
  async openImagePicker(name: string,i:number): Promise<void> {
    console.log(i)
    const result = await FilePicker.pickImages({
      multiple: true,
      readData: true,
    }).then(data => {
      switch (name) {
        case "actualAreaOfDamage":
          this.actualAreaOfDamage = data.files;
          this.actualAreaOfDamage.forEach(async (file) => {
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            });
          });
          break;
          case "nearestStreet":
            this.nearestStreet = data.files;
            this.nearestStreet.forEach(async (file) => {
              await Cloudinary.uploadResource({
                path: file.path,
                resourceType: ResourceType.Image,
                uploadPreset: 'm442awuh',
              });
            });
            break;


        case "idImage":
          this.involvedPartiesArray[i].idImage = data.files;
          console.log(this.involvedPartiesArray);
          break;
      }

    });
  }

  // convert path of image
  public convertPathToWebPath(path: string): SafeUrl {
    const fileSrc = Capacitor.convertFileSrc(path);
    return this.domSanitizer.bypassSecurityTrustUrl(fileSrc);
  }


  //voice record load, start, stop and timer
  loadAudio() {
    Filesystem.readdir({
      path: '',
      directory: Directory.External
    }).then(result => {
      console.log(result);
      this.storedAudio = result.files
    });

  }
  startOrStopRecording() {
    if (!this.recording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    VoiceRecorder.requestAudioRecordingPermission();
    if (this.recording) {
      return
    }
    this.recording = true;
    VoiceRecorder.startRecording()
    this.startTimer()

  }
  stopRecording() {
    if (!this.recording) {
      return
    }
    VoiceRecorder.stopRecording().then(async (res: RecordingData) => {
      const fileToSave = res.value.recordDataBase64
      console.log(fileToSave);
      const fileName = new Date().getTime() + '.wav';
      await Filesystem.writeFile({
        path: fileName,
        directory: Directory.External,
        data: fileToSave
      });
      this.loadAudio();

    })
    this.recording = false;
  }

  startTimer() {
    if (!this.recording) {
      this.displayTime = '';
      this.time = 0;
      return;
    }
    this.time += 1;
    const min = Math.floor(this.time / 60);
    const sec = (this.time % 60).toString().padStart(2, '0');
    this.displayTime = `${min}:${sec}`
    setTimeout(() => {
      this.startTimer()
    }, 1000)
  }



  // play and delete recorded audio
  async play(fileName: any) {
    const audioFile = await Filesystem.readFile({
      path: fileName,
      directory: Directory.External
    });
    if (this.track != this.selectedItem) {
      this.playback = false;
    } else {
      this.playback = true;
    }
    const base64Sound = audioFile.data
    if (!this.playback) {
      this.ref.src = `data:audio/aac;base64,${base64Sound}`
      this.ref.play();
      this.track = this.selectedItem
    }
    if (this.playback) {
      this.ref.pause()
      this.playback = false
      this.selectedItem = null
      this.track = this.selectedItem
    }
    let play = this;
    this.ref.onplaying = function (eve) {
      console.log(eve)
      play.playback = true;
    }
    this.ref.onended = function (e) {
      console.log(e);
      play.playback = false;
      play.selectedItem = null;
      play.track = play.selectedItem
    }
  }

  async deleteAudio(fileName: any) {
    this.play(fileName)
    console.log(fileName)
    await Filesystem.deleteFile({
      path: fileName,
      directory: Directory.External
    })
    this.loadAudio();
  }


  //upload and delete uploaded audio from device
  async addAudio() {
    await FilePicker.pickFiles({
      types: ['audio/aac'],
    }).then(async res => {
      this.uploadAudio.push(res.files[0]);

    });
  }

  async playUploadAudio(file: any) {
    const contents = await Filesystem.readFile({
      path: file.path!,
    })
    console.log(contents.data)

    if (this.track != this.selectedItem) {
      this.playback = false;
    } else {
      this.playback = true;
    }

    if (!this.playback) {
      this.ref.src = `data:audio/aac;base64,${contents.data}`
      this.ref.play();
      this.track = this.selectedItem

    }
    if (this.playback) {
      this.ref.pause()
      this.playback = false
      this.selectedItem = null
      this.track = this.selectedItem
    }
    let play = this;
    this.ref.onplaying = function (eve) {
      console.log(eve)
      play.playback = true;
    }
    this.ref.onended = function (e) {
      console.log(e);
      play.playback = false;
      play.selectedItem = null;
      play.track = play.selectedItem
    }

  }

  deleteUploadAudio(file: any,index: number) {
    this.playUploadAudio(file)
    this.uploadAudio.splice(index, 1)
    console.log(this.uploadAudio, index)
  }



  // upload audio to Cloudinary
  async uploadAudioToCloudinary() {
    this.storedAudio.forEach(async element => {
      await Cloudinary.uploadResource({
        path: element.uri,
        resourceType: ResourceType.Video,
        uploadPreset: 'm442awuh',
      }).then(response => {
        console.log("Successfully uploaded 1")
      })
    });

    this.uploadAudio.forEach(async element => {
      await Cloudinary.uploadResource({
        path: element.path,
        resourceType: ResourceType.Video,
        uploadPreset: 'm442awuh',
      }).then(response => {
        console.log("Successfully uploaded 2")
      })
    });
  }




  // add and remove witness
  // addWitness() {
  //   console.log(this.witnessArray)
  //   this.witnessArray.push(this.witnessObj);
  // }
  deleteWitness(i: number) {
    console.log(i)
    this.witnessArray.splice(i, i);
    console.log(this.witnessArray)
  }

  addInvolvedParty(){
    this.involvedPartiesArray.push(this.involvedPartiesObject)
    console.log(this.involvedPartiesArray)
  }

  deleteInvolvedParty(i: number) {
    this.involvedPartiesArray.splice(i, 1);
  }


  removeImage(index: number, name: string) {
    console.log(this.actualAreaOfDamage.length)
    if(name == "actualAreaOfDamage"){
      this.actualAreaOfDamage.splice(index, 1);
    }
    console.log(this.actualAreaOfDamage.length)
  }

}
