import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import * as  Parse from 'parse';
import { Swiper } from 'swiper'
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';
import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, RouterModule]
})
export class FormPage implements OnInit {

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper
  slideOneForm: FormGroup
  slideTwoForm: FormGroup
  public submitAttempt: boolean = false;
  public files: PickedFile[] = [];
  recording: boolean = false;
  displayTime = '';
  time = 0;
  storedAudio: FileInfo[] = [];
  public playback = false;
  ref = new Audio();
  selectedItem: any;
  track: any;
  witnessObj = { name: '', phone: '', email: '', image: [] }
  witnessArray: any = []

  languageList = [
    {
      code: "en", title: "English", text: "English"
    },
    {
      code: "es", title: "Spanish", text: "Española"
    }
  ]

  ionChange(event: any) {
    console.log(event.detail.value)
    this.translateService.use(event.target.value ? event.target.value : "en")
  }

  compareWith: any;
  MyDefaultValue: String = "en";  //set default language here  {en= English ; es = spanish}

  compareWithFn(o1: any, o2: any) {
    return o1 === o2;
  };

  constructor(private route: ActivatedRoute,private router: Router, public formBuilder: FormBuilder, private changeRef: ChangeDetectorRef, private readonly domSanitizer: DomSanitizer, private translateService: TranslateService) {
    console.log(this.swiperRef?.nativeElement.swiper);
    console.log(this.swiperRef);
    Parse.initialize('4fJYYN0bBUsmOumrcXWZolpXm0OCBId8S0lKr45l', 'RRTqRi9mWSC3Udfu6RQglRK3MDx7N1hjSOQs0RPj');
    (Parse as any).serverURL = "https://parseapi.back4app.com/";
    this.slideOneForm = formBuilder.group({
      name_insured: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      policy_no: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      tell_us_what_happened: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
    });

    this.route.queryParams.subscribe(params => {
      console.log(this.router.getCurrentNavigation()?.extras.state?.coords)
    });

    this.slideTwoForm = formBuilder.group({
      address_of_accident: ['', Validators.required]
    })

  }

  get errorControl() {
    return this.slideOneForm.controls;
  }

  submitOneForm = async () => {
    this.submitAttempt = true;
    if (this.slideOneForm.valid) {
      console.log(this.slideOneForm.value);
      this.submitAttempt = false;
      this.swiper = await this.swiperRef?.nativeElement.swiper;
      this.goNext();
      return false;
    } else {
      this.submitAttempt = true;
      return console.log('Please provide all the required values!');
    }
  }
  submitTwoForm = async () => {

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






  ngOnInit() {
    this.swiperReady()
    VoiceRecorder.requestAudioRecordingPermission()
    // this.loadAudio();
    this.witnessArray.push(this.witnessObj)
    console.log(this.witnessArray.length)

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

  async next_one() {
    this.submitAttempt = true;
    if (this.slideOneForm.valid) {
      console.log("Form Validation Passed");
      this.swiper = await this.swiperRef?.nativeElement.swiper;
      this.goNext();
    } else {
      console.log("Form Validation Failed");
    }
  }

  goNext() {
    console.log('changed: ');
    // $ionicScrollDelegate.scrollTop();
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

  async openImagePicker() {
    const result = await FilePicker.pickImages({
      multiple: true,
      readData: true,
    });
    console.log(result);
    this.files = result.files;
  }

  public convertPathToWebPath(path: string): SafeUrl {
    const fileSrc = Capacitor.convertFileSrc(path);
    return this.domSanitizer.bypassSecurityTrustUrl(fileSrc);
  }


  //voice Record
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
    console.log(fileName)
    await Filesystem.deleteFile({
      path: fileName,
      directory: Directory.External
    })
    this.loadAudio();


  }

  addWitness() {
    console.log(this.witnessArray)
    this.witnessArray.push(this.witnessObj);
  }
  deleteWitness(i: number) {
    console.log(i)
    this.witnessArray.splice(i, i);
    console.log(this.witnessArray)
  }

  async addAudio(){
    const result = await FilePicker.pickFiles({
      types: ['audio/aac'],

      readData:true
    });
    console.log(result);
  }

}
