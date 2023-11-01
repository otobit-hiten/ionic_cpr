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
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Cloudinary, ResourceType } from '@capawesome/capacitor-cloudinary';
import { LanguageService } from '../services/language.service';
import { Geolocation } from '@capacitor/geolocation';
import { UploadImage } from '../services/user';
import { LoaderService } from '../services/loader.service';
import { timeStamp } from 'console';



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
  selected = '';

  ngOnInit() {
    this.permission()
    this.languageList = this.languageService.getLanguage();
    this.selected = this.languageService.selectedLanguage

    this.swiperReady()
    VoiceRecorder.requestAudioRecordingPermission()
    // this.loadAudio();
    this.witnessArray.push(this.witnessObj)
    console.log(this.witnessArray.length)
    this.initialize();
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
  slideFourForm: FormGroup
  slideFiveForm: FormGroup
  recording: boolean = false;
  displayTime = '';
  time = 0;
  storedAudio: FileInfo[] = [];
  uploadAudio: any[] = [];
  public playback = false;
  ref = new Audio();
  selectedItem: any;
  track: any;
  latAndLng: string = "";
  lat_lang_towCompany: string = ''
  public actualAreaOfDamage: UploadImage[] = []
  public nearestStreet: UploadImage[] = [];
  public policeReport: UploadImage[] = [];
  public licensePlate: UploadImage[] = [];
  public vinNo: UploadImage[] = [];
  public allFourSide: UploadImage[] = [];
  public closeUp: UploadImage[] = [];
  witnessObj = { name: '', phone: '', email: '', image: [] }
  witnessArray: any = []
  involvedPartiesArray: any = [];
  involvedPartiesObject = { idImage: [], insuranceImage: [] };
  otherVehicleArray: any = [];
  otherVehicleArrayObject = { licenceImg: [], vinNoOther: [], all4side: [], closeUpOther: [], map: '' };




  constructor(private loader: LoaderService, public formBuilder: FormBuilder, private readonly domSanitizer: DomSanitizer, public languageService: LanguageService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params['map'] === 'towCompany') {
        if (typeof params['lat'] === "undefined" || typeof params['lng'] === "undefined") {
          this.lat_lang_towCompany = 'Address of Accident';
        } else {
          this.lat_lang_towCompany = `${params['lat']},${params['lng']}`;
        }
      }
      if (params['map'] === 'addressAccident') {
        if (typeof params['lat'] === "undefined" || typeof params['lng'] === "undefined") {
          this.latAndLng = 'Address of Accident';
        } else {
          this.latAndLng = `${params['lat']},${params['lng']}`;
        }
      }
      if (params['map'] === 'towCompanyOther') {
        let i = Number(`${params['int']}`)
        let mapValue = `${params['lat']},${params['lng']}`
        console.log('NUMBERRRR')
        console.log(i)
        if (typeof params['lat'] === "undefined" || typeof params['lng'] === "undefined") {
          this.otherVehicle().at(i).patchValue({
            map: 'Address of Accident'
          });
          this.otherVehicleArray[i].map = mapValue
        } else {
          this.otherVehicle().at(i).patchValue({
            map: mapValue
          });
        }
      }


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
      policeName: '',
      policeReport: ''
    })

    this.slideFourForm = formBuilder.group({
      vehicleMakeModel: '',
      vehicleLicencePlateNo: '',
      vehicleVinNo: '',
      speedometer: '',
      towCompany: ''
    })

    this.slideFiveForm = this.formBuilder.group({
      otherVehicle: this.formBuilder.array([]),
    })
  }

  involvedParties(): FormArray {
    return this.slideThreeForm.get("involvedParties") as FormArray
  }
  newInvolvedParties(): FormGroup {
    return this.formBuilder.group({
      name: '',
      number: '',
      insuranceCompany: '',
      id: [],
      insurance: []
    })
  }
  addInvolvedParties() {
    let involvedPartiesObjects = { idImage: [], insuranceImage: [] };
    this.involvedPartiesArray.push(involvedPartiesObjects)
    this.involvedParties().push(this.newInvolvedParties());
  }
  removeInvolvedParties(i: number) {
    this.involvedPartiesArray.splice(i, 1)
    this.involvedParties().removeAt(i)
  }


  witness(): FormArray {
    return this.slideThreeForm.get("witness") as FormArray
  }
  newWitness(): FormGroup {
    return this.formBuilder.group({
      name: '',
      number: '',
    })
  }
  addWitness() {
    this.witness().push(this.newWitness());
  }
  removeWitness(i: number) {
    this.witness().removeAt(i)
  }


  otherVehicle(): FormArray {
    return this.slideFiveForm.get("otherVehicle") as FormArray
  }
  newOtherVehicle(): FormGroup {
    return this.formBuilder.group({
      vehicleMakeModel: '',
      vehicleLicencePlate: '',
      vinNo: '',
      towCompany: '',
      licenceImg: [],
      vinNoOther: [],
      all4side: [],
      closeUpOther: [],
      map: ''
    })
  }
  addOtherVehicle() {
    let otherVehicleArrayObject = { licenceImg: [], vinNoOther: [], all4side: [], closeUpOther: [] };
    this.otherVehicleArray.push(otherVehicleArrayObject)
    this.otherVehicle().push(this.newOtherVehicle());
  }
  removeOtherVehicle(i: number) {
    this.otherVehicleArray.splice(i, 1)
    this.otherVehicle().removeAt(i)
  }

  async permission() {
    const permissionStatus = await Geolocation.checkPermissions();
    console.log('Permission status: ', permissionStatus.location);
    if (permissionStatus?.location != 'granted') {
      const requestStatus = await Geolocation.requestPermissions();
    }
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

  submitThreeForm = async () => {
    if (this.slideThreeForm.valid) {
      console.log(this.slideThreeForm.value, "Three");
      this.swiper = await this.swiperRef?.nativeElement.swiper;
      this.goNext();
    } else {
      return console.log('Please provide all the required values!');
    }
  }

  submitFourForm = async () => {
    if (this.slideFourForm.valid) {
      console.log(this.slideFourForm.value, "Four");
      this.swiper = await this.swiperRef?.nativeElement.swiper;
      this.goNext();
    } else {
      return console.log('Please provide all the required values!');
    }
  }
  submitFiveForm = async () => {
    this.loader.showLoader();

    let address_of_accident: string[] = []
    this.actualAreaOfDamage.forEach((res) => {
      address_of_accident.push(res.path)
    })

    let nearest_street: string[] = []
    this.nearestStreet.forEach((res) => {
      nearest_street.push(res.path)
    })

    let police_report: string[] = []
    this.policeReport.forEach((res) => {
      police_report.push(res.path)
    })

    let image_licence: string[] = []
    this.licensePlate.forEach((res) => {
      image_licence.push(res.path)
    })

    let vin_image: string[] = []
    this.vinNo.forEach((res) => {
      vin_image.push(res.path)
    })

    let all_side: string[] = []
    this.allFourSide.forEach((res) => {
      all_side.push(res.path)
    })

    let closeup: string[] = []
    this.closeUp.forEach((res) => {
      closeup.push(res.path)
    })

    this.involvedPartiesArray.forEach((res: any, index: number) => {
      let datas: string[] = []
      res.idImage.forEach((data: any) => {
        datas.push(data.path)
      })
      this.involvedParties().at(index).patchValue({
        id: datas
      })
    })

    this.involvedPartiesArray.forEach((res: any, index: number) => {
      let datas: string[] = []
      res.insuranceImage.forEach((data: any) => {
        datas.push(data.path)
      })
      this.involvedParties().at(index).patchValue({
        insurance: datas
      })
    })

    this.otherVehicleArray.forEach((res: any, index: number) => {
      let datas: string[] = []
      res.licenceImg.forEach((data: any) => {
        datas.push(data.path)
      })
      this.otherVehicle().at(index).patchValue({
        licenceImg: datas
      })
    })

    this.otherVehicleArray.forEach((res: any, index: number) => {
      let datas: string[] = []
      res.vinNoOther.forEach((data: any) => {
        datas.push(data.path)
      })
      this.otherVehicle().at(index).patchValue({
        vinNoOther: datas
      })
    })

    this.otherVehicleArray.forEach((res: any, index: number) => {
      let datas: string[] = []
      res.all4side.forEach((data: any) => {
        datas.push(data.path)
      })
      this.otherVehicle().at(index).patchValue({
        all4side: datas
      })
    })

    this.otherVehicleArray.forEach((res: any, index: number) => {
      let datas: string[] = []
      res.closeUpOther.forEach((data: any) => {
        datas.push(data.path)
      })
      this.otherVehicle().at(index).patchValue({
        closeUpOther: datas
      })
    })

    this.formToMail = {
      name_insured: this.slideOneForm.controls['name_insured'].value,
      policy_no: this.slideOneForm.controls['name_insured'].value,
      tell_us_what_happenend: this.slideOneForm.controls['tell_us_what_happened'].value,
      storedAudio: this.storedAudio,
      uploadAudio: this.uploadAudio,
      address_of_accident: this.latAndLng,
      image_surrounding: address_of_accident,
      image_nearest_street: nearest_street,
      involvedparty: this.involvedParties().value,
      witness: this.witness().value,
      police_name: this.slideThreeForm.controls['policeName'].value,
      police_report: this.slideThreeForm.controls['policeReport'].value,
      image_police_report: police_report,
      vehicle_make_model: this.slideFourForm.controls['vehicleMakeModel'].value,
      licence_plate: this.slideFourForm.controls['vehicleLicencePlateNo'].value,
      image_licence: image_licence,
      vin_no: this.slideFourForm.controls['vehicleVinNo'].value,
      image_vin_no: vin_image,
      speedometer: this.slideFourForm.controls['speedometer'].value,
      image_all_side: all_side,
      image_close_up: closeup,
      tow_company: this.slideFourForm.controls['towCompany'].value,
      tow_company_address: this.lat_lang_towCompany,
      other_vehcile_damage: this.otherVehicle().value
    }

    console.log(this.formToMail)

    this.call().then(rres => {
      this.loader.hideLoader()
    })

  }

  async call() {
    try {
      console.log("Calling...")
      var Parse = require('parse');
      const query = await Parse.Cloud.run('result', this.formToMail)
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
    this.swiper?.slideNext(500);
  }

  goPrev() {
    this.swiper?.slidePrev(500);
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }


  //imagePicker
  async openImagePicker(name: string, i: number): Promise<void> {
    console.log(i)
    await FilePicker.pickImages({
      multiple: true,
      readData: true,
    }).then(data => {
      switch (name) {
        case "actualAreaOfDamage":
          data.files.forEach(async (file) => {
            this.actualAreaOfDamage.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            })
            var place = this.actualAreaOfDamage.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.actualAreaOfDamage[place].path = res.url;
              this.actualAreaOfDamage[place].isUploaded = true;
            })
          });
          break;
        case "nearestStreet":
          data.files.forEach(async (file) => {
            this.nearestStreet.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            })
            var place = this.nearestStreet.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.nearestStreet[place].path = res.url;
              this.nearestStreet[place].isUploaded = true;
            })
          });
          break;

        case "idImage":
          data.files.forEach(async (file) => {
            this.involvedPartiesArray[i].idImage.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            });
            var place = this.involvedPartiesArray[i].idImage.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.involvedPartiesArray[i].idImage[place].path = res.url;
              this.involvedPartiesArray[i].idImage[place].isUploaded = true;
            })
          })
          this.involvedParties().at(i).patchValue({
            id: this.involvedPartiesArray[i].idImage,
          })
          break;

        case "insuranceImage":
          data.files.forEach(async (file) => {
            this.involvedPartiesArray[i].insuranceImage.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            });
            var place = this.involvedPartiesArray[i].insuranceImage.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.involvedPartiesArray[i].insuranceImage[place].path = res.url;
              this.involvedPartiesArray[i].insuranceImage[place].isUploaded = true;
            })
          })
          this.involvedParties().at(i).patchValue({
            insurance: this.involvedPartiesArray[i].insuranceImage,
          })
          break;

        case "policeReport":
          data.files.forEach(async (file) => {
            this.policeReport.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            })
            var place = this.policeReport.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.policeReport[place].path = res.url;
              this.policeReport[place].isUploaded = true;
            })
          });
          break;

        case "licensePlate":
          data.files.forEach(async (file) => {
            this.licensePlate.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            })
            var place = this.licensePlate.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.licensePlate[place].path = res.url;
              this.licensePlate[place].isUploaded = true;
            })
          });
          break;

        case "vinNo":
          data.files.forEach(async (file) => {
            this.vinNo.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            })
            var place = this.vinNo.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.vinNo[place].path = res.url;
              this.vinNo[place].isUploaded = true;
            })
          });
          break;

        case "allFourSide":
          data.files.forEach(async (file) => {
            this.allFourSide.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            })
            var place = this.allFourSide.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.allFourSide[place].path = res.url;
              this.allFourSide[place].isUploaded = true;
            })
          });
          break;

        case "closeUp":
          data.files.forEach(async (file) => {
            this.closeUp.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            })
            var place = this.closeUp.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.closeUp[place].path = res.url;
              this.closeUp[place].isUploaded = true;
            })
          });
          break;

        case "licensePlateOther":
          data.files.forEach(async (file) => {
            this.otherVehicleArray[i].licenceImg.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            });
            var place = this.otherVehicleArray[i].licenceImg.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.otherVehicleArray[i].licenceImg[place].path = res.url;
              this.otherVehicleArray[i].licenceImg[place].isUploaded = true;
            })
          });
          this.otherVehicle().at(i).patchValue({
            licenceImg: this.otherVehicleArray[i].licenceImg,
          })
          break;

        case "vinNoOther":
          data.files.forEach(async (file) => {
            this.otherVehicleArray[i].vinNoOther.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            });
            var place = this.otherVehicleArray[i].vinNoOther.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.otherVehicleArray[i].vinNoOther[place].path = res.url;
              this.otherVehicleArray[i].vinNoOther[place].isUploaded = true;
            })
          });
          this.otherVehicle().at(i).patchValue({
            vinNoOther: this.otherVehicleArray[i].vinNoOther,
          })
          break;

        case "all4sideOther":
          data.files.forEach(async (file) => {
            this.otherVehicleArray[i].all4side.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            });
            var place = this.otherVehicleArray[i].all4side.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.otherVehicleArray[i].all4side[place].path = res.url;
              this.otherVehicleArray[i].all4side[place].isUploaded = true;
            })
          });

          this.otherVehicle().at(i).patchValue({
            all4side: this.otherVehicleArray[i].all4side,
          })
          console.log(this.otherVehicleArray);
          break;

        case "closeUpOther":
          data.files.forEach(async (file) => {
            this.otherVehicleArray[i].closeUpOther.push({
              isUploaded: false,
              localPath: file.path!,
              path: '',
              name: ''
            });
            var place = this.otherVehicleArray[i].closeUpOther.length - 1
            await Cloudinary.uploadResource({
              path: file.path,
              resourceType: ResourceType.Image,
              uploadPreset: 'm442awuh',
            }).then(res => {
              this.otherVehicleArray[i].closeUpOther[place].path = res.url;
              this.otherVehicleArray[i].closeUpOther[place].isUploaded = true;
            })
          });
          this.otherVehicle().at(i).patchValue({
            closeUpOther: this.otherVehicleArray[i].closeUpOther,
          })
          console.log(this.otherVehicleArray);
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

  deleteUploadAudio(file: any, index: number) {
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

  removeImage(index: number, name: string) {
    console.log(this.actualAreaOfDamage.length)
    if (name === "actualAreaOfDamage") {
      this.actualAreaOfDamage.splice(index, 1);
    }
    console.log(this.actualAreaOfDamage.length)
  }



  formToMail: {} = {
    name_insured: '',
    policy_no: '',
    tell_us_what_happenend: '',
    uploadAudio: [],
    address_of_accident: '',
    image_surrounding: [],
    image_nearest_street: [],
    involvedparty: FormArray,
    witness: FormArray,
    police_name: '',
    police_report: '',
    image_police_report: [],
    vehicle_make_model: '',
    licence_plate: '',
    image_licence: [],
    vin_no: '',
    image_vin_no: [],
    speedometer: '',
    image_all_side: [],
    image_close_up: [],
    tow_company: '',
    tow_company_address: '',
    other_vehcile_damage: FormArray
  }


}
