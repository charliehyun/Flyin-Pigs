const https = require('https');

export class flightsApi {

    apiKey = `6317610e1779bb9b70bb01cd`;
    departureAirport:string;
    arrivalAirport:string;
    departureDate:string;
    arrivalDate:string = "";
    adultPassengers:number = 0;
    childrenPassengers:number = 0;
    infantPassengers:number = 0;
    cabinClass:string = "Economy";
    oneWayRoundTrip:string = "onewaytrip";
    response:any;
    constructor(departure:string, arrival:string, departureDate:string, arrivalDate:string,
    adults:number, children:number, infants:number, cabin:string, oneway:boolean)
    {
        this.departureAirport = departure;
        this.arrivalAirport = arrival;
        this.departureDate = departureDate;
        this.arrivalDate = arrivalDate;
        this.adultPassengers = adults;
        this.childrenPassengers = children;
        this.infantPassengers = infants;
        this.cabinClass = cabin;
        if(!oneway) {
            this.oneWayRoundTrip = "roundtrip";
        }
    }
    queryApi() {
        var apiString = ""
        if (this.oneWayRoundTrip === "onewaytrip") {
            apiString = `https://api.flightapi.io/` +
                this.oneWayRoundTrip + `/` +
                this.apiKey +  `/` + this.departureAirport + `/` + this.arrivalAirport + `/` +
                this.departureDate + `/` +
                this.adultPassengers + `/` + this.childrenPassengers + `/` + this.infantPassengers + `/` +
                this.cabinClass + `/USD`;
        }
        else {
            apiString = `https://api.flightapi.io/` +
                this.oneWayRoundTrip + `/` +
                this.apiKey +  `/` + this.departureAirport + `/` + this.arrivalAirport + `/` +
                this.departureDate + `/` + this.arrivalDate + `/` +
                this.adultPassengers + `/` + this.childrenPassengers + `/` + this.infantPassengers + `/` +
                this.cabinClass + `/USD`;
        }
        https.get(apiString, (resp:any) => {
            let data = '';
            resp.on('data', (chunk:any) => {
                data += chunk
            });

            resp.on('end', () =>{
                let response = JSON.parse(data);
                console.log(response);
                this.response = response;
            });

        }).on("error", (err:any) => {
            console.log("Error: " + err.message);
        });
        return this.parseResponse();
    }
    parseResponse() {
        let returnFlightObjects = [];


        let myObj: any = this.response;
        let flightLegs = myObj.legs;
        let flightIds:any = [];
        flightLegs.forEach(function (value:any) {
            if (value.stopoversCount <= 2) {
                flightIds.push(value.id);

            }
        }
    )
    }
}