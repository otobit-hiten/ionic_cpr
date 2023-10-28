export interface User {
    name: string;
    phone: string;
    email: string;
    policyNo: string;
    image: {
        name: string;
        localPath: string;
    }
}


export interface Locations{
    lat:number;
    lng:number;
}
