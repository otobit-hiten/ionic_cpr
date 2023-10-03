export interface User {
    name: string;
    phone: string;
    email: string;
    policyNo: string;
    image: {
        name: string;
        base64: string;
    }
}