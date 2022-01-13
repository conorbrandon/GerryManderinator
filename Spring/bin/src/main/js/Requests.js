// import allData from './components/graphData';
import { geoJsonDummy } from './App';

const urlBase = "http://localhost:8080/";

const getRandomDataForGraph = (numDistricts) => {
    if (Math.random() < .25) return { done: true };
    let data = [];
    for (let i = 1; i < numDistricts + 1; i++) {
        data.push({
            District: 'D' + i, Population: parseInt(700000 * Math.random()),
        });
    }
    // console.log({ randomData: data });
    return { data };
};

const startAlgorithm = (requestObject, stateVariables, setCurrentInterval, currentInterval, currentCandidateDistricts, setOptimizedDistricting, setSomethingIsLoading) => {
    setSomethingIsLoading(true);
    const { setIsGraphVisible, setGraphData, setIsOptimized, index, setTabIndex, setCurrentOptimizedDistricts } = stateVariables;
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
            const startUrl='http://localhost:8080/startServerAlgorithm/'
            xhrStart.open("POST", startUrl, true);
            xhrStart.send();
            // // Request to get updated information
            // setInterval(function() {
            //     const xhrUpdate = new XMLHttpRequest();
            //     const updateUrl='http://localhost:8080/getUpdatedAlgorithmStatus/'
            //     xhrUpdate.open("GET", updateUrl, true);
            //     xhrUpdate.send();
            //     xhrStart.onload = function() {
            //         // TODO // <- bar graph or display final information
            //     } 
            // }, 10000)
            const interval = setInterval(function () {
                const randomData = getRandomDataForGraph([9, 14, 4][index]);
                if (randomData.done) {
                    setIsOptimized(true);
                    setTabIndex(3);
                    console.log('done optimizing');
                    setCurrentOptimizedDistricts(null);
                    setOptimizedDistricting(null);
                    clearInterval(interval);    // ideally would be currentInterval
                    setCurrentInterval(null);
                } else {
                    setGraphData(randomData.data);
                }
            }, 5000);
            setCurrentInterval(interval); // this doesn't work, because currentInterval is copied to this function's scope
            // console.log(interval, currentInterval);

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
const pauseAlgorithm = (paused, setAlgorithmRunning, setCurrentInterval, currentInterval, setGraphData, setIsOptimized, setTabIndex, setCurrentOptimizedDistricts, setOptimizedDistricting) => {
    // fetch(urlBase + "pauseServerAlgorithm/" + paused)
    //     .then(res => res.json())
    //     .then(json => {
    //         console.log(json);
    //         setAlgorithmRunning(paused === "pause" ? 'paused' : 'running');
    //     });
    setAlgorithmRunning(paused === "pause" ? 'paused' : 'running'); // remove when endpoint works
    if (paused === 'pause') {
        clearInterval(currentInterval);
        setCurrentInterval(null);
    } else if (paused === 'resume') {
        // replace with code above to get currentDistrictPops every five seconds
        const interval = setInterval(function () {
            const randomData = getRandomDataForGraph(10);
            if (randomData.done) {
                setIsOptimized(true);
                setTabIndex(3);
                console.log('done optimizing');
                setCurrentOptimizedDistricts(null); //GeoJSON
                setOptimizedDistricting(null); //Look at select state
                clearInterval(interval);
                setCurrentInterval(null);
            } else {
                setGraphData(randomData.data);
            }
        }, 5000);
        setCurrentInterval(interval);
    }
};
const stopAlgorithm = (setAlgorithmRunning, setCurrentInterval, currentInterval, setIsOptimized, setTabIndex, setCurrentOptimizedDistricts, setOptimizedDistricting) => {
    // fetch(urlBase + "stopServerAlgorithm/")
    //     .then(res => res.json())
    //     .then(json => {
    //         console.log(json);
    //         setAlgorithmRunning('');
    //         setIsOptimized(true);
    //         setCurrentOptimizedDistricts(json);
    //     });
    setAlgorithmRunning(''); // remove following when endpoint works
    setIsOptimized(true);
    setTabIndex(3);
    setCurrentOptimizedDistricts(null);
    setOptimizedDistricting(null);
    clearInterval(currentInterval);  // replace with clearInterval
    setCurrentInterval(null);
    // TODO: add setOptimizedDistricting
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