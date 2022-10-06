export interface Product {
    id?:string;
    code?:string;
    name?:string;
    description?:string;
    price?:number;
    quantity?:number;
    inventoryStatus?:string;
    category?:string;
    image?:string;
    rating?:number;
    orders?: {
        id?:string,
        productCode?: string;
        date?: string;
        amount?: number
        quantity?: number;
        customer?: string;
        status?: string;
    }[]
}