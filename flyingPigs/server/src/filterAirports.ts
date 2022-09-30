import mongoose from "mongoose";

export class airportFinder {
    inRadiusAirportsIndices:number[] = [];
    maxDriveTime:number;
    constructor() {
        this.maxDriveTime = 0;
    }
    // this function finds the closest airport to the starting location
    async findClosestAirport(startLat: number, startLng: number) {
        // TODO get iata, lats, and lng arr from DB
        // let coords[0] = iata, coords[1] = lats, coords[2] = lng, and coords[3] = distances
        let coords: any[] = [[],[],[],[]];

        for(let i = 0; i < iata.length; i++) {
            var a = coords[1][i] - startLat;
            var b = coords[2][i] - startLng;
            coords[3][i] = Math.sqrt( a*a + b*b );
        }
        coords.sort(this.sortOnDistances);

        return coords[0][0];
    }
    // this function finds all the airports within the driving time + time to closest airport from
    // the closest airport
    async findAirportsInRange(startLat: number, startLng: number, driveTime: number, travelMethod: string) {
        
        let closestAirport = this.findClosestAirport(startLat, startLng);

        // the driving time array is stored where the 6 least significant digits
        // correspond to the IATA code 
        // e.x. 11880687278 will correspond to 11880 driving time to airport DHN
        // 68=D 72=H 78=N

        // TODO get the driveTimeArr from DB
        let driveTimeArr: any[] = [];
        // let buffer be an additional overestimation 
        const buffer = 0;
        let adjustedDriveTime = driveTime * 1000000 + 1000000 + buffer;
        let lastIndex = this.binarySearch(driveTimeArr, adjustedDriveTime, this.compareNumber);
        if(lastIndex < 0) {
            lastIndex = (lastIndex + 2) * -1;
        }
        
        let validAirports: any[] = [];
        driveTimeArr = driveTimeArr.slice(0, lastIndex + 1); 
        
        driveTimeArr.forEach(function(arpt, index) { 
            let iata = this.decodeAscii(arpt % 1000000);
            // TODO look up airport with iata and add that airport to validAirports
        });
        return validAirports;

    }
    decodeAscii(decimal: number) {
        let a = Math.floor(decimal / 10000);
        let b = Math.floor(decimal % 10000 / 100);
        let c = Math.floor(decimal % 10000 % 100);
        String.fromCharCode(a,b,c);
    }
    sortOnDistances(a: number[], b: number[]) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    }
    binarySearch(ar: any[], el: any, compare_fn: (arg0: any, arg1: any) => any) {
        var m = 0;
        var n = ar.length - 1;
        while (m <= n) {
            var k = (n + m) >> 1;
            var cmp = compare_fn(el, ar[k]);
            if (cmp > 0) {
                m = k + 1;
            } else if(cmp < 0) {
                n = k - 1;
            } else {
                return k;
            }
        }
        return -m - 1;
    }
    compareNumber(a: number, b: number) {
        return a - b;
    }

    
}
