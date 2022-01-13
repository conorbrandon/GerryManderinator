// import allData from './components/graphData';
import { geoJsonDummy } from './App';

const urlBase = "http://localhost:8080/";

const getUpdatedAlgorithmStatus = (requestObject, setAlgorithmStatus, setGraphData, currentInterval, setCurrentInterval, setCurrentOptimizedDistricts, setMostRecentDistricts, setOptimizedDistricting, setTabIndex, setIsOptimized) => {
    fetch(urlBase + "getUpdatedAlgorithmStatus/")
        .then(res => res.json())
        .then(json => {
            console.log("HEY");
            console.log(json);
            if (json.status == 'PAUSED') { 
                console.log("pausing inside getUpdatedAlgoStatus");
                clearInterval(currentInterval); 
                setCurrentInterval(null); 
            } else if (json.status === 'COMPLETED') {
                console.log("completed inside getUpdatedAlgoStatus");
                clearInterval(currentInterval);    // ideally would be currentInterval <-- why isn't it???
                setCurrentInterval(null); // added this, does it do anything?
                setIsOptimized(true);
                fetch(urlBase + "getFinalAlgorithmStatus/")
                    .then(res => res.json())
                    .then(json => {
                        console.log('final server json: ', json);
                        setAlgorithmStatus(json);
                        let graphData = [];
                        for (let i = 0; i < json.updatedPopulations.length; i++) {
                            graphData.push({
                                District: 'D' + (i + 1), Population: json.updatedPopulations[i],
                            });
                        }
                        console.log('done optimizing');
                        json.optimizedMap = JSON.parse(json.optimizedMap);
                        const stateDistrictColors = {
                            'AZ': ['', 'red', 'blue', 'green', 'orange', 'yellow', 'purple', 'darkgrey', 'aqua', 'black'],
                            'GA': ['', 'lime', 'purple', 'deeppink', 'red', 'mediumblue', 'greenyellow', 'black', 'yellow', 'orange', 'aqua', 'darkgrey', 'pink', 'teal', 'lightcoral'],
                            'NV': ['', 'blue', 'orange', 'red', 'green']
                        };
                        json.optimizedMap.features.forEach(feature => {
                            feature.properties.featureColor = stateDistrictColors[requestObject.stateAbbr][parseInt(feature.properties.District)];
                        });
                        setCurrentOptimizedDistricts(json.optimizedMap); //GEOJSON of districts
                        setMostRecentDistricts(json.optimizedMap);

                        let optimizedObj = {index: 31, Districts: {}, Measures: {}};
                        optimizedObj.Districts = JSON.parse(json.districtMeasures).Districts;
                        optimizedObj.Measures = json.measures.districtingMeasures;

                        let EFFICIENCY_GAP = json.measures.efficiencyGap;
                        delete json.measures.efficiencyGap;
                        let EFFICIENCY_GAP_FAVORS = {};
                        for (const key in EFFICIENCY_GAP) {
                            let theGap = EFFICIENCY_GAP[key];
                            if (theGap >= 1) {
                                EFFICIENCY_GAP[key] = theGap - 1;
                                EFFICIENCY_GAP_FAVORS[key] = 'tie';
                            } else if (theGap < 0) {
                                EFFICIENCY_GAP[key] = theGap * -1;
                                EFFICIENCY_GAP_FAVORS[key] = 'Dem.';
                            } else if (theGap > 0) {
                                EFFICIENCY_GAP[key] = theGap;
                                EFFICIENCY_GAP_FAVORS[key] = 'Rep.';
                            } else if (theGap === 0) {
                                EFFICIENCY_GAP[key] = null;
                                EFFICIENCY_GAP_FAVORS[key] = 'n/a';
                            }
                        }
                        optimizedObj.Measures.EFFICIENCY_GAP = EFFICIENCY_GAP;
                        optimizedObj.Measures.EFFICIENCY_GAP_FAVORS = EFFICIENCY_GAP_FAVORS;
                        optimizedObj.Measures["GRAPH_COMPACTNESS"] = null;
                        optimizedObj.Measures["POLITICAL_DEVIATION_FROM_ENACTED"] = null;
                        optimizedObj.Measures["RACIAL_DEVIATION_FROM_ENACTED"] = null;
                        optimizedObj.Measures.OBJ_FUNC = ( (1 - optimizedObj.Measures.EQUAL_POPULATION_VARIANCE) * .7) +
                        (optimizedObj.Measures.POLSBY_POPPER * .1) +
                        (optimizedObj.Measures.DEVIATION_FROM_ENACTED_AREA * .1) +
                        ( (1 - ( (optimizedObj.Measures.EFFICIENCY_GAP.HOU20 + optimizedObj.Measures.EFFICIENCY_GAP.PRE20) / 2) ) * .1);

                        json.optimizedMap.features.forEach(feature => {
                            const districtNum = feature.properties.District;
                            const {
                                    TOTAL_POP,
                                    TOTAL_ONE_WHITE,
                                    TOTAL_ONE_BLACK,
                                    TOTAL_ONE_INDIAN,
                                    TOTAL_ONE_ASIAN,
                                    TOTAL_ONE_PACIFIC,
                                    TOTAL_ONE_OTHER,
                                    TOTAL_HISPANIC,
                                    TOTAL_MIXED,
                                    CVAP_TOTAL_POP,
                                    CVAP_TOTAL_HISPANIC,
                                    CVAP_TOTAL_ONE_WHITE,
                                    CVAP_TOTAL_ONE_BLACK,
                                    CVAP_TOTAL_ONE_INDIAN,
                                    CVAP_TOTAL_ONE_ASIAN,
                                    CVAP_TOTAL_ONE_PACIFIC,
                                    VAP_TOTAL_POP,
                                    VAP_TOTAL_ONE_WHITE,
                                    VAP_TOTAL_ONE_BLACK,
                                    VAP_TOTAL_ONE_INDIAN,
                                    VAP_TOTAL_ONE_ASIAN,
                                    VAP_TOTAL_ONE_PACIFIC,
                                    VAP_TOTAL_ONE_OTHER,
                                    VAP_TOTAL_MIXED,
                                    VAP_TOTAL_HISPANIC,
                                    HOU20D,
                                    HOU20R,
                                    PRE20D,
                                    PRE20R,
                                    USS20D,
                                    USS20R,
                                    USS18D,
                                    USS18R,
                                    ATG18D,
                                    ATG18R,
                            } = feature.properties;
                            let fieldsToAdd = {
                                "districtNumber": districtNum,
                                "candidateId": 31,
                                "demographics": {
                                    "CVAP": {
                                        "populations": {
                                            "ALL": CVAP_TOTAL_POP,
                                            "NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER": CVAP_TOTAL_ONE_PACIFIC,
                                            "BLACK_OR_AFRICAN_AMERICAN": CVAP_TOTAL_ONE_BLACK,
                                            "HISPANIC": CVAP_TOTAL_HISPANIC,
                                            "ASIAN": CVAP_TOTAL_ONE_ASIAN,
                                            "WHITE": CVAP_TOTAL_ONE_WHITE,
                                            "AMERICAN_INDIAN_AND_ALASKA_NATIVE": CVAP_TOTAL_ONE_INDIAN
                                        }
                                    },
                                    "VAP": {
                                        "populations": {
                                            "ALL": VAP_TOTAL_POP,
                                            "NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER": VAP_TOTAL_ONE_PACIFIC,
                                            "SOME_OTHER_RACE": VAP_TOTAL_ONE_OTHER,
                                            "BLACK_OR_AFRICAN_AMERICAN": VAP_TOTAL_ONE_BLACK,
                                            "HISPANIC": VAP_TOTAL_HISPANIC,
                                            "ASIAN": VAP_TOTAL_ONE_ASIAN,
                                            "WHITE": VAP_TOTAL_ONE_WHITE,
                                            "TWO_OR_MORE_RACES": VAP_TOTAL_MIXED,
                                            "AMERICAN_INDIAN_AND_ALASKA_NATIVE": VAP_TOTAL_ONE_INDIAN
                                        }
                                    },
                                    "TOTAL_POP": {
                                        "populations": {
                                            "ALL": TOTAL_POP,
                                            "NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER": TOTAL_ONE_PACIFIC,
                                            "SOME_OTHER_RACE": TOTAL_ONE_OTHER,
                                            "BLACK_OR_AFRICAN_AMERICAN": TOTAL_ONE_BLACK,
                                            "HISPANIC": TOTAL_HISPANIC,
                                            "ASIAN": TOTAL_ONE_ASIAN,
                                            "WHITE": TOTAL_ONE_WHITE,
                                            "TWO_OR_MORE_RACES": TOTAL_MIXED,
                                            "AMERICAN_INDIAN_AND_ALASKA_NATIVE": TOTAL_ONE_INDIAN
                                        }
                                    }
                                },
                                "elections": {
                                    "HOU20": {
                                        "votes": {
                                            "DEMOCRATIC_PARTY": HOU20D > 0 ? HOU20D : null,
                                            "REPUBLICAN_PARTY": HOU20R > 0 ? HOU20R : null
                                        }
                                    },
                                    "USS20": {
                                        "votes": {
                                            "DEMOCRATIC_PARTY": USS20D > 0 ? USS20D : null,
                                            "REPUBLICAN_PARTY": USS20R > 0 ? USS20R : null
                                        }
                                    },
                                    "USS18": {
                                        "votes": {
                                            "DEMOCRATIC_PARTY": USS18D > 0 ? USS18D : null,
                                            "REPUBLICAN_PARTY": USS18R > 0 ? USS18R : null
                                        }
                                    },
                                    "ATG18": {
                                        "votes": {
                                            "DEMOCRATIC_PARTY": ATG18D > 0 ? ATG18D : null,
                                            "REPUBLICAN_PARTY": ATG18R > 0 ? ATG18R : null
                                        }
                                    },
                                    "PRE20": {
                                        "votes": {
                                            "DEMOCRATIC_PARTY": PRE20D > 0 ? PRE20D : null,
                                            "REPUBLICAN_PARTY": PRE20R > 0 ? PRE20R : null
                                        }
                                    }
                                },
                                "graphCompactness": null
                            };
                            console.log(optimizedObj.Districts);
                            optimizedObj.Districts[districtNum] = {...optimizedObj.Districts[districtNum], ...fieldsToAdd};
                        });

                        // console.log({optimizedObj});
                        setOptimizedDistricting(optimizedObj);
                        clearInterval(currentInterval);
                        setCurrentInterval(null);
                        setTabIndex(3);
                    });
            } else {
                setAlgorithmStatus(json);
                let graphData = [];
                for (let i = 0; i < json.updatedPopulations.length; i++) {
                    graphData.push({
                        District: 'D' + (i + 1), Population: json.updatedPopulations[i],
                    });
                }
                setGraphData(graphData);
            }
        });
}

const startAlgorithm = (requestObject, stateVariables, setCurrentInterval, currentInterval, currentCandidateDistricts, setOptimizedDistricting, setSomethingIsLoading, setMostRecentDistricts) => {
    setSomethingIsLoading(true);
    const { setIsGraphVisible, setGraphData, setAlgorithmStatus, setIsOptimized, index, setTabIndex, setCurrentOptimizedDistricts } = stateVariables;
    console.log(requestObject);
    const xhr = new XMLHttpRequest();
    const url = 'validateUserParams/' + encodeURIComponent(JSON.stringify(requestObject)); //{state:AZ,stateId:0,timeout:0,equality:0}';
    xhr.onload = function () {
        console.log("Response: " + xhr.response + '; status: ' + xhr.status);
        setSomethingIsLoading(false);
        if (xhr.status == 200) {
            setIsGraphVisible(true);
            setIsOptimized(false);

            // // Request to start server algorithm
            const xhrStart = new XMLHttpRequest();
            const startUrl = 'http://localhost:8080/startServerAlgorithm/'
            xhrStart.open("POST", startUrl, true);
            xhrStart.send();

            const interval = setInterval(() => {getUpdatedAlgorithmStatus(requestObject, setAlgorithmStatus, setGraphData, interval, setCurrentInterval, setCurrentOptimizedDistricts, setMostRecentDistricts, setOptimizedDistricting, setTabIndex, setIsOptimized)}, 5000);
            setCurrentInterval(interval); // this doesn't work, because currentInterval is copied to this function's scope 
            // console.log(interval, currentInterval);

            // initialize graph with current
            setGraphData(currentCandidateDistricts.features.map((feature, i) => {
                return {
                    District: 'D' + (i + 1), Population: feature.properties.TOTAL_POP
                };
            }));
        } else {
            alert('Invalid Options');
        }
    }
    xhr.open("POST", url, true);
    xhr.send();
};
const pauseAlgorithm = (paused, requestObject, setAlgorithmStatus, setAlgorithmRunning, setCurrentInterval, currentInterval, setGraphData, setIsOptimized, setTabIndex, setCurrentOptimizedDistricts, setMostRecentDistricts, setOptimizedDistricting) => {
    console.log("paused: " + paused);
    if (paused === "pause") {
        fetch(urlBase + "pauseAlgorithm")
            .then(res => res.text())
            .then(text => {
                console.log(text);
                setAlgorithmRunning("paused");
            });
    } else if (paused === "resume") {
        const xhrResume = new XMLHttpRequest();
            const resumeUrl = 'http://localhost:8080/resumeAlgorithm/'
            xhrResume.open("GET", resumeUrl, true);
            xhrResume.send();
        setAlgorithmRunning("running");
        const interval = setInterval(() => {getUpdatedAlgorithmStatus(requestObject, setAlgorithmStatus, setGraphData, interval, setCurrentInterval, setCurrentOptimizedDistricts, setMostRecentDistricts, setOptimizedDistricting, setTabIndex, setIsOptimized)}, 5000);
        setCurrentInterval(interval);

        // setTimeout(() => {
        //     const interval = setInterval(getUpdatedAlgorithmStatus(setAlgorithmStatus, setGraphData, currentInterval, setCurrentInterval, setCurrentOptimizedDistricts, setMostRecentDistricts, setOptimizedDistricting, setTabIndex), 5000);
        //     setCurrentInterval(interval);
        // }, 1000);

    }
    
    // fetch(urlBase + "pauseServerAlgorithm/" + paused)
    //     .then(res => res.json())
    //     .then(json => {
    //         console.log(json);
    //         setAlgorithmRunning(paused === "pause" ? 'paused' : 'running');
    //     });
    // // setAlgorithmRunning(paused === "pause" ? 'paused' : 'running'); // remove when endpoint works
    // if (paused === 'pause') {
    //     clearInterval(currentInterval);
    //     setCurrentInterval(null);
    // } else if (paused === 'resume') {
    //     // replace with code above to get currentDistrictPops every five seconds
    //     const interval = setInterval(function () {
    //         const randomData = getRandomDataForGraph(10);
    //         if (randomData.done) {
    //             setIsOptimized(true);
    //             setTabIndex(3);
    //             console.log('done optimizing');
    //             setCurrentOptimizedDistricts(null); //GeoJSON
    //             setOptimizedDistricting(null); //Look at select state
    //             clearInterval(interval);
    //             setCurrentInterval(null);
    //         } else {
    //             setGraphData(randomData.data);
    //         }
    //     }, 5000);
    //     setCurrentInterval(interval);
    // }
};
const stopAlgorithm = (setAlgorithmRunning, setCurrentInterval, currentInterval, setIsOptimized, setTabIndex, setCurrentOptimizedDistricts, setOptimizedDistricting) => {
    fetch(urlBase + "stopAlgorithm/")
        .then(res => res.text())
        .then(text => {
            console.log(text);
            setAlgorithmRunning('');
            // setIsOptimized(true);
        });
    // setAlgorithmRunning(''); // remove following when endpoint works
    // setIsOptimized(true);
    // setTabIndex(3);
    // setCurrentOptimizedDistricts(null);
    // setOptimizedDistricting(null);
    // clearInterval(currentInterval); 
    // setCurrentInterval(null);
    // TODO: repeat the logic above for setting the geojson and districting prop
};

// 2 requests. One for StateSelectionProj, one for candidateSVGs
const selectStateCallback2 = (abbr,
    setCandidateSvgs, setSelectedState, setCurrentCounties, setCurrentEnactedDistricts,
    setCurrentStateElections, setCurrentStateDemographics, setCurrentBoxWhiskerData,
    setAllDistrictingMeasuresForState, setEnactedDistricting,
    setMostRecentDistricts, setSomethingIsLoading, setSelectedCandidateMenuItem) => {
    const abbrMap = {
        "AZ": 0, "GA": 1, "NV": 2
    };
    setSomethingIsLoading(true);
    // stateSelectionProj 
    fetch(urlBase + "selectState/" + abbr)
        .then(res => res.json())
        .then(json1 => {
            console.log(json1);
            console.log(Buffer.byteLength(JSON.stringify(json1)));
            setCurrentCounties(JSON.parse(json1.countiesGeoJson));
            setCurrentEnactedDistricts(geoJsonDummy[abbr].Dist);   // enacted actually is stored in app, so this may not change
            setCurrentStateElections(json1.elections);
            setCurrentStateDemographics(json1.demographics);
            setCurrentBoxWhiskerData(JSON.parse(json1.boxWhiskerData));
            fetch(urlBase + `/getDistrictingMeasures/${abbr}`).then(res => res.json()).then(json2 => {
                function compare(a, b) {
                    if (a.candidateId < b.candidateId) {
                        return -1;
                    }
                    if (a.candidateId > b.candidateId) {
                        return 1;
                    }
                    return 0;
                }
                json2.sort(compare);
                console.log(json2);
                const averageSomeObjects = (listOfObjects) => {
                    let sum = 0;
                    let count = 0;
                    for (let i = 0; i < listOfObjects.length; i++) {
                        const obj = listOfObjects[i];
                        for (const key in obj) {
                            sum += obj[key];
                            count++;
                        }
                    }
                    return sum / count;
                };
                let districtingMeasureCopy = [];
                for (let i = 0; i < json2.length; i++) {
                    const dist = json2[i];
                    let theCopy = {};
                    theCopy.candidateID = dist.candidateId;
                    for (const key in dist.measures.districtingMeasures) {
                        theCopy[key] = dist.measures.districtingMeasures[key];
                    }
                    theCopy.POLITICAL_DEVIATION_FROM_ENACTED = averageSomeObjects([dist.measures.politicalDevFromEnactedD, dist.measures.politicalDevFromEnactedR]);
                    theCopy.RACIAL_DEVIATION_FROM_ENACTED = averageSomeObjects([dist.measures.racialDevFromEnacted]);
                    theCopy.EFFICIENCY_GAP = {};
                    theCopy.EFFICIENCY_GAP_FAVORS = {};
                    for (const key in dist.measures.efficiencyGap) {
                        let theGap = dist.measures.efficiencyGap[key];
                        if (theGap >= 1) {
                            theCopy.EFFICIENCY_GAP[key] = theGap - 1;
                            theCopy.EFFICIENCY_GAP_FAVORS[key] = 'tie';
                        } else if (theGap < 0) {
                            theCopy.EFFICIENCY_GAP[key] = theGap * -1;
                            theCopy.EFFICIENCY_GAP_FAVORS[key] = 'Dem.';
                        } else if (theGap > 0) {
                            theCopy.EFFICIENCY_GAP[key] = theGap;
                            theCopy.EFFICIENCY_GAP_FAVORS[key] = 'Rep.';
                        } else if (theGap === 0) {
                            theCopy.EFFICIENCY_GAP[key] = null;
                            theCopy.EFFICIENCY_GAP_FAVORS[key] = 'n/a';
                        }
                    }
                    districtingMeasureCopy.push(theCopy);
                }
                console.log(districtingMeasureCopy);
                setAllDistrictingMeasuresForState(districtingMeasureCopy);
                // get localhost/allDistrictStats for enacted
                fetch(urlBase + `/getDistrictStats/${abbr}/${0}`).then(res => res.json()).then(json3 => {
                    json3.sort((a, b) => {
                        if (a.districtNumber < b.districtNumber) return -1;
                        else return 1;
                    });
                    setEnactedDistricting({ "index": 0, "Measures": districtingMeasureCopy[0], "Districts": { ...json3 } });
                    console.log("in requests", { json3 });

                    setMostRecentDistricts(geoJsonDummy[abbr].Dist);
                    setSelectedState({ lat: json1.latitude, lng: json1.longitude, zoom: json1.mapZoom, index: abbrMap[abbr], longName: json1.longName });
                    setSomethingIsLoading(false);
                });
            });
        });

    fetch(urlBase + "getAllCandidateImgs/" + abbr)
        .then(res => res.json())
        .then(json => {
            // console.log({ candidateSvgs: json });
            let imgsCopy = [];
            for (let i = 0; i < json.length; i++) {
                const img = json[i];
                imgsCopy.push({ 'index': i + 1, 'img': img });
            }
            setCandidateSvgs(imgsCopy);
            if (setSelectedCandidateMenuItem) setSelectedCandidateMenuItem(-1);
        });
};

const getPrecinctGeoJson = (abbr, setCurrentPrecincts) => {
    fetch(urlBase + "getPrecinctsGeoJson/" + abbr)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setCurrentPrecincts(json);
        });
};

const getCandidateDistricting = (abbr, candidateID, setCurrentCandidateDistricts, setSomethingIsLoading, setSelectedDistricting, statsToSet) => {
    // console.log(urlBase + "getCandidateGeoJson/" + abbr + "/" + candidateID);
    setSomethingIsLoading(true);
    fetch(urlBase + "getCandidateGeoJson/" + abbr + "/" + candidateID)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setCurrentCandidateDistricts(json);
        });
    // get allDistrictStats for a districting
    fetch(urlBase + `/getDistrictStats/${abbr}/${candidateID}`).then(res => res.json()).then(json => {
        json.sort((a, b) => {
            if (a.districtNumber < b.districtNumber) return -1;
            else return 1;
        });
        statsToSet.Districts = { ...json };
        setSelectedDistricting(statsToSet);
        setSomethingIsLoading(false);
    });

};

export {
    startAlgorithm,
    selectStateCallback2,
    getPrecinctGeoJson,
    getCandidateDistricting,
    pauseAlgorithm,
    stopAlgorithm
};