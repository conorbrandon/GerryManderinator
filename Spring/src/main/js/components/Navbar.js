import React from "react";
import DropdownButton from "./DropdownButton";
import ReactDom from "react-dom";

import { ReactComponent as Az } from '../assets/Arizona.svg';
import { ReactComponent as Ga } from '../assets/Georgia.svg';
import { ReactComponent as Nv } from '../assets/Nevada.svg';
import { ReactComponent as Precinct } from "../assets/precinct.svg";
import { ReactComponent as District } from "../assets/district.svg";
import { ReactComponent as County } from "../assets/county.svg";
import { ReactComponent as Gavel } from "../assets/gavel.svg";
import { ReactComponent as WhiteHouse } from "../assets/whiteHouse.svg";
import { ReactComponent as HouseSeal } from "../assets/houseSeal.svg";
import { ReactComponent as SenateSeal } from "../assets/senateSeal.svg";
import { ReactComponent as GeorgiaSvg } from "../assets/georgiaEnactedSvg.svg";
import { ReactComponent as GeorgiaSvgGrayscale } from "../assets/georgiaEnactedSvgGrayscale.svg";
import { ReactComponent as CvapSvg } from "../assets/combinedUsPerson.svg";
import { ReactComponent as Checkmark } from "../assets/Checkmark.svg";
import { getPrecinctGeoJson, selectStateCallback2 } from "../Requests";

const Navbar = (props) => {

    const reset = {
        icon: <i className="material-icons md-light">refresh</i>,
        text: 'Reset',
        callback: () => {
            if (confirm("Are you sure you want to reset the map? WARNING: You may lose your current options and optimized Districting. Please Export To GeoJson to save your work.")) {
                window.location.reload(false);
            }
        },
        callbackParams: null
    }

    const exportToGeoJSON = {
        icon: <i className="material-icons md-light">open_in_browser</i>,
        text: 'Export To GeoJson',
        callback: () => {
            // console.log("Export to GeoJson called");
            const downloadDist = props.mostRecentDistricts && props.layersArray.includes('District');
            const downloadCo = props.currentCounties && props.layersArray.includes('County');
            const downloadPr = props.currentPrecincts && props.layersArray.includes('Precinct');
            let listIndex = 1;
            if (confirm(`Are you sure you want to download the following items: 
${downloadDist ? ' (' + listIndex++ + ') Districting ' : ''} ${downloadCo ? '(' + listIndex++ + ') Counties ' : ''} ${downloadPr ? '(' + listIndex++ + ') Precincts ' : ''}
you are currently viewing?`)) {
                let hiddenDownloadLink = document.getElementById('hidden-download-link');
                if (downloadDist) {
                    let downloadStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.mostRecentDistricts));
                    hiddenDownloadLink.setAttribute('download', 'districting.json');
                    hiddenDownloadLink.setAttribute('href', downloadStr);
                    hiddenDownloadLink.click();
                }
                if (downloadCo) {
                    let downloadStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.currentCounties));
                    hiddenDownloadLink.setAttribute('download', 'counties.json');
                    hiddenDownloadLink.setAttribute('href', downloadStr);
                    hiddenDownloadLink.click();
                }
                if (downloadPr) {
                    let downloadStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.currentCounties));
                    hiddenDownloadLink.setAttribute('download', 'precincts.json');
                    hiddenDownloadLink.setAttribute('href', downloadStr);
                    hiddenDownloadLink.click();
                }
                hiddenDownloadLink.setAttribute('download', '');
                hiddenDownloadLink.setAttribute('href', '');
            }

            // use this code if we want to open in a new window as well
            // const blob = new Blob([JSON.stringify(props.mostRecentDistricts)], {type: "application/json"});
            // let fileURL = URL.createObjectURL(blob);
            // open(fileURL);
        },
        callbackParams: null,
        download: true
    }
    const mainMenuItems = [reset, props.selectedState.index > -1 && (props.layersArray.includes('District') || props.layersArray.includes('Precinct') || props.layersArray.includes('County')) ? exportToGeoJSON : undefined];

    // layers
    const selectLayersCallback = (params) => {
        if (params === "Precinct" && !props.currentPrecincts) getPrecinctGeoJson(["AZ", "GA", "NV"][props.selectedState.index], props.setCurrentPrecincts);
        const index = props.layersArray.indexOf(params);
        if (index > -1) {
            props.layersArray.splice(index, 1);
        }
        else props.layersArray.push(params);
        props.setLayersArray(props.layersArray);
        // console.log(props.layersArray, props.isDistrictColorsShown);
        if (props.layersArray.indexOf('District') > props.layersArray.indexOf('Precinct')) props.setCurrentFillLayer('Dist');
        else if (props.layersArray.indexOf('Precinct') > props.layersArray.indexOf('District')) props.setCurrentFillLayer('Pr');
        else props.setCurrentFillLayer(null);
    };
    const showPrecincts = {
        icon: !props.layersArray.includes("Precinct") ? <Precinct className="state-icon" /> : <Checkmark className="state-icon" />,
        text: 'Show Precincts',
        callback: selectLayersCallback,
        callbackParams: "Precinct"
    }

    const showCounties = {
        icon: !props.layersArray.includes("County") ? <County className="state-icon" /> : <Checkmark className="state-icon" />,
        text: 'Show Counties',
        callback: selectLayersCallback,
        callbackParams: "County"
    }

    const showDistricts = {
        icon: !props.layersArray.includes("District") ? <District className="state-icon" /> : <Checkmark className="state-icon" />,
        text: 'Show Districts',
        callback: selectLayersCallback,
        callbackParams: "District"
    }
    const mapViewItems = [showDistricts, showCounties, showPrecincts];

    // elections
    const selectElectionCallback = (params) => {
        props.setElectionIndex(params);
    };
    const selectDistrictColorsShownCallback = (params) => {
        props.setDistrictColorsShown(params);
    };
    const showPre20 = {
        icon: props.electionIndex !== "PRE20" ? <WhiteHouse className="state-icon" /> : <Checkmark className="state-icon" />,
        text: "2020 Presidential",
        callback: selectElectionCallback,
        callbackParams: "PRE20"
    };

    const showHou20 = {
        icon: props.electionIndex !== "HOU20" ? <HouseSeal className="state-icon" /> : <Checkmark className="state-icon" />,
        text: "2020 House",
        callback: selectElectionCallback,
        callbackParams: "HOU20"
    };

    const showUss20 = {
        icon: props.electionIndex !== "USS20" ? <SenateSeal className="state-icon" /> : <Checkmark className="state-icon" />,
        text: "2020 US Senate",
        callback: selectElectionCallback,
        callbackParams: "USS20"
    };

    const showUss18 = {
        icon: props.electionIndex !== "USS18" ? <SenateSeal className="state-icon" /> : <Checkmark className="state-icon" />,
        text: "2018 US Senate",
        callback: selectElectionCallback,
        callbackParams: "USS18"
    };

    const showAtg18 = {
        icon: props.electionIndex !== "ATG18" ? <Gavel className="state-icon" /> : <Checkmark className="state-icon" />,
        text: "2018 Attorney General",
        callback: selectElectionCallback,
        callbackParams: "ATG18"
    };

    const useDistrictColors = {
        icon: props.isDistrictColorsShown ? <GeorgiaSvg className="state-icon" /> : <GeorgiaSvgGrayscale className="state-icon" />,
        text: (props.isDistrictColorsShown ? 'Disable' : 'Enable') + " District Colors",
        callback: selectDistrictColorsShownCallback,
        callbackParams: !props.isDistrictColorsShown
    };
    const electionViewItems = [showHou20, showPre20, showUss20, showUss18, showAtg18, useDistrictColors];

    // population items
    const selectPopulationCallback = (params) => {
        props.setPopulationIndex(params);
    };
    const useTotalPop = {
        icon: props.populationIndex !== "TOTAL_POP" ? <i className="material-icons md-light">supervisor_account</i> : <Checkmark className="state-icon" />,
        text: "Use Total Population",
        callback: selectPopulationCallback,
        callbackParams: "TOTAL_POP"
    };

    const useVap = {
        icon: props.populationIndex !== "VAP" ? <i className="material-icons md-light">person_add</i> : <Checkmark className="state-icon" />,
        text: "Use Voting Age Pop.",
        callback: selectPopulationCallback,
        callbackParams: "VAP"
    };

    const useCvap = {
        icon: props.populationIndex !== "CVAP" ? <CvapSvg className="state-icon" /> : <Checkmark className="state-icon" />,
        text: "Use Citizen Voting Age Pop.",
        callback: selectPopulationCallback,
        callbackParams: "CVAP"
    };
    const populationViewItems = [useTotalPop, useVap, useCvap];

    // state selectors
    const selectStateCallback = (params) => {
        props.setIsOptimized(false);
        props.setSelectedDistricting({ "index": -1, "Measures": {}, "Districts": {} });
        props.setOptimizedDistricting(null);
        props.setEnactedDistricting(null);
        props.setCurrentEnactedDistricts(null);
        props.setCurrentCandidateDistricts(null);
        props.setCurrentOptimizedDistricts(null);
        props.setTabIndex(0);
        props.setBoxVisible(false);
        // call props.selectedState in selectStateCallback2
        selectStateCallback2(params, props.setCandidateSvgs, props.setSelectedState,
            props.setCurrentCounties, props.setCurrentEnactedDistricts,
            props.setCurrentStateElections, props.setCurrentStateDemographics,
            props.setCurrentBoxWhiskerData, props.setAllDistrictingMeasuresForState,
            props.setEnactedDistricting, props.setMostRecentDistricts, props.setSomethingIsLoading,
            props.setSelectedCandidateMenuItem);
        // let js garbage collection do it's job and not store the current precincts when switching states
        props.setCurrentPrecincts(null);
        props.setLeftCollapsedOrExpanded('');
        let element = document.getElementsByClassName('left-sidebar')[0];
        if (element) ReactDom.findDOMNode(element).className = `left-sidebar`;
        props.setRightCollapsedOrExpanded('');
        element = document.getElementsByClassName('right-sidebar')[0];
        if (element) ReactDom.findDOMNode(element).className = `right-sidebar`;
        if (props.layersArray.includes('Precinct')) getPrecinctGeoJson(params, props.setCurrentPrecincts);
    };

    const azDropdownItemData = {
        icon: <Az className="state-icon" />,
        text: 'Arizona',
        callback: selectStateCallback,
        callbackParams: "AZ"
    };

    const gaDropdownItemData = {
        icon: <Ga className="state-icon" />,
        text: 'Georgia',
        callback: selectStateCallback,
        callbackParams: "GA"
    };

    const nvDropdownItemData = {
        icon: <Nv className="state-icon" />,
        text: 'Nevada',
        callback: selectStateCallback,
        callbackParams: "NV"
    };

    const stateSelectorItems = [azDropdownItemData, gaDropdownItemData, nvDropdownItemData];

    props.currentOpenDropdown ? console.log(props.currentOpenDropdown) : null;
    return (
        <nav className='navbar'>
            <div className="right-side-navbar-menus">
                <DropdownButton
                    buttonStyle={<i className="material-icons md-light">menu</i>}
                    items={mainMenuItems}
                    dropdownMenuClass={'main-menu'}
                    setCurrentOpenDropdown={props.setCurrentOpenDropdown}
                    currentOpenDropdown={props.currentOpenDropdown}
                    isOpen={props.currentOpenDropdown && props.currentOpenDropdown === 'main-menu'}
                />
                {props.selectedState.index !== -1 && <DropdownButton
                    buttonStyle={<i className="material-icons md-light">map</i>}
                    items={mapViewItems}
                    dropdownMenuClass={'map-view-menu'}
                    setCurrentOpenDropdown={props.setCurrentOpenDropdown}
                    currentOpenDropdown={props.currentOpenDropdown}
                    isOpen={props.currentOpenDropdown && props.currentOpenDropdown === 'map-view-menu'}
                />}
                <DropdownButton
                    buttonStyle={<i className="material-icons md-light">border_color</i>}
                    items={electionViewItems}
                    dropdownMenuClass={'election-view-menu'}
                    setCurrentOpenDropdown={props.setCurrentOpenDropdown}
                    currentOpenDropdown={props.currentOpenDropdown}
                    isOpen={props.currentOpenDropdown && props.currentOpenDropdown === 'election-view-menu'}
                />
                {props.selectedState.index !== -1 && <DropdownButton
                    buttonStyle={<i className="material-icons md-light">person</i>}
                    items={populationViewItems}
                    dropdownMenuClass={'populaion-view-menu'}
                    setCurrentOpenDropdown={props.setCurrentOpenDropdown}
                    currentOpenDropdown={props.currentOpenDropdown}
                    isOpen={props.currentOpenDropdown && props.currentOpenDropdown === 'populaion-view-menu'}
                />}
                <div
                    style={{ cursor: 'pointer', marginTop: '-2%' }}
                    onMouseOver={(e) => {
                        console.log("entering", e.clientX, e.clientY);
                        props.setTooltipOpen(true);
                        props.setTooltipText('Use these options to export layers to GeoJson; set map layers, election basis, and population basis. Some data may not be available for a state.');
                        props.setToolTipPosition([(e.clientX) + 'px', (e.clientY) + 'px']);
                    }}
                    onMouseLeave={() => {
                        console.log("leaving");
                        props.setTooltipOpen(false);
                        props.setTooltipText('');
                        props.setToolTipPosition(['-100vw', '-100vh']);
                    }}>
                    <i className="material-icons md-light">info</i>
                </div>
            </div>
            {!props.isSomethingIsLoading && <DropdownButton
                buttonStyle={'Select State'}
                items={stateSelectorItems}
                dropdownMenuClass={'state-select-menu'}
                setCurrentOpenDropdown={props.setCurrentOpenDropdown}
                currentOpenDropdown={props.currentOpenDropdown}
                isOpen={props.currentOpenDropdown && props.currentOpenDropdown === 'state-select-menu'}
            />}
        </nav>
    );
}

export default Navbar;