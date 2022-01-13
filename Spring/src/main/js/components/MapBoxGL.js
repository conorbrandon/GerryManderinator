import ReactDom from "react-dom";
import HoverPopUp from './HoverPopUp';
import { selectStateCallback2 } from "../Requests";
// import SadFace from "../assets/sadFace.png";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { geoJsonDummy } from "../App";
const GeoJsonGeometriesLookup = require("geojson-geometries-lookup");
let glookup;

// const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
// const simulateMouseClick = (element) => {
//     mouseClickEvents.forEach(mouseEventType =>
//         element.dispatchEvent(
//             new MouseEvent(mouseEventType, {
//                 view: window,
//                 bubbles: true,
//                 cancelable: true,
//                 buttons: 1
//             })
//         )
//     );
// };
// function followPopUp(e) {
//     console.log(e);
//     if (!Object.keys(currentlyHoveringMapFeature).length) return;
//     let element = document.getElementsByClassName("hover-pop-up")[0];
//     element = ReactDom.findDOMNode(element);
//     let left = e.originalEvent.clientX + 14;
//     let top = e.originalEvent.clientY - 175;
//     if (top + 310 + 40 > window.innerHeight) {
//         // console.log("exceeded");
//         top = window.innerHeight - 350;
//     }
//     element.style.left = (left < 0 ? 0 : left) + 'px';
//     element.style.top = (top < 0 ? 0 : top) + 'px';
// }

const MapboxGLMap = (props) => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);
    const oldProps = useRef(props);
    const [currentlyHoveringMapFeature, setCurrentlyHoveringMapFeature] = useState({});

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
        selectStateCallback2(params,
            props.setCandidateSvgs, props.setSelectedState, props.setCurrentCounties,
            props.setCurrentEnactedDistricts, props.setCurrentStateElections, props.setCurrentStateDemographics,
            props.setCurrentBoxWhiskerData, props.setAllDistrictingMeasuresForState,
            props.setEnactedDistricting, props.setMostRecentDistricts, props.setSomethingIsLoading);
        // the other selectStateCallback in Navbar has extra code below this.
        // not needed here, as this is only called on the initial map view of USA.
    };

    const { lat, lng, zoom, index } = props.selectedState;
    const { layersArray, electionIndex,
        isDistrictColorsShown, selectedState,
        currentFillLayer, mostRecentDistricts,
        isLeftCollapsedOrExpanded, isRightCollapsedOrExpanded
    } = props;

    const DistFill = {
        'id': 'DistFill',
        'type': 'fill',
        'source': 'Dist',
        'paint': {
            "fill-color": isDistrictColorsShown ? ['get', 'featureColor'] : (currentFillLayer === 'Dist' ? ['case', ["<", ["number", ["get", electionIndex + 'D']], ["number", ["get", electionIndex + 'R']]], "red", "blue"] : 'transparent'),
            "fill-outline-color": "black",
            "fill-opacity": [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                .65,
                0.35
            ]
        }
    };
    const DistLine = {
        'id': 'DistLine',
        'type': 'line',
        'source': 'Dist',
        'paint': { "line-width": 3 }
    };
    const PrFill = {
        'id': 'PrFill',
        'type': 'fill',
        'source': 'Pr',
        'paint': {
            "fill-color": !isDistrictColorsShown ? ['case', ["<", ["number", ["get", electionIndex + 'D']], ["number", ["get", electionIndex + 'R']]], "red", "blue"] : 'transparent',
            "fill-outline-color": "black",
            "fill-opacity": [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                .65,
                0.35
            ]
        }
    };
    const PrLine = {
        'id': 'PrLine',
        'type': 'line',
        'source': 'Pr',
        'paint': { "line-width": 1 }
    };
    const CoLine = {
        'id': 'CoLine',
        'type': 'line',
        'source': 'stateCounties',
        'paint': { "line-width": 2, "line-color": 'white' }
    };

    let fHover = null;
    if (props.fHover && map.getSource("Dist")) {
        map.getSource("Dist")._data.features.forEach(feature => {
            if (props.fHover.id + '' === feature.properties.District && props.fHover.action === 'enter') {
                // console.log("found it");
                map.setFeatureState({
                    source: 'Dist',
                    id: feature.properties.District
                }, {
                    hover: true
                });
            }
            else {
                // console.log("not found it");
                map.setFeatureState({
                    source: 'Dist',
                    id: feature.properties.District
                }, {
                    hover: false
                });
            }
        });
    }
    let currentPopup = null;
    let currentPopupName = null;
    const mouseClickListener = (e) => {
        // console.log(e);
        if (!currentPopup) {
            const features = map.queryRenderedFeatures(e.point);
            // console.log(features);
            let targetFeature;
            for (const i in features) {
                const feature = features[i];
                if (feature.source === currentFillLayer) {
                    targetFeature = feature;
                    break;
                }
            }

            let electionIndexD;
            let electionIndexR;
            let electionIndexNameD = props.electionIndex + "Dem.";
            let electionIndexNameR = props.electionIndex + "Rep.";
            if (props.electionIndex === "PRE20") {
                electionIndexD = "PRE20" + "D";
                electionIndexR = "PRE20" + "R";
            } else if (props.electionIndex === "HOU20") {
                electionIndexD = "HOU20" + "D";
                electionIndexR = "HOU20" + "R";
            } else if (props.electionIndex === "USS20") {
                electionIndexD = "USS20" + "D";
                electionIndexR = "USS20" + "R";
            } else if (props.electionIndex === "USS18") {
                electionIndexD = "USS18" + "D";
                electionIndexR = "USS18" + "R";
            } else if (props.electionIndex === "ATG18") {
                electionIndexD = "ATG18" + "D";
                electionIndexR = "ATG18" + "R";
            }
            const { properties } = targetFeature;
            let currentlyHoveringMapFeatureRaw = {
                "Total Population": properties["TOTAL_POP"],
                "White": properties["TOTAL_ONE_WHITE"],
                "Black or African American": properties["TOTAL_ONE_BLACK"],
                "Native American or Indian": properties["TOTAL_ONE_INDIAN"],
                "Asian": properties["TOTAL_ONE_ASIAN"],
                "Pacific Islander or Hawaiian": properties["TOTAL_ONE_PACIFIC"],
                "Other": properties["TOTAL_ONE_OTHER"],
                "Two or more races": properties["TOTAL_MIXED"],
                "Hispanic": properties["TOTAL_HISPANIC"],
                "Voting Age Population": properties["VAP_TOTAL_POP"],
                "Citizen Voting Age Population": Math.round(properties["CVAP_TOTAL_POP"]),
                "Name": properties["PCTNUM"] || properties["District"],
                // these properties are not in the popup table
                "County": properties["COUNTY"],
                "District": glookup.getContainers({
                    type: "Point",
                    coordinates: [
                        e.lngLat.lng,
                        e.lngLat.lat
                    ],
                }).features[0].properties.District
            };
            currentlyHoveringMapFeatureRaw[electionIndexNameD] = properties[electionIndexD];
            currentlyHoveringMapFeatureRaw[electionIndexNameR] = properties[electionIndexR];
            setCurrentlyHoveringMapFeature(currentlyHoveringMapFeatureRaw);
            const placeholder = document.createElement('div');
            placeholder.style.backgroundColor = "var(--bg)";
            placeholder.style.padding = '0';
            ReactDom.render(<HoverPopUp
                currentlyHoveringMapFeature={currentlyHoveringMapFeatureRaw}
                layersArray={layersArray}
                electionIndex={electionIndex}
            />, placeholder);
            const xOffsetPosition = e.point.x < (window.innerWidth / 2) - 75 ? 170 : -170;
            currentPopup = new mapboxgl.Popup({ anchor: 'bottom', closeOnClick: false, closeButton: false, offset: [xOffsetPosition, -100] })
                .setLngLat(e.lngLat)
                .setDOMContent(placeholder)
                .setMaxWidth('260')
                .addClassName('hover-pop-up-mapbox')
                .addTo(map);
            currentPopupName = currentlyHoveringMapFeatureRaw.Name;
            if (properties["District"]) {
                // const element = document.querySelector('#react-tabs-' + (2 * currentMainDistrictingTab));
                // console.log({element}, '#react-tabs-' + (2 * currentMainDistrictingTab))
                // simulateMouseClick(element);
                const scrollDistrict = document.querySelector("#district-measures-" + properties["District"]);
                if (scrollDistrict) scrollDistrict.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        }
    };

    const mouseMoveListener = (e) => {
        let features = map.queryRenderedFeatures(e.point);
        let feature;
        for (const i in features) {
            const feature2 = features[i];
            if (feature2.source === currentFillLayer) {
                feature = feature2;
                break;
            }
        }
        if (feature) {
            if (fHover) {
                map.setFeatureState({
                    source: currentFillLayer,
                    id: fHover.id
                }, {
                    hover: false
                });
            }
            fHover = feature;
            if (currentPopup && !(currentPopupName === fHover.id)) {
                // console.log("closing current popup");
                currentPopup.remove();
                currentPopup = null;
                currentPopupName = null;
                setCurrentlyHoveringMapFeature({});
            }
            map.setFeatureState({
                source: currentFillLayer,
                id: fHover.id
            }, {
                hover: true
            });
        } else {
            if (!fHover) return;
            map.setFeatureState({
                source: currentFillLayer,
                id: fHover.id
            }, {
                hover: false
            });
            fHover = null;
            // console.log("moved off feature hover");
        }
        if (currentPopup) {
            currentPopup.setLngLat(e.lngLat);
            const xOffsetPosition = e.point.x < (window.innerWidth / 2) - 75 ? 170 : -170;
            // const hoverPopUp = document.querySelector(".hover-pop-up").getBoundingClientRect();
            let yOffsetPosition = -100;
            // if (hoverPopUp.bottom > window.innerHeight) {
            //     yOffsetPosition -= parseInt(hoverPopUp.bottom) - window.innerHeight + 1;
            // }
            // console.log(window.innerHeight, document.querySelector(".hover-pop-up").getBoundingClientRect(), yOffsetPosition);
            currentPopup.setOffset([xOffsetPosition, yOffsetPosition]);
        }
    };

    const mouseOutListener = (e) => {
        // console.log(fHover);
        if (!fHover) return;
        map.setFeatureState({
            source: currentFillLayer,
            id: fHover.id
        }, {
            hover: false
        });
        fHover = null;
        // console.log("moved off feature hover");
        if (currentPopup) {
            // console.log("closing current popup");
            currentPopup.remove();
            currentPopup = null;
            currentPopupName = null;
            setCurrentlyHoveringMapFeature({});
        }
    };
    const refMouseClickListener = useRef(mouseClickListener);
    const refMouseMoveListener = useRef(mouseMoveListener);
    const refMouseOutListener = useRef(mouseOutListener);

    const endMovingMapListener = (e) => {
        const currentLng = map.getCenter().lng;
        const currentLat = map.getCenter().lat;
        const currentZoom = map.getZoom();
        // console.log(lng.toFixed(2), currentLng.toFixed(2), lat.toFixed(2), currentLat.toFixed(2), currentZoom.toFixed(2), zoom.toFixed(2));
        // console.log(lng.toFixed(2) !== currentLng.toFixed(2) || lat.toFixed(2) !== currentLat.toFixed(2) || currentZoom.toFixed(2) !== zoom.toFixed(2));
        props.setHasMapMoved(lng.toFixed(2) !== currentLng.toFixed(2) || lat.toFixed(2) !== currentLat.toFixed(2) || currentZoom.toFixed(2) !== zoom.toFixed(2));
    };
    const refEndMapMovingListener = useRef(endMovingMapListener);

    let tabChangeNoRemoveEnactedDashed = false;
    let leftSidebarWentFromCollapsedToNormal = false;
    let rightSidebarWentFromCollapsedToNormal = false;
    let addListeners = false;
    let selectedStateChanged = false;

    useEffect(() => {
        const logDifferentProps = () => {
            console.log("The changed props were:");
            for (const key in props) {
                if (typeof props[key] === 'function') continue;
                else if (typeof props[key] === 'object' && (JSON.stringify(props[key]) !== JSON.stringify(oldProps.current[key]))) {
                    console.log(key, "new", JSON.stringify(props[key]), "old", JSON.stringify(oldProps.current[key]));
                } else if (props[key] !== oldProps.current[key]) {
                    console.log(key, "new", props[key], "old", oldProps.current[key]);
                }
            }
        };
        // if (JSON.stringify(props) !== JSON.stringify(oldProps.current)) logDifferentProps();

        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/cutedifference/cktxkqnde03fm17qhhzi80cjj", // stylesheet location
                center: [lng, lat],
                zoom: zoom,
                flyToOptions: {
                    speed: 1.5
                },
                maxBounds: new mapboxgl.LngLatBounds([-129.5, 24.75], [-63.5, 52])
            });

            map.on("load", () => {
                setMap(map);
                map.resize();
                const paintObject = {
                    "fill-color": isDistrictColorsShown ? ['get', 'featureColor'] : ['case', ["<", ["number", ["get", electionIndex + 'D']], ["number", ["get", electionIndex + 'R']]], "red", "blue"],
                    "fill-outline-color": "black",
                    "fill-opacity": .5
                };
                map.addSource('AZDist', {
                    'type': 'geojson',
                    'data': geoJsonDummy["AZ"].Dist,
                    'promoteId': 'District'
                });
                map.addLayer({
                    'id': 'AZDistFill',
                    'type': 'fill',
                    'source': 'AZDist',
                    'paint': paintObject
                });

                map.addSource('GADist', {
                    'type': 'geojson',
                    'data': geoJsonDummy["GA"].Dist,
                    'promoteId': 'District'
                });
                map.addLayer({
                    'id': 'GADistFill',
                    'type': 'fill',
                    'source': 'GADist',
                    'paint': paintObject
                });

                map.addSource('NVDist', {
                    'type': 'geojson',
                    'data': geoJsonDummy["NV"].Dist,
                    'promoteId': 'District'
                });
                map.addLayer({
                    'id': 'NVDistFill',
                    'type': 'fill',
                    'source': 'NVDist',
                    'paint': paintObject
                });

                map.once('click', (e) => {
                    const features = map.queryRenderedFeatures(e.point);
                    // console.log(features);
                    if (index === -1) {
                        for (let f = 0; f < features.length; f++) {
                            const feature = features[f];
                            if (feature.source.match(/AZ/)) {
                                selectStateCallback("AZ");
                            }
                            if (feature.source.match(/GA/)) {
                                selectStateCallback("GA");
                            }
                            if (feature.source.match(/NV/)) {
                                selectStateCallback("NV");
                            }
                        }
                    }
                });
                map.on('mousemove', (e) => props.setCurrentOpenDropdown(null));
                // have to set these refs so the functions above are updated with current state variables
                refMouseClickListener.current = mouseClickListener;
                refMouseMoveListener.current = mouseMoveListener;
                refMouseOutListener.current = mouseOutListener;
                refEndMapMovingListener.current = endMovingMapListener;

                // let canvas = document.createElement('canvas');
                // let context = canvas.getContext('2d');
                // let myImage = new Image(860, 755);
                // myImage.src = SadFace;
                // canvas.width = myImage.width;
                // canvas.height = myImage.height;
                // context.drawImage(myImage, 0, 0);
                // var myData = context.getImageData(0, 0, myImage.width, myImage.height);
                // console.log(myData, map.listImages().includes('sad-face'));
                // map.addImage('sad-face', myData, { sdf: true });
            });
        };
        // console.log({ lat, lng, zoom, index, layersArray, electionIndex, isDistrictColorsShown, selectedState });

        const compareProps = (oldProps, newProps) => {
            if (oldProps.currentFillLayer !== newProps.currentFillLayer || (oldProps.selectedState.index === -1 && newProps.selectedState.index > -1)) {
                map.off('click', oldProps.currentFillLayer + 'Fill', refMouseClickListener.current);
                map.off('mousemove', oldProps.currentFillLayer + 'Fill', refMouseMoveListener.current);
                map.off('mouseout', oldProps.currentFillLayer + 'Fill', refMouseOutListener.current);
                addListeners = true;
                console.log("removing listeners on", oldProps.currentFillLayer);
                refMouseClickListener.current = mouseClickListener;
                refMouseMoveListener.current = mouseMoveListener;
                refMouseOutListener.current = mouseOutListener;
            }
            if ((oldProps.isDistrictColorsShown !== newProps.isDistrictColorsShown)
                || (oldProps.currentFillLayer !== newProps.currentFillLayer
                    && newProps.currentFillLayer && !isDistrictColorsShown)
                || (oldProps.electionIndex !== newProps.electionIndex
                    && !isDistrictColorsShown)
            ) {
                // NUKE THE MAP!!!
                if (map.getLayer('DistFill')) map.removeLayer('DistFill');
                if (map.getLayer('DistLine')) map.removeLayer('DistLine');
                if (map.getLayer('PrFill')) map.removeLayer('PrFill');
                if (map.getLayer('PrLine')) map.removeLayer('PrLine');
            }
            if (oldProps.selectedState.index !== newProps.selectedState.index) {
                map.off('boxzoomend', refEndMapMovingListener.current);
                map.off('zoomend', refEndMapMovingListener.current);
                map.off('dragend', refEndMapMovingListener.current);
                selectedStateChanged = true;
                // console.log("removing listeners for map moving");
                refEndMapMovingListener.current = endMovingMapListener;
            }
        };
        compareProps(oldProps.current, props);
        // set oldProps to new props at bottom

        if (!map) {
            initializeMap({ setMap, mapContainer });
        } else if (map) {
            if ((index === 0 || index === 1 || index === 2)) {
                if (map.getSource('AZDist')) {
                    map.removeLayer('AZDistFill');
                    map.removeSource('AZDist');
                    map.removeLayer('GADistFill');
                    map.removeSource('GADist');
                    map.removeLayer('NVDistFill');
                    map.removeSource('NVDist');
                }

                // let currentMainDistrictingTab;
                const addDistrictLayer = () => {
                    let currentMainDistricting;
                    if (props.tabIndex === 1) {
                        currentMainDistricting = props.currentEnactedDistricts;
                        props.setMostRecentDistricts(currentMainDistricting);
                        // currentMainDistrictingTab = 1;
                    } else if (props.tabIndex === 2) {
                        currentMainDistricting = props.currentCandidateDistricts;
                        props.setMostRecentDistricts(currentMainDistricting);
                        // currentMainDistrictingTab = 2;
                    } else if (props.tabIndex === 3) {
                        currentMainDistricting = props.currentOptimizedDistricts;
                        props.setMostRecentDistricts(currentMainDistricting);
                        // currentMainDistrictingTab = 3;
                    } else {
                        currentMainDistricting = mostRecentDistricts;
                        // currentMainDistrictingTab = 1;
                    }
                    // compare current districting on map to the one we want to display
                    // if they are the same, don't remove it, and the logic after this block
                    // will check that it exists already and not add it again.
                    if (JSON.stringify(currentMainDistricting) !== JSON.stringify((map.getSource('Dist') || {})._data)) {
                        if (map.getLayer('DistFill')) map.removeLayer('DistFill');
                        if (map.getLayer('DistLine')) map.removeLayer('DistLine');
                        if (map.getSource('Dist')) map.removeSource('Dist');
                    }
                    if (layersArray.includes("District")) {
                        console.log("adding district layer");
                        if (!map.getSource('Dist') && currentMainDistricting) map.addSource('Dist', {
                            'type': 'geojson',
                            'data': currentMainDistricting,
                            'promoteId': 'District'
                        });
                        if (currentFillLayer === 'Dist' && map.getSource('Dist')) {
                            if (!map.getLayer('DistFill')) {
                                map.addLayer(DistFill, map.getSource('Pr') ? 'PrFill' : map.getSource('stateCounties') ? 'CoLine' : '');
                            }
                            if (!map.getLayer('DistLine')) {
                                map.addLayer(DistLine, map.getSource('Pr') ? 'PrFill' : map.getSource('stateCounties') ? 'CoLine' : '');
                            }
                            // this is the best place to do this, actually
                            if (layersArray.includes('Precinct') && !map.getLayer('PrLine')) {
                                map.addLayer(PrLine, map.getSource('stateCounties') ? 'CoLine' : '');
                            }
                        }
                    } else if (!layersArray.includes("District") && map.getSource('Dist')) {
                        console.log("removing district layer");
                        if (map.getLayer('DistFill')) map.removeLayer('DistFill');
                        if (map.getLayer('DistLine')) map.removeLayer('DistLine');
                        map.removeSource('Dist');
                    }
                }

                const addPrecinctLayer = () => {
                    if (layersArray.includes("Precinct") && props.currentPrecincts) {
                        console.log("adding precinct layer");
                        if (!map.getSource('Pr')) map.addSource('Pr', {
                            'type': 'geojson',
                            'data': props.currentPrecincts,
                            'generateId': true
                        });
                        if (currentFillLayer === 'Pr') {
                            if (!map.getLayer('PrFill')) {
                                map.addLayer(PrFill, map.getSource('stateCounties') ? 'CoLine' : '');
                            }
                            if (!map.getLayer('PrLine')) {
                                map.addLayer(PrLine, map.getSource('stateCounties') ? 'CoLine' : '');
                            }
                            // this is the best place to do this, actually
                            if (layersArray.includes('District') && !map.getLayer('DistLine')) {
                                map.addLayer(DistLine, map.getSource('Pr') ? 'PrFill' : map.getSource('stateCounties') ? 'CoLine' : '');
                                if (isDistrictColorsShown && !map.getLayer('DistFill')) {
                                    map.addLayer(DistFill, map.getSource('Pr') ? 'PrFill' : map.getSource('stateCounties') ? 'CoLine' : '');
                                }
                            }
                        }
                    } else if (!layersArray.includes("Precinct") && map.getSource('Pr')) {
                        console.log("removing precinct layer");
                        if (map.getLayer('PrFill')) map.removeLayer('PrFill');
                        if (map.getLayer('PrLine')) map.removeLayer('PrLine');
                        map.removeSource('Pr');
                    }
                };
                const addCountyLayer = () => {
                    if (layersArray.includes("County") && !map.getSource('stateCounties') && props.currentCounties) {
                        console.log("adding county layer");
                        map.addSource('stateCounties', {
                            'type': 'geojson',
                            'data': props.currentCounties,
                            'promoteId': 'NAME'
                        });
                        map.addLayer(CoLine);
                    } else if (!layersArray.includes("County") && map.getSource('stateCounties')) {
                        console.log("removing county layer");
                        map.removeLayer('CoLine');
                        map.removeSource('stateCounties');
                    }
                }
                addDistrictLayer();
                addPrecinctLayer();
                addCountyLayer();
                if (layersArray.length !== 0) {
                    map.flyTo({
                        center: [
                            lng,
                            lat
                        ],
                        zoom: zoom,
                        essential: true // this animation is considered essential with respect to prefers-reduced-motion
                    });
                    if (map.getLayer('SadFace')) map.removeLayer('SadFace');
                    if (map.getSource('Sad')) map.removeSource('Sad');
                } else if (!map.getLayer('SadFace')) {
                    map.flyTo({
                        center: [
                            lng,
                            lat
                        ],
                        zoom: zoom,
                        essential: true // this animation is considered essential with respect to prefers-reduced-motion
                    });
                    map.addSource('Sad', {
                        "type": "geojson",
                        'data': {
                            'type': 'Feature',
                            'properties': {
                                'description': 'Explore for a bit, then add some layers when you\'re ready!',
                                // 'icon': 'sad-face'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [lng, lat]
                            }
                        }
                    });
                    map.addLayer({
                        'id': 'SadFace',
                        'type': 'symbol',
                        'source': 'Sad',
                        'layout': {
                            'text-field': ['get', 'description'],
                            'text-variable-anchor': ['bottom'],
                            'text-size': 30,
                            // 'icon-image': 'sad-face',
                            'icon-size': 1
                        }
                    });
                }

                if (currentFillLayer && addListeners) {
                    map.on('click', currentFillLayer + 'Fill', refMouseClickListener.current);
                    map.on('mousemove', currentFillLayer + 'Fill', refMouseMoveListener.current);
                    map.on('mouseout', currentFillLayer + 'Fill', refMouseOutListener.current);
                    console.log("adding listeners on", currentFillLayer);
                }
                if (selectedStateChanged) {
                    map.on('boxzoomend', refEndMapMovingListener.current);
                    map.on('zoomend', refEndMapMovingListener.current);
                    map.on('dragend', refEndMapMovingListener.current);
                }
            } else if (props.selectedState.index === -1) {
                // console.log("changed index -1");
                if (map.getSource('AZDist')) {
                    map.removeLayer('AZDistFill');
                    map.removeLayer('GADistFill');
                    map.removeLayer('NVDistFill');
                }
                const paintObject = {
                    "fill-color": isDistrictColorsShown ? ['get', 'featureColor'] : ['case', ["<", ["number", ["get", electionIndex + 'D']], ["number", ["get", electionIndex + 'R']]], "red", "blue"],
                    "fill-outline-color": "black",
                    "fill-opacity": .5
                };
                map.addLayer({
                    'id': 'AZDistFill',
                    'type': 'fill',
                    'source': 'AZDist',
                    'paint': paintObject
                });
                map.addLayer({
                    'id': 'GADistFill',
                    'type': 'fill',
                    'source': 'GADist',
                    'paint': paintObject
                });
                map.addLayer({
                    'id': 'NVDistFill',
                    'type': 'fill',
                    'source': 'NVDist',
                    'paint': paintObject
                });
            }
        }
        oldProps.current = props;
    }, [
        JSON.stringify(props.layersArray), JSON.stringify(selectedState),
        props.currentFillLayer, isDistrictColorsShown,
        electionIndex, props.currentCandidateDistricts,
        props.currentOptimizedDistricts, props.tabIndex,
        mostRecentDistricts, props.currentPrecincts
    ]);

    useEffect(() => {
        const compareProps = (oldProps, newProps) => {
            if ((oldProps.tabIndex === 2 && newProps.tabIndex === 3) || (oldProps.tabIndex === 3 && newProps.tabIndex === 2)) {
                tabChangeNoRemoveEnactedDashed = true;
            }
        };
        compareProps(oldProps.current, props);
        oldProps.current = props;
        if (map && !tabChangeNoRemoveEnactedDashed) {
            if (map.getLayer('DistLineTransparentEnacted')) map.removeLayer('DistLineTransparentEnacted');
            if (map.getSource('DistEnacted')) map.removeSource('DistEnacted');
            if (layersArray.includes('District')) {
                if (props.tabIndex === 2 || props.tabIndex === 3) {
                    if (!map.getSource('DistEnacted')) {
                        map.addSource('DistEnacted', {
                            'type': 'geojson',
                            'data': props.currentEnactedDistricts,
                            'generateId': true
                        });
                    }
                    if (!map.getLayer('DistLineTransparentEnacted')) {
                        map.addLayer({
                            'id': 'DistLineTransparentEnacted',
                            'type': 'line',
                            'source': 'DistEnacted',
                            'paint': {
                                "line-width": 3,
                                "line-dasharray": [2, 3],
                                "line-color": "black",
                                "line-opacity": props.currentEnactedDistrictsOpacity
                            }
                        });
                    }
                }
            }
        }
    }, [props.currentEnactedDistrictsOpacity, props.tabIndex, JSON.stringify(props.layersArray)]);

    useEffect(() => {
        props.currentEnactedDistricts ? glookup = new GeoJsonGeometriesLookup(props.currentEnactedDistricts) : null;
    }, [props.currentEnactedDistricts]);

    useEffect(() => {
        if (map && !props.isSomethingIsLoading) {
            map.flyTo({
                center: [
                    lng,
                    lat
                ],
                zoom: zoom,
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
            // console.log("done flying");
            props.setHasMapMoved(false);
        }
    }, [props.isSomethingIsLoading]);

    useEffect(() => {
        const compareProps = (oldProps, newProps) => {
            if (oldProps.isLeftCollapsedOrExpanded === 'collapsed' && newProps.isLeftCollapsedOrExpanded === '') {
                leftSidebarWentFromCollapsedToNormal = true;
            }
        };
        compareProps(oldProps.current, props);
        oldProps.current = props;
        if (map && isLeftCollapsedOrExpanded === 'expanded') {
            map.flyTo({
                center: [
                    map.getCenter().lng.toFixed(2) === lng.toFixed(2) ? map.getCenter().lng - 3 : map.getCenter().lng,
                    map.getCenter().lat
                ],
                zoom: map.getZoom() === zoom ? map.getZoom() - .5 : map.getZoom(),
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        }
        if (map && isLeftCollapsedOrExpanded === '' && !leftSidebarWentFromCollapsedToNormal) {
            map.flyTo({
                center: [
                    (map.getCenter().lng).toFixed(2) === (lng - 3).toFixed(2) ? lng : map.getCenter().lng,
                    map.getCenter().lat
                ],
                zoom: map.getZoom() === zoom - .5 ? map.getZoom() + .25 : map.getZoom(),
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        }
    }, [isLeftCollapsedOrExpanded]);
    useEffect(() => {
        const compareProps = (oldProps, newProps) => {
            if (oldProps.isRightCollapsedOrExpanded === 'collapsed' && newProps.isRightCollapsedOrExpanded === '') {
                rightSidebarWentFromCollapsedToNormal = true;
            }
        };
        compareProps(oldProps.current, props);
        oldProps.current = props;
        if (map && isRightCollapsedOrExpanded === 'expanded') {
            map.flyTo({
                center: [
                    map.getCenter().lng.toFixed(2) === lng.toFixed(2) ? map.getCenter().lng + 1.65 : map.getCenter().lng,
                    map.getCenter().lat
                ],
                zoom: map.getZoom() === zoom ? map.getZoom() - .25 : map.getZoom(),
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        }
        if (map && isRightCollapsedOrExpanded === '' && !rightSidebarWentFromCollapsedToNormal) {
            map.flyTo({
                center: [
                    map.getCenter().lng.toFixed(2) === (lng + 1.65).toFixed(2) ? lng : map.getCenter().lng,
                    map.getCenter().lat
                ],
                zoom: map.getZoom() === zoom - .25 ? map.getZoom() + .25 : map.getZoom(),
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        }
    }, [isRightCollapsedOrExpanded]);

    useEffect(() => {
        console.log("firing", props.hasMapMoved);
    }, [props.hasMapMoved]);

    return (<div>
        <div className="map" ref={el => (mapContainer.current = el)} style={{ width: "100vw", height: "100vh", position: "absolute", cursor: "default" }} />
        {props.hasMapMoved && <div className='reset-map-button'>
            <button onClick={() => {
                if (map) {
                    map.flyTo({
                        center: [
                            lng,
                            lat
                        ],
                        zoom: zoom,
                        essential: true // this animation is considered essential with respect to prefers-reduced-motion
                    });
                    // console.log("done flying");
                    props.setHasMapMoved(false);
                }
            }}>
                Recenter Map<i className="material-icons md-light material-icons-align">restore</i>
            </button>
        </div>}
    </div>);
};

export default MapboxGLMap;