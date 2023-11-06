import { PickedFile } from "@capawesome/capacitor-file-picker";

export interface User {
  name: string;
  phone: string;
  email: string;
  company_name: string;

}


export interface Locations {
  lat: number;
  lng: number;
}

export interface Image {
  name: string;
  path: string;
  localPath: string;
}

export interface UploadImage{
  name: string;
  path: string;
  localPath: string;
  isUploaded : boolean;
}
