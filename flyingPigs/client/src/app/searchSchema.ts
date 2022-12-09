// schema for search input
export interface SearchSchema {
    selectedClass: DropdownOption;
    isRoundTrip: boolean;
    adultPass: number;
    childPass: number;
    infantPass: number;
    totalPass: number;
    departDate: string;
    returnDate: string;
    dateRange?: string[];
    departAdd: string;
    departCoord: google.maps.LatLng;
    arriveAdd: string;
    arriveCoord: google.maps.LatLng;
    selectedDTransport: DropdownOption;
    selectedATransport: DropdownOption;
    maxTimeStart: DropdownOption;
    maxTimeEnd: DropdownOption;
    bufferTime: DropdownOption;
    lastLowestPrice?:number;
}

// option format for input dropdowns
export interface DropdownOption {
    name: string;
    code?: string;
    sec?: number;
    icon?: string;
}