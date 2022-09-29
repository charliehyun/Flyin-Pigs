// schema for search input
export interface SearchSchema {
    selectedClass: DropdownOption;
    isRoundTrip: boolean;
    adultPass: number;
    childPass: number;
    infantPass: number;
    totalPass: number;
    departAdd: string;
    arrivAdd: string;
    selectedTransport: DropdownOption;
    maxTimeStart: number;
    maxTimeEnd: number;
}

// option format for input dropdowns
export interface DropdownOption {
    name: string;
    code: string;
}