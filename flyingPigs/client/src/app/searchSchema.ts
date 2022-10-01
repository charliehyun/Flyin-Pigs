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
    departAdd: string;
    arriveAdd: string;
    selectedTransport: DropdownOption;
    maxTimeStart: DropdownOption;
    maxTimeEnd: DropdownOption;
}

// option format for input dropdowns
export interface DropdownOption {
    name: string;
    code: string;
}