import React, { useState } from 'react';
import ReactDom from "react-dom";
import LeftSideBar from './components/LeftSideBar';
import RightSideBar from './components/RightSideBar';
import Navbar from './components/Navbar';
import MapboxGLMap from './components/MapBoxGL';
import Legend from './components/Legend';
import Tooltip from "./components/Tooltip";
import SvgPopUp from './components/SvgPopUp';
import EnactedDistrictingOpacitySlider from './components/EnactedDistrictingOpacitySlider';
import loading from "./assets/loading.gif";

import ArizonaDistGeoJson from "./assets/az-districts.json";
import GeorgiaDistGeoJson from "./assets/ga-districts.json";
import NevadaDistGeoJson from "./assets/nv-districts.json";
const geoJsonDummy = {
    "AZ": {
        "Dist": ArizonaDistGeoJson
    },
    "GA": {
        "Dist": GeorgiaDistGeoJson
    },
    "NV": {
        "Dist": NevadaDistGeoJson
    }
};

const electionMap = {
    "PRE20": "2020 Presidential",
    "HOU20": "2020 House",
    "USS20": "2020 US Senate",
    "USS18": "2018 US Senate",
    "ATG18": "2018 Attorney General",
};
const populationMap = { 'TOTAL_POP': 'Total Population', 'VAP': 'Voting Age Population', 'CVAP': 'Citizen Voting Age Population' };

function numberWithCommas(x) {
    if (x === undefined) return "n/a";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const App = () => {

    // -1 is no state, 0 is AZ, 1 GA, 2 NV
    const [selectedState, setSelectedState] = useState({ lat: 39.5, lng: -95.712891, zoom: 3.9, index: -1 });   // currently selected state
    // measures and district statistics, not geojson
    const [selectedDistricting, setSelectedDistricting] = useState({ "index": -1, "Measures": {}, "Districts": {} }) // index of selected districting
    const [enactedDistricting, setEnactedDistricting] = useState({ "index": 0, "Measures": {}, "Districts": {} });
    const [optimizedDistricting, setOptimizedDistricting] = useState({ "index": 31, "Measures": {}, "Districts": {} });
    // if the optimized districting has finished
    const [isOptimized, setIsOptimized] = useState(false);
    const [isAlgorithmRunning, setAlgorithmRunning] = useState('');
    const [currentInterval, setCurrentInterval] = useState(null);
    // which tab in right sidebar is currently active
    const [tabIndex, setTabIndex] = useState(0);
    // election basis used
    const [electionIndex, setElectionIndex] = useState("HOU20");
    // which population basis is being used
    const [populationIndex, setPopulationIndex] = useState("TOTAL_POP");
    // whether to show district colors or election info on districts/precincts
    const [isDistrictColorsShown, setDistrictColorsShown] = useState(true);
    // which layers are being shown on the map
    const [layersArray, setLayersArray] = useState(["District"]);
    // which dropdown in the navbar is currently active
    const [currentOpenDropdown, setCurrentOpenDropdown] = useState(null);
    // when clicking on a state, the array of candidate svgs shown in the left sidebar
    const [candidateSvgs, setCandidateSvgs] = useState([]);
    // the enacted, candidate, and optimized districting currently shown on the map
    const [currentEnactedDistricts, setCurrentEnactedDistricts] = useState(null);
    const [currentOptimizedDistricts, setCurrentOptimizedDistricts] = useState(null);
    const [currentCandidateDistricts, setCurrentCandidateDistricts] = useState(null);
    const [mostRecentDistricts, setMostRecentDistricts] = useState(null);
    // when the current tab is not enacted, show the enacted districting at a certain opacity
    const [currentEnactedDistrictsOpacity, setCurrentEnactedDistrictsOpacity] = useState(0.5);
    // current precincts and counties for a state
    const [currentPrecincts, setCurrentPrecincts] = useState(null);
    const [currentCounties, setCurrentCounties] = useState(null);
    // which layer is currently the fill layer on the map
    const [currentFillLayer, setCurrentFillLayer] = useState('Dist');
    // demographics, election information, and box whisker data for a state (for TabState)
    const [currentStateDemographics, setCurrentStateDemographics] = useState({});
    const [currentStateElections, setCurrentStateElections] = useState({});
    const [currentBoxWhiskerData, setCurrentBoxWhiskerData] = useState({});
    // boolean for showing the svg hover popup
    const [showHoverSvgPopup, setShowHoverSvgPopup] = useState(false);
    // which districting's stats are currently in the popup
    const [hoverSvgPopupData, setHoverSvgPopupData] = useState({});
    // all the measures for the set of districtings for the currently selected state
    const [allDistrictingMeasuresForState, setAllDistrictingMeasuresForState] = useState([]);
    // some left and right sidebar props
    const [selectedCandidateMenuItem, setSelectedCandidateMenuItem] = useState(-1);
    const [isLeftCollapsedOrExpanded, setLeftCollapsedOrExpanded] = useState('');
    const [isRightCollapsedOrExpanded, setRightCollapsedOrExpanded] = useState('');
    const [isSomethingIsLoading, setSomethingIsLoading] = useState(false);
    // tooltips
    const [isTooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipText, setTooltipText] = useState('');
    const [toolTipPosition, setToolTipPosition] = useState(['-100vw', '-100vh']);
    // feature hover on map
    const [fHover, setFHover] = useState(null);
    // if the map has moved since the initial load or the user selcted a state
    const [hasMapMoved, setHasMapMoved] = useState(false);
    // is box and whisker visible
    const [isBoxVisible, setBoxVisible] = useState(false);

    let appTitle = 'GerryManderinator';
    if (selectedState.index !== -1) appTitle = selectedState.longName;
    return (
        <div className="app">
            <div className='app-title'><h1>{appTitle}</h1></div>
            <Navbar
                setSelectedState={setSelectedState}
                selectedState={selectedState}

                setSelectedDistricting={setSelectedDistricting}
                selectedDistricting={selectedDistricting}
                setIsOptimized={setIsOptimized}

                setElectionIndex={setElectionIndex}
                electionIndex={electionIndex}

                setPopulationIndex={setPopulationIndex}
                populationIndex={populationIndex}

                isDistrictColorsShown={isDistrictColorsShown}
                setDistrictColorsShown={setDistrictColorsShown}

                setLayersArray={setLayersArray}
                layersArray={layersArray}

                setCurrentOpenDropdown={setCurrentOpenDropdown}
                currentOpenDropdown={currentOpenDropdown}

                setCandidateSvgs={setCandidateSvgs}
                setSelectedState={setSelectedState}

                setCurrentFillLayer={setCurrentFillLayer}
                setCurrentEnactedDistricts={setCurrentEnactedDistricts}
                setCurrentCandidateDistricts={setCurrentCandidateDistricts}
                setCurrentPrecincts={setCurrentPrecincts}
                setCurrentCounties={setCurrentCounties}
                setMostRecentDistricts={setMostRecentDistricts}
                currentPrecincts={currentPrecincts}
                currentCounties={currentCounties}
                mostRecentDistricts={mostRecentDistricts}

                setEnactedDistricting={setEnactedDistricting}
                setOptimizedDistricting={setOptimizedDistricting}
                setCurrentOptimizedDistricts={setCurrentOptimizedDistricts}

                setCurrentStateDemographics={setCurrentStateDemographics}
                setCurrentStateElections={setCurrentStateElections}
                setCurrentBoxWhiskerData={setCurrentBoxWhiskerData}

                setAllDistrictingMeasuresForState={setAllDistrictingMeasuresForState}

                setTabIndex={setTabIndex}
                setSelectedCandidateMenuItem={setSelectedCandidateMenuItem}
                setSomethingIsLoading={setSomethingIsLoading}
                isSomethingIsLoading={isSomethingIsLoading}
                setLeftCollapsedOrExpanded={setLeftCollapsedOrExpanded}
                setRightCollapsedOrExpanded={setRightCollapsedOrExpanded}

                setTooltipOpen={setTooltipOpen}
                setTooltipText={setTooltipText}
                setToolTipPosition={setToolTipPosition}
                
                setBoxVisible={setBoxVisible}
            />
            <div className='main'>
                {selectedState.index > -1 && <LeftSideBar // only display when looking at a state, not the whole map
                    index={selectedState.index}
                    setSelectedDistricting={setSelectedDistricting}
                    selectedDistricting={selectedDistricting}

                    setIsOptimized={setIsOptimized}
                    electionIndex={electionIndex}

                    setTabIndex={setTabIndex}
                    candidateSvgs={candidateSvgs}
                    setCurrentOpenDropdown={setCurrentOpenDropdown}
                    setCurrentCandidateDistricts={setCurrentCandidateDistricts}
                    setCurrentOptimizedDistricts={setCurrentOptimizedDistricts}

                    setShowHoverSvgPopup={setShowHoverSvgPopup}
                    setHoverSvgPopupData={setHoverSvgPopupData}
                    allDistrictingMeasuresForState={allDistrictingMeasuresForState}
                    setAllDistrictingMeasuresForState={setAllDistrictingMeasuresForState}

                    setCurrentEnactedDistrictsOpacity={setCurrentEnactedDistrictsOpacity}
                    selectedCandidateMenuItem={selectedCandidateMenuItem}
                    setSelectedCandidateMenuItem={setSelectedCandidateMenuItem}

                    isLeftCollapsedOrExpanded={isLeftCollapsedOrExpanded}
                    setLeftCollapsedOrExpanded={setLeftCollapsedOrExpanded}
                    isSomethingIsLoading={isSomethingIsLoading}
                    setSomethingIsLoading={setSomethingIsLoading}

                    setTooltipOpen={setTooltipOpen}
                    setTooltipText={setTooltipText}
                    setToolTipPosition={setToolTipPosition}

                    candidateSvgs={candidateSvgs}
                    setCandidateSvgs={setCandidateSvgs}
                    
                    setBoxVisible={setBoxVisible} />
                }
                {selectedState.index > -1 && <RightSideBar
                    index={selectedState.index}
                    selectedDistricting={selectedDistricting}
                    enactedDistricting={enactedDistricting}
                    optimizedDistricting={optimizedDistricting}

                    isOptimized={isOptimized}
                    setIsOptimized={setIsOptimized}

                    tabIndex={tabIndex}
                    setTabIndex={setTabIndex}

                    populationIndex={populationIndex}
                    electionIndex={electionIndex}

                    currentStateElections={currentStateElections}
                    currentStateDemographics={currentStateDemographics}
                    currentBoxWhiskerData={currentBoxWhiskerData}
                    currentCandidateDistricts={currentCandidateDistricts}
                    currentOptimizedDistricts={currentOptimizedDistricts}

                    setCurrentOpenDropdown={setCurrentOpenDropdown}

                    hoverSvgPopupData={hoverSvgPopupData}

                    setCurrentEnactedDistrictsOpacity={setCurrentEnactedDistrictsOpacity}
                    setCurrentOptimizedDistricts={setCurrentOptimizedDistricts}
                    setOptimizedDistricting={setOptimizedDistricting}

                    isRightCollapsedOrExpanded={isRightCollapsedOrExpanded}
                    setRightCollapsedOrExpanded={setRightCollapsedOrExpanded}

                    setTooltipOpen={setTooltipOpen}
                    setTooltipText={setTooltipText}
                    setToolTipPosition={setToolTipPosition}
                    isAlgorithmRunning={isAlgorithmRunning}
                    setAlgorithmRunning={setAlgorithmRunning}
                    isOptimized={isOptimized}
                    setCurrentInterval={setCurrentInterval}
                    currentInterval={currentInterval}

                    setFHover={setFHover}
                    isBoxVisible={isBoxVisible}
                    setBoxVisible={setBoxVisible}
                    setSomethingIsLoading={setSomethingIsLoading} />
                }
                <MapboxGLMap
                    selectedState={selectedState}
                    electionIndex={electionIndex}

                    isDistrictColorsShown={isDistrictColorsShown}
                    layersArray={layersArray}

                    setSelectedState={setSelectedState}
                    setCandidateSvgs={setCandidateSvgs}

                    setSelectedState={setSelectedState}
                    setIsOptimized={setIsOptimized}

                    setSelectedDistricting={setSelectedDistricting}
                    selectedDistricting={selectedDistricting}
                    setOptimizedDistricting={setOptimizedDistricting}
                    setEnactedDistricting={setEnactedDistricting}

                    currentFillLayer={currentFillLayer}
                    currentCounties={currentCounties}
                    currentPrecincts={currentPrecincts}
                    setCurrentCounties={setCurrentCounties}
                    setCurrentPrecincts={setCurrentPrecincts}
                    setCurrentOpenDropdown={setCurrentOpenDropdown}

                    currentEnactedDistricts={currentEnactedDistricts}
                    currentCandidateDistricts={currentCandidateDistricts}
                    currentOptimizedDistricts={currentOptimizedDistricts}
                    setCurrentCandidateDistricts={setCurrentCandidateDistricts}
                    setCurrentOptimizedDistricts={setCurrentOptimizedDistricts}
                    setCurrentEnactedDistricts={setCurrentEnactedDistricts}
                    setMostRecentDistricts={setMostRecentDistricts}
                    mostRecentDistricts={mostRecentDistricts}

                    setCurrentStateDemographics={setCurrentStateDemographics}
                    setCurrentStateElections={setCurrentStateElections}
                    setCurrentBoxWhiskerData={setCurrentBoxWhiskerData}
                    setAllDistrictingMeasuresForState={setAllDistrictingMeasuresForState}
                    tabIndex={tabIndex}
                    setTabIndex={setTabIndex}

                    setCurrentEnactedDistrictsOpacity={setCurrentEnactedDistrictsOpacity}
                    currentEnactedDistrictsOpacity={currentEnactedDistrictsOpacity}

                    isLeftCollapsedOrExpanded={isLeftCollapsedOrExpanded}
                    isRightCollapsedOrExpanded={isRightCollapsedOrExpanded}
                    isSomethingIsLoading={isSomethingIsLoading}
                    setSomethingIsLoading={setSomethingIsLoading}

                    setFHover={setFHover}
                    fHover={fHover}
                    hasMapMoved={hasMapMoved}
                    setHasMapMoved={setHasMapMoved}

                    setBoxVisible={setBoxVisible}
                />
                <Legend />
                {showHoverSvgPopup && isLeftCollapsedOrExpanded === '' && <SvgPopUp
                    hoverSvgPopupData={hoverSvgPopupData} electionIndex={electionIndex}
                />}
                {(tabIndex === 2 || tabIndex === 3) && <EnactedDistrictingOpacitySlider
                    tabIndex={tabIndex}
                    setCurrentEnactedDistrictsOpacity={setCurrentEnactedDistrictsOpacity}
                    currentEnactedDistrictsOpacity={currentEnactedDistrictsOpacity}
                />}
            </div>
            <a id='hidden-download-link'></a>
            {isSomethingIsLoading === true && <div className='loading-indicator'>
                <img src={loading} alt="loading" />
            </div>}
            {isTooltipOpen && <Tooltip text={tooltipText} position={toolTipPosition} />}
        </div>
    );
}

export default App;
export {
    numberWithCommas,
    geoJsonDummy,
    electionMap,
    populationMap
};