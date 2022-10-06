"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var util = require('util');
var fs = require('fs');
var csv = require('csv-parser');
var Client = require("@googlemaps/google-maps-services-js").Client;
initialize();
// getDistanceMatrix();
writeToCSV();
var distanceMatrix = [[]];
function initialize() {
    return __awaiter(this, void 0, void 0, function () {
        var airports, i, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getColumn("IATA")];
                case 1:
                    airports = _a.sent();
                    /*
                    TESTING
                    */
                    // airports = airports.slice(0, 3);
                    /*
                    END TESTING
                    */
                    for (i = 0; i < airports.length + 1; i++) {
                        distanceMatrix[i] = [];
                    }
                    distanceMatrix[0][0] = "NONE";
                    for (i = 0; i < airports.length; i++) {
                        distanceMatrix[0][i + 1] = airports[i];
                        distanceMatrix[i + 1][0] = airports[i];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getColumn(columnToRetrieve) {
    return new Promise(function (resolve, reject) {
        var col = [];
        var read_stream = fs.createReadStream('./airportDistances.csv').pipe(csv());
        read_stream.on('data', function (data) { return col.push(data[columnToRetrieve]); });
        read_stream.on('error', function (e) {
            reject(e);
        });
        return read_stream.on('end', function () {
            resolve(col);
        });
    });
}
function getDistanceMatrix() {
    return __awaiter(this, void 0, void 0, function () {
        var airports, lat, lng, locations, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getColumn("IATA")];
                case 1:
                    airports = _a.sent();
                    return [4 /*yield*/, getColumn("LAT")];
                case 2:
                    lat = _a.sent();
                    return [4 /*yield*/, getColumn("LNG")];
                case 3:
                    lng = _a.sent();
                    locations = [];
                    /*
                    TESTING
                    */
                    // let airports:any = await getColumn("IATA");
                    // let lat:any = await getColumn("LAT");
                    // let lng:any = await getColumn("LNG");
                    // airports = airports.slice(0, 3);
                    // lat = lat.slice(0, 3);
                    // lng = lng.slice(0, 3);
                    /*
                    END TESTING
                    */
                    lat.forEach(function (l, index) {
                        var coords = { "lat": lat[index], "lng": lng[index] };
                        locations.push(coords);
                    });
                    _loop_1 = function (i) {
                        var lastIndexS, _loop_2, j;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    lastIndexS = i + 10 > locations.length ? locations.length : i + 10;
                                    _loop_2 = function (j) {
                                        var lastIndexE, client, originArray, destinationArray;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    lastIndexE = j + 10 > locations.length ? locations.length : j + 10;
                                                    client = new Client({});
                                                    originArray = locations.slice(i, lastIndexS);
                                                    destinationArray = locations.slice(j, lastIndexE);
                                                    // console.log("start and end: ", i, lastIndexS, j, lastIndexE);
                                                    // console.log("INPUTS!!!: ", originArray, destinationArray);
                                                    return [4 /*yield*/, client.distancematrix({
                                                            params: {
                                                                origins: originArray,
                                                                destinations: destinationArray,
                                                                mode: 'transit',
                                                                key: "AIzaSyDkza414g1-f7ry3P5mInUEJrFv9iDk1O0"
                                                            }
                                                        })
                                                            .then(function (r) {
                                                            var origins = r.data.origin_addresses;
                                                            for (var k = 0; k < origins.length; k++) {
                                                                var x = i + k + 1;
                                                                var results = r.data.rows[k].elements;
                                                                for (var l = 0; l < results.length; l++) {
                                                                    var y = j + l + 1;
                                                                    // console.log("x, y: " + x + ", " + y);
                                                                    var element = results[l];
                                                                    var duration = 100000000;
                                                                    if (element.status != 'ZERO_RESULTS') {
                                                                        duration = element.duration.value;
                                                                    }
                                                                    distanceMatrix[x][y] = duration;
                                                                }
                                                            }
                                                        })["catch"](function (e) {
                                                            console.log(e);
                                                        })["finally"](function () {
                                                            // console.log(util.inspect(distanceMatrix, { maxArrayLength: null }))
                                                        })];
                                                case 1:
                                                    // console.log("start and end: ", i, lastIndexS, j, lastIndexE);
                                                    // console.log("INPUTS!!!: ", originArray, destinationArray);
                                                    _c.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    j = 0;
                                    _b.label = 1;
                                case 1:
                                    if (!(j < locations.length)) return [3 /*break*/, 4];
                                    return [5 /*yield**/, _loop_2(j)];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    j += 10;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < locations.length)) return [3 /*break*/, 7];
                    return [5 /*yield**/, _loop_1(i)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i += 10;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function writeToCSV() {
    return __awaiter(this, void 0, void 0, function () {
        var data, output, lines, i, formatted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDistanceMatrix()];
                case 1:
                    _a.sent();
                    data = "";
                    output = "";
                    try {
                        data = fs.readFileSync('./airportDistances.csv', 'utf8');
                        // console.log(data);
                    }
                    catch (err) {
                        console.error(err);
                    }
                    lines = data.split("\n");
                    output = output + lines[0] + ",Transit\r\n";
                    // console.log(lines.length);
                    // lines.length - 1 because new line
                    for (i = 1; i < lines.length - 1; i++) {
                        formatted = formatArpt(distanceMatrix[i]);
                        output = output + lines[i] + "," + formatted + "\r\n";
                    }
                    console.log(output);
                    return [2 /*return*/];
            }
        });
    });
}
function formatArpt(row) {
    // console.log("row: ",row);
    for (var i = 1; i < row.length; i++) {
        if (row[i] == 0) {
            continue;
        }
        row[i] = row[i] * 1000000 + iataToDecimal(distanceMatrix[0][i]);
    }
    // get rid of IATA code
    row.splice(0, 1);
    // sort
    row.sort(function (a, b) { return a - b; });
    // get rid of self airport
    row.splice(0, 1);
    // console.log(row);
    return "\"" + row + "\"";
}
function iataToDecimal(iata) {
    return iata.charCodeAt(0) * 10000 + iata.charCodeAt(1) * 100 + iata.charCodeAt(2);
}
