import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { SearchSchema, DropdownOption } from '../searchSchema';
import { Router } from '@angular/router';
import {NGXLogger} from "ngx-logger";
import { faCar, faBus, faPlane, faPersonBiking, faPersonWalking, faDollarSign, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../login-signup/authentication.service';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss'],
    providers: [MessageService]
})

export class SearchBoxComponent implements OnInit {
    addressResult$: Observable<any> = new Observable();
    classes: DropdownOption[];  // Flight class options
    selectedClass: DropdownOption = {name: 'Economy', code: 'ECONOMY'}; // Selected flight class
    dTransportType: DropdownOption[]; // Transportation to airport options
    aTransportType: DropdownOption[]; // Transportation from airport options
    selectedDTransport: DropdownOption = {name: 'Car', code: 'driving', icon: 'car'}; // Transportation option
    selectedATransport: DropdownOption = {name: 'Car', code: 'driving', icon: 'car'}; // Transportation option
    hours: DropdownOption[]; // hours for transportation before/after flight

    adultPass: number = 1;  // number of adult passengers
    childPass: number = 0;  // number of child passengers
    infantPass: number = 0; // number of infant passengers

    maxTimeStart: DropdownOption = {name: '3 hr', sec: 10800}; //default starting driving hours
    maxTimeEnd: DropdownOption = {name: '1 hr', sec: 3600}; //default end driving hours

    totalPass: number = this.adultPass + this.childPass + this.infantPass;  // total number of passengers
    isRoundTrip: boolean = true; // Round Trip toggle
    oneWayRoundTrip: any[];

    bufferTime: DropdownOption = {name: '2 hr', sec: 7200};
    maxDate: Date; // max selectable date
    departDate: Date = new Date(); // selected departure date
    returnDate: Date = new Date(); // selected return date (in the case of round trip)
    date: Date = new Date();  // current date

    departAdd= "";  // departure address input
    arriveAdd= "";  // arrival address input

    search: SearchSchema;

    dateRange: Date[] = [new Date(), new Date()];

    @Input()
    explore: boolean;

    //icons
    driving = faCar;
    transit = faBus;

    constructor( public auth: AuthenticationService, private userService: UserService, private messageService: MessageService, private router: Router, private logger: NGXLogger, library: FaIconLibrary) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };

        this.setDefaults();

        this.oneWayRoundTrip = [
            { label: 'One Way', value: false },
            { label: 'Round Trip', value: true },
        ];

        this.classes = [
            {name: 'Economy', code: 'ECONOMY'},
            {name: 'Premium Economy', code: 'PREMIUM_ECONOMY'},
            {name: 'Business', code: 'BUSINESS'},
            {name: 'First', code: 'FIRST'}
        ];
        this.dTransportType = [
            {name: 'Car', code: 'driving', icon: 'car'},
            {name: 'Public Transit', code: 'transit', icon:'bus'},
            // {name: 'Bike', code: 'Biking'},
            // {name: 'Walk', code: 'Walking'}
        ];
        this.aTransportType = [
            {name: 'Car', code: 'driving', icon: 'car'},
            {name: 'Public Transit', code: 'transit', icon:'bus'},
            // {name: 'Bike', code: 'Biking'},
            // {name: 'Walk', code: 'Walking'}
        ];
        this.hours = [
            {name: '1 hr', sec: 3600},
            {name: '2 hr', sec: 7200},
            {name: '3 hr', sec: 10800},
            {name: '4 hr', sec: 14400},
            {name: '5 hr', sec: 18000},
            {name: '6 hr', sec: 21600},
            {name: '7 hr', sec: 25200}
        ];

        library.addIcons(
            faCar,
            faBus
        );
    }

    // show toast based on success/error
    showMessage(severity, summary, detail) {
        this.messageService.clear();
        this.messageService.add({severity: severity, summary: summary, detail: detail});
    }

    // Google autocomplete stuff
    options:Options = new Options({
        componentRestrictions:{
        country:"US"}
    });
    AddressChange1(address: any) {
        this.departAdd = address.formatted_address;
    }
    AddressChange2(address: any) {
        this.arriveAdd = address.formatted_address;
    }

    // update total passengers display when passenger overlay is exited
    updatePassengers() {
        this.totalPass = this.adultPass + this.childPass + this.infantPass;
    }

    // ensure return date is cleared if one way is selected
    handleOneWay(e) {
        // if(e.checked) {
        //     this.returnDate = ""
        // }
    }

    setDefaults() {
        this.search = {
            selectedClass: {name: 'Economy', code: 'ECONOMY'},
            isRoundTrip: true,
            adultPass: 1,
            childPass: 0,
            infantPass: 0,
            totalPass: 1,
            departDate: this.date.toISOString().split("T")[0],
            returnDate: "",
            departAdd: "",
            departCoord: new google.maps.LatLng({"lat": 0, "lng": 0}),
            arriveAdd: "",
            arriveCoord: new google.maps.LatLng({"lat": 0, "lng": 0}),
            selectedDTransport: {name: 'Car', code: 'driving', icon: 'car'},
            selectedATransport: {name: 'Car', code: 'driving', icon: 'car'},
            maxTimeStart: {name: '3 hr', sec: 10800},
            maxTimeEnd: {name: '1 hr', sec: 3600},
            bufferTime: {name: '2 hr', sec: 7200}
        }
        return JSON.stringify(this.search);
    }

    // reset input boxes to valid, clear inputs, set back to default, and set search object back to default
    handleClear() {
        sessionStorage.removeItem('searchParams');
        this.setDefaults();
        this.resetValidity();
        this.selectedClass = {name: 'Economy', code: 'ECONOMY'};
        this.selectedDTransport = {name: 'Car', code: 'driving', icon: 'car'};
        this.selectedATransport = {name: 'Car', code: 'driving', icon: 'car'};
        this.isRoundTrip = true;
        this.adultPass = 1;
        this.childPass = 0;
        this.infantPass = 0;
        this.departDate = new Date();
        this.returnDate = new Date();
        this.totalPass = this.adultPass + this.childPass + this.infantPass;
        this.departAdd = "";
        this.arriveAdd = "";
        this.maxTimeStart = {name: '3 hr', sec: 10800};
        this.maxTimeEnd = {name: '1 hr', sec: 3600};
        this.bufferTime = {name: '2 hr', sec: 7200};
        this.dateRange = [new Date(), new Date()];
    }

    // input validation, geocoding, search sent to results, and navigate to results
    async handleSearch() {
        this.resetValidity();
        // let departureCoord = await this.geocode(this.departAdd);
        // let arrivalCoord = await this.geocode(this.arriveAdd);
        let departureCoord;
        let arrivalCoord;
        let prevSearch = JSON.parse(sessionStorage.getItem('searchParams') || this.setDefaults());
        if(!prevSearch || prevSearch.departAdd != this.departAdd){
            departureCoord = await this.geocode(this.departAdd);
        } else {
            departureCoord = prevSearch.departCoord;
        }
        if(!prevSearch || prevSearch.arriveAdd != this.arriveAdd){
            arrivalCoord = await this.geocode(this.arriveAdd);
        } else {
            arrivalCoord = prevSearch.arriveCoord;
        }

        let route = true;
        // input validation
        if(!this.departDate) {
            const x = document.getElementById('departDate');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
            route = false
        } else {
            const x = document.getElementById('departDate');
            // var departDateObj = new Date(this.departDate);
            if(this.departDate < this.date) {
                console.log("sucs", this.departDate, this.date)
            }

            if(this.departDate < this.date || this.departDate > this.maxDate || x?.classList.contains('ng-invalid')) {
            // if(departDateObj < new Date(this.date) || departDateObj > new Date(this.maxDate) || x?.classList.contains('ng-invalid')) {
                x?.classList.add('ng-invalid')
                x?.classList.add('ng-dirty')
                route = false
            }
        }
        if(!this.returnDate) {
            if(this.isRoundTrip) {
                const x = document.getElementById('returnDate');
                x?.classList.add('ng-invalid')
                x?.classList.add('ng-dirty')
                route = false
            }
        } else {
            const x = document.getElementById('returnDate');
            // var returnDateObj = new Date(this.returnDate);
            if(this.returnDate < new Date(this.departDate) || this.returnDate > this.maxDate || x?.classList.contains('ng-invalid')) {
            // if(returnDateObj < new Date(this.departDate) || returnDateObj > this.maxDate || x?.classList.contains('ng-invalid')) {
                x?.classList.add('ng-invalid')
                x?.classList.add('ng-dirty')
                route = false
            }
        }
        if(!this.departAdd || departureCoord == null) {
            // departure address is invalid probably
            // should not advance
            const x = document.getElementById('daddress');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
            route = false
        }
        if(!this.arriveAdd || arrivalCoord == null) {
            // arrival address is invalid probably
            // should not advance
            const x = document.getElementById('aaddress');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
            route = false
        }

        // if valid, create search object and route to results
        // else, alert
        if(route && !this.explore) {
            this.search = {
                selectedClass: this.selectedClass,
                isRoundTrip: this.isRoundTrip,
                adultPass: this.adultPass,
                childPass: this.childPass,
                infantPass: this.infantPass,
                totalPass: this.totalPass,
                departDate: this.departDate.toISOString().split("T")[0],
                returnDate: this.isRoundTrip ? this.returnDate.toISOString().split("T")[0] : "",
                departAdd: this.departAdd,
                departCoord: departureCoord,
                arriveAdd: this.arriveAdd,
                arriveCoord: arrivalCoord,
                selectedDTransport: this.selectedDTransport,
                selectedATransport: this.selectedATransport,
                maxTimeStart: this.maxTimeStart,
                maxTimeEnd: this.maxTimeEnd,
                bufferTime: this.bufferTime
            }
            sessionStorage.setItem('searchParams', JSON.stringify(this.search));
            this.router.navigate(['results'])
        } else if (route && this.explore) { //this is the explore page, pass it date range.
            this.search = {
                selectedClass: this.selectedClass,
                isRoundTrip: false,
                adultPass: this.adultPass,
                childPass: this.childPass,
                infantPass: this.infantPass,
                totalPass: this.totalPass,
                departDate: "",
                returnDate: "",
                dateRange: this.dateRange.map(date => date.toISOString().split("T")[0]),
                departAdd: this.departAdd,
                departCoord: departureCoord,
                arriveAdd: this.arriveAdd,
                arriveCoord: arrivalCoord,
                selectedDTransport: this.selectedDTransport,
                selectedATransport: this.selectedATransport,
                maxTimeStart: this.maxTimeStart,
                maxTimeEnd: this.maxTimeEnd,
                bufferTime: this.bufferTime
            }
            sessionStorage.setItem('searchParams', JSON.stringify(this.search));
            this.router.navigate(['results'])
        } else {
            this.showMessage('error', 'Error', 'Some fields are invalid or empty. Please fix them and try again.');

        }
    }

    // reset validity of all input boxes
    resetValidity() {
        const inputs: Element[] = Array.from(document.getElementsByTagName("input"));
        inputs.forEach((ins: Element) => {
            ins.classList.remove('ng-invalid')
            ins.classList.remove('ng-dirty')
            ins.classList.add('ng-pristine')
        })

        const calendars: Element[] = Array.from(document.getElementsByTagName("p-calendar"));
        calendars.forEach((cals: Element) => {
            cals.classList.remove('ng-invalid')
            cals.classList.remove('ng-dirty')
            cals.classList.add('ng-pristine')
        })
    }

    /*
    Geocodes an address.
    Returns LatLng object with lat() and lng() getter functions
    If an error occurs, returns a null. 
    */
    async geocode(address) {
        console.log("GEOCODING");
        var coord;
        var geocoder = new google.maps.Geocoder();
        await geocoder.geocode({ 'address': address}).then(response => {
            coord = response.results[0].geometry.location;
        }).catch(e => {
            coord = null;
        });
        return coord;
    }

    ngOnInit() {
        // this.date = new Date().toISOString().split("T")[0];
        // this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split("T")[0];
        this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5));

        this.search = JSON.parse(sessionStorage.getItem('searchParams') || this.setDefaults());
        // this.date = new Date();
        this.selectedClass = this.search.selectedClass;
        this.isRoundTrip = this.search.isRoundTrip;
        this.adultPass = this.search.adultPass;
        this.childPass = this.search.childPass;
        this.infantPass = this.search.infantPass;
        this.totalPass = this.search.totalPass;
        // this.departDate = new Date(this.search.departDate);
        let tempDate:any = new Date()
        tempDate.setDate(this.date.getDate() + 1)
        this.departDate = (new Date(this.search.departDate.replace(/-/g, '/')) > this.date) ? new Date(this.search.departDate.replace(/-/g, '/')) : this.date;
        this.returnDate = (this.search.returnDate != "" && new Date(this.search.returnDate.replace(/-/g, '/')) > this.date) ? new Date(this.search.returnDate.replace(/-/g, '/')) : tempDate;
        this.departAdd = this.search.departAdd;
        if (this.search.departAdd) {
            this.departAdd = this.search.departAdd;
        }
        else {
            if(!this.departAdd && this.auth.isLoggedIn()) {
                console.log("checking if logged in");
                this.addressResult$ = this.userService.getUser(this.auth.getUserDetails()?.email || "");
                this.addressResult$.subscribe(value => {
                    console.log(value);
                    if(value.address) {
                        this.departAdd = value.address;
                    } else {
                        console.log("no add");
                    }
                });
            }
        }
        this.arriveAdd = this.search.arriveAdd;
        this.selectedDTransport = this.search.selectedDTransport;
        this.selectedATransport = this.search.selectedATransport;
        this.maxTimeStart = this.search.maxTimeStart;
        this.maxTimeEnd = this.search.maxTimeEnd;
        this.bufferTime = this.search.bufferTime;
    }

}