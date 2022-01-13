import React, { useState } from 'react';
import ReactDom from "react-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// commenting out below import lets us fully customize tabs
import 'react-tabs/style/react-tabs.css';
import TabCandidate from './TabCandidate';
import TabEnacted from './TabEnacted';
import TabOptimized from './TabOptimized';
import TabState from './TabState';
import Graph from "./Graph";
import { startAlgorithm } from "../Requests";
import BoxAndWhisker from './BoxAndWhisker';
import BoxAndWhiskerMenu from "./BoxAndWhiskerMenu";

const RightSideBar = (props) => {

    const { isRightCollapsedOrExpanded, setRightCollapsedOrExpanded, isBoxVisible, setBoxVisible } = props;
    const [graphData, setGraphData] = useState([]);
    const [isGraphVisible, setIsGraphVisible] = useState(false);
    const [isBoxWhiskerMenuVisible, setBoxWhiskerMenu] = useState(false);
    const [algorithmParameters, setAlgorithmParameters] = useState({});
    const [boxWhiskerBasis, setBoxWhiskerBasis] = useState("");
    const [whichDistrictingsOnPlot, setWhichDistrictingsOnPlot] = useState({});

    const handleOptimizeClick = (rawRequestObject) => {
        console.log('timeout: ' + rawRequestObject.timeout + '; eqPopThresh: ' + rawRequestObject.equality);
        const stateStrings = ['AZ', 'GA', 'NV'];
        const requestObject = {
            stateAbbr: stateStrings[props.index],
            candidateId: props.selectedDistricting.index,
            timeout: rawRequestObject.timeout * 1000, //Convert seconds to miliseconds 
            eqPopThresh: rawRequestObject.equality,
            popType: props.populationIndex
        };
        props.setAlgorithmRunning('running');
        startAlgorithm(requestObject, {
            setIsGraphVisible,
            setGraphData,
            setIsOptimized: props.setIsOptimized,
            setTabIndex: props.setTabIndex,
            index: props.index,
            setCurrentOptimizedDistricts: props.setCurrentOptimizedDistricts
        }, props.setCurrentInterval, props.currentInterval, 
        props.currentCandidateDistricts, props.setOptimizedDistricting, props.setSomethingIsLoading);
    };

    console.log({props});

    return (
        <div className={'right-sidebar' + (isRightCollapsedOrExpanded !== '' ? ' right-sidebar-' + isRightCollapsedOrExpanded : '')} onMouseEnter={() => props.setCurrentOpenDropdown(null)}>
            <Tabs selectedIndex={props.tabIndex} onSelect={index => {props.setTabIndex(index); /* props.setBoxVisible(false); */}}>
                <TabList>
                    <Tab>State</Tab>
                    <Tab>Enacted</Tab>
                    <Tab>Candidate</Tab>
                    <Tab>Optimized Cand.</Tab>
                    <div style={{ position: 'relative', zIndex: 0 }}>
                        <button className='right-sidebar-collapse-button1 button' onClick={() => {
                            let element = document.getElementsByClassName("right-sidebar")[0];
                            if (isRightCollapsedOrExpanded === '') {
                                setRightCollapsedOrExpanded('collapsed');
                                ReactDom.findDOMNode(element).className = `right-sidebar right-sidebar-collapsed` + (props.tabIndex > 0 ? ' not-state-tab' : '');
                            } else {
                                setRightCollapsedOrExpanded('');
                                ReactDom.findDOMNode(element).className = `right-sidebar` + (props.tabIndex > 0 ? ' not-state-tab' : '');
                            }
                        }}>
                            {(isRightCollapsedOrExpanded === '' || isRightCollapsedOrExpanded === 'expanded') && <i className="material-icons md-light">chevron_right</i>}
                            {isRightCollapsedOrExpanded === 'collapsed' && <i className="material-icons md-light">chevron_left</i>}
                        </button>
                        {isRightCollapsedOrExpanded === '' && <button className='right-sidebar-collapse-button2 button' onClick={() => {
                            setRightCollapsedOrExpanded('expanded');
                            let element = document.getElementsByClassName("right-sidebar")[0];
                            ReactDom.findDOMNode(element).className = `right-sidebar right-sidebar-expanded` + (props.tabIndex > 0 ? ' not-state-tab' : '');
                        }}>
                            <i className="material-icons md-light">chevron_left</i>
                        </button>}
                    </div>
                </TabList>
                {/** put react component inside each TabPanel */}
                <TabPanel>
                    <TabState index={props.index}
                        currentStateDemographics={props.currentStateDemographics}
                        currentStateElections={props.currentStateElections}
                        populationIndex={props.populationIndex}
                        electionIndex={props.electionIndex}
                    />
                    <div className='box-and-whisker-wrapper'>
                            <button className='box-and-whisker-tab' onClick={() => {
                                if (!isBoxVisible) setBoxWhiskerMenu(!isBoxWhiskerMenuVisible);
                                else setBoxVisible(!isBoxVisible)
                            }}>
                                {(isBoxVisible ? "Hide" : "Show") + " Box and Whisker"}
                                {isBoxWhiskerMenuVisible && <BoxAndWhiskerMenu
                                    setBoxVisible={setBoxVisible}
                                    isBoxVisible={isBoxVisible}
                                    electionIndex={props.electionIndex}
                                    setBoxWhiskerBasis={setBoxWhiskerBasis}
                                    currentBoxWhiskerData={props.currentBoxWhiskerData}
                                />}
                            </button>
                        <br />
                        <div className='tool-tip-wrapper'>
                            Plot Districting data points for:
                            <div
                                style={{ cursor: 'pointer' }}
                                onMouseOver={(e) => {
                                    console.log("entering", e.clientX, e.clientY);
                                    props.setTooltipOpen(true);
                                    props.setTooltipText('Display a box and whisker plot by each district for a given racial or election basis. The data is calculated from approximately 10,000 random districtings generated on a supercomputer.');
                                    props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY - 100) + 'px']);
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
                        <div onChange={(e) => {
                            let whichDistrictingsOnPlotCopy = {};
                            e.currentTarget.childNodes.forEach(node => {
                                console.log(node.checked, node.id);
                                if (node.nodeName === "INPUT" && node.checked) whichDistrictingsOnPlotCopy[node.id] = {};
                            });
                            setWhichDistrictingsOnPlot(whichDistrictingsOnPlotCopy);
                        }}>
                            <input type="checkbox" id="enacted" name="enacted" />
                            <label htmlFor="enacted">Enacted</label>&nbsp;&nbsp;&nbsp;
                            <input type="checkbox" id="candidate" name="candidate" disabled={props.currentCandidateDistricts ? false : true} />
                            <label htmlFor="candidate">Current Candidate</label>&nbsp;&nbsp;
                            <input type="checkbox" id="optimized" name="optimized" disabled={props.currentOptimizedDistricts ? false : true} />
                            <label htmlFor="optimized">Optimized</label>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <TabEnacted 
                        index={props.index}
                        districting={props.enactedDistricting}
                        electionIndex={props.electionIndex}
                        isRightCollapsedOrExpanded={isRightCollapsedOrExpanded}
                        setTooltipOpen={props.setTooltipOpen}
                        setTooltipText={props.setTooltipText}
                        setToolTipPosition={props.setToolTipPosition}
                        setFHover={props.setFHover}
                        populationIndex={props.populationIndex}
                        stateTotalPop={props.currentStateDemographics[props.populationIndex].populations.ALL} />
                </TabPanel>
                <TabPanel>
                    <TabCandidate
                        index={props.index}
                        districting={props.selectedDistricting}
                        setIsOptimized={props.setIsOptimized}
                        handleOptimizeClick={handleOptimizeClick}
                        setAlgorithmParameters={setAlgorithmParameters}
                        algorithmParameters={algorithmParameters}
                        electionIndex={props.electionIndex}
                        populationIndex={props.populationIndex}
                        isRightCollapsedOrExpanded={isRightCollapsedOrExpanded}
                        setTooltipOpen={props.setTooltipOpen}
                        setTooltipText={props.setTooltipText}
                        setToolTipPosition={props.setToolTipPosition}
                        isAlgorithmRunning={props.isAlgorithmRunning}
                        isGraphVisible={isGraphVisible}
                        setGraphData={setGraphData}
                        setFHover={props.setFHover}
                        stateTotalPop={props.currentStateDemographics[props.populationIndex].populations.ALL}
                    />
                </TabPanel>
                <TabPanel>
                    <TabOptimized
                        isOptimized={props.isOptimized}
                        districting={props.optimizedDistricting}
                        index={props.index}
                        electionIndex={props.electionIndex}
                        isRightCollapsedOrExpanded={isRightCollapsedOrExpanded}
                        setTooltipOpen={props.setTooltipOpen}
                        setTooltipText={props.setTooltipText}
                        setToolTipPosition={props.setToolTipPosition}
                        setFHover={props.setFHover}
                        populationIndex={props.populationIndex}
                        stateTotalPop={props.currentStateDemographics[props.populationIndex].populations.ALL} />
                </TabPanel>
            </Tabs>
            {isGraphVisible && <Graph 
            data={graphData} 
            isOptimized={props.isOptimized} 
            setIsGraphVisible={setIsGraphVisible}
            isAlgorithmRunning={props.isAlgorithmRunning}
            setAlgorithmRunning={props.setAlgorithmRunning}
            setIsOptimized={props.setIsOptimized}
            setCurrentInterval={props.setCurrentInterval}
            currentInterval={props.currentInterval}
            setGraphData={setGraphData}
            setTabIndex={props.setTabIndex}
            setCurrentOptimizedDistricts={props.setCurrentOptimizedDistricts}
            setOptimizedDistricting={props.setOptimizedDistricting}/>}

            {isBoxVisible && <BoxAndWhisker
                currentBoxWhiskerData={props.currentBoxWhiskerData}
                boxWhiskerBasis={boxWhiskerBasis}
                whichDistrictingsOnPlot={whichDistrictingsOnPlot}
                selectedDistricting={props.selectedDistricting}
                enactedDistricting={props.enactedDistricting}
                optimizedDistricting={props.optimizedDistricting}
                populationIndex={props.populationIndex}
                electionIndex={props.electionIndex}
                setBoxVisible={setBoxVisible} />}
        </div>
    );
}

export default RightSideBar;