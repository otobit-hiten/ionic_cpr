import { PickedFile } from "@capawesome/capacitor-file-picker";

export interface User {
  name: string;
  phone: string;
  email: string;
  policyNo: string;

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
