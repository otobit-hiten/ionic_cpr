import { PickedFile } from "@capawesome/capacitor-file-picker";

export interface User {
    name: string;
    phone: string;
    email: string;
    policyNo: string;
    image: PickedFile[]
}


export interface Locations{
    lat:number;
    lng:number;
}
