import React, { useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";

import FilterMenu from './FilterMenu';
import { getCandidateDistricting } from "../Requests";
import { electionMap } from "../App";

const LeftSideBar = (props) => {

    const { selectedCandidateMenuItem, setSelectedCandidateMenuItem, isLeftCollapsedOrExpanded, setLeftCollapsedOrExpanded } = props;
    const [filterMenu, toggleFilterMenu] = useState(false);

    const handleCandidateClick = (index) => {
        props.setTabIndex(2);
        props.setIsOptimized(false);
        props.setShowHoverSvgPopup(false);
        props.setBoxVisible(false);
        getCandidateDistricting(["AZ", "GA", "NV"][props.index], index,
            props.setCurrentCandidateDistricts, props.setSomethingIsLoading,
            props.setSelectedDistricting,
            {
                "index": index,
                "Measures": props.allDistrictingMeasuresForState[index],
                "Districts": {}
            }
        );
        setSelectedCandidateMenuItem(index);
        setLeftCollapsedOrExpanded('');
        let element = document.getElementsByClassName('left-sidebar')[0];
        ReactDom.findDOMNode(element).className = `left-sidebar`;
    };
    const handleSvgHover = (index, show, e) => {
        if (isLeftCollapsedOrExpanded === 'expanded') return;
        props.setShowHoverSvgPopup(show);
        if (!show) return;
        props.setHoverSvgPopupData({ Districting: index, ...props.allDistrictingMeasuresForState[index] });
        let element;
        if (show && (element = document.getElementsByClassName("svg-hover-popup")[0])) {
            ReactDom.findDOMNode(element).style.left = document.getElementsByClassName('left-sidebar')[0].getBoundingClientRect().width + 'px';//(e.clientX + 20) + 'px';
            let top = (e.clientY - 50);
            // console.log(top, window.innerHeight);
            if (top + 300 > window.innerHeight) top -= 300;
            ReactDom.findDOMNode(element).style.top = top + 'px';
        }
    };
    const handleSvgHoverMove = (e) => {
        let element = document.getElementsByClassName("svg-hover-popup")[0];
        if (element) {
            ReactDom.findDOMNode(element).style.left = document.getElementsByClassName('left-sidebar')[0].getBoundingClientRect().width + 'px';//(e.clientX + 20) + 'px';
            let top = (e.clientY - 50);
            if (top + 350 > window.innerHeight) top -= top + 350 - window.innerHeight;
            ReactDom.findDOMNode(element).style.top = top + 'px';
        }
    };
    const createAMeasuresTable = (data) => {
        return <div className={'svg-measures-detail'}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            Objective Function
                        </td>
                        <td>
                            {(data.OBJ_FUNC || 0).toFixed(2)}%
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Equal Population Variance
                        </td>
                        <td>
                            {data.EQUAL_POPULATION_VARIANCE.toFixed(2)}%
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Number of Opportunity Districts
                        </td>
                        <td>
                            {data.NUM_OPPORTUNITY_DISTRICTS}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Polsby - Popper Compactness Score
                        </td>
                        <td>
                            {data.POLSBY_POPPER.toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Graph Theoretical Compactness
                        </td>
                        <td>
                            {data.GRAPH_COMPACTNESS.toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Efficiency Gap {electionMap[props.electionIndex]}
                        </td>
                        <td>
                            {data.EFFICIENCY_GAP[props.electionIndex] ? data.EFFICIENCY_GAP[props.electionIndex].toFixed(2) + '%' : 'n/a'}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Efficiency Gap {electionMap[props.electionIndex]} Favors
                        </td>
                        <td>
                            {data.EFFICIENCY_GAP_FAVORS[props.electionIndex]}
                        </td>
                    </tr>
                    {/* <tr>
                        <td>
                            Split Counties Score
                        </td>
                        <td>
                            {data.SPLIT_COUNTIES_SCORE.toFixed(2)}
                        </td>
                    </tr> */}
                    <tr>
                        <td>
                            Deviation From Enacted Area
                        </td>
                        <td>
                            {(data.DEVIATION_FROM_ENACTED_AREA * 100).toFixed(2)}%
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>;
    };
    const createSvgsTable = (candidateSvgs) => {
        let component = [];
        for (let s = 0; s < candidateSvgs.length; s += 2) {
            const svg = candidateSvgs[s].img;
            const svg2 = candidateSvgs[s + 1].img;
            const index1 = candidateSvgs[s].index;
            const index2 = candidateSvgs[s + 1].index;
            component.push(
                <tr key={'' + Math.random()}>
                    <td onScroll={() => setShowHoverSvgPopup(false)}>
                        <div key={index1} className={'candidates-menu-item' + (isLeftCollapsedOrExpanded === 'expanded' ? ' expanded' : '') + (index1 === selectedCandidateMenuItem ? ' selected' : '')}
                            id={'candidate-svg-div-' + (index1)}
                            onClick={() => handleCandidateClick(index1)}
                            onMouseEnter={(e) => handleSvgHover(index1, true, e)}
                            onMouseLeave={(e) => handleSvgHover(index1, false, e)}
                            onMouseMove={(e) => handleSvgHoverMove(e)} >
                            <img className='candidate-svgs' src={`data:image/png;base64,${svg}`}></img>
                            #{index1}
                        </div>
                        {isLeftCollapsedOrExpanded === 'expanded' && createAMeasuresTable({ Districting: index1, ...props.allDistrictingMeasuresForState[index1] })}
                    </td>
                    <td onScroll={() => setShowHoverSvgPopup(false)}>
                        <div key={index2} className={'candidates-menu-item' + (isLeftCollapsedOrExpanded === 'expanded' ? ' expanded' : '') + (index2 === selectedCandidateMenuItem ? ' selected' : '')}
                            id={'candidate-svg-div-' + (index2)}
                            onClick={() => handleCandidateClick(index2)}
                            onMouseEnter={(e) => handleSvgHover(index2, true, e)}
                            onMouseLeave={(e) => handleSvgHover(index2, false, e)}
                            onMouseMove={(e) => handleSvgHoverMove(e)} >
                            <img className='candidate-svgs' src={`data:image/png;base64,${svg2}`}></img>
                            #{index2}
                        </div>
                        {isLeftCollapsedOrExpanded === 'expanded' && createAMeasuresTable({ Districting: index2, ...props.allDistrictingMeasuresForState[index2] })}
                    </td>
                </tr>
            );
        }
        return component;
    };
    useEffect(() => { }), [props.candidateSvgs, props.selectedCandidateMenuItem, props.isLeftCollapsedOrExpanded];
    return (<div className='left-sidebar' onMouseEnter={() => { props.setCurrentOpenDropdown(null); toggleFilterMenu(false); }}>
        <div className='candidates-header'>
            <h1 className='candidates-header-title'>Candidate Redistrictings</h1>
            <div className='candidates-header-filter'>
                <button className='candidates-header-filter-button button' onClick={() => { toggleFilterMenu(!filterMenu) }}>
                    <i className="material-icons md-light">sort</i>
                    {filterMenu && <FilterMenu
                        electionIndex={props.electionIndex}
                        toggleFilterMenu={toggleFilterMenu}
                        setTooltipOpen={props.setTooltipOpen}
                        setTooltipText={props.setTooltipText}
                        setToolTipPosition={props.setToolTipPosition}
                        candidateSvgs={props.candidateSvgs}
                        setCandidateSvgs={props.setCandidateSvgs}
                        allDistrictingMeasuresForState={props.allDistrictingMeasuresForState}
                        setAllDistrictingMeasuresForState={props.setAllDistrictingMeasuresForState} />}
                </button>
                <div style={{ zIndex: 0 }}>
                    <button className='left-sidebar-collapse-button1 button' onClick={() => {
                        let element = document.getElementsByClassName("left-sidebar")[0];
                        if (isLeftCollapsedOrExpanded === '') {
                            setLeftCollapsedOrExpanded('collapsed');
                            ReactDom.findDOMNode(element).className = `left-sidebar left-sidebar-collapsed`;
                        } else {
                            setLeftCollapsedOrExpanded('');
                            ReactDom.findDOMNode(element).className = `left-sidebar`;
                        }
                    }}>
                        {(isLeftCollapsedOrExpanded === '' || isLeftCollapsedOrExpanded === 'expanded') && <i className="material-icons md-light">chevron_left</i>}
                        {isLeftCollapsedOrExpanded === 'collapsed' && <i className="material-icons md-light">chevron_right</i>}
                    </button>
                    {isLeftCollapsedOrExpanded === '' && <button className='left-sidebar-collapse-button2 button' onClick={() => {
                        setLeftCollapsedOrExpanded('expanded');
                        let element = document.getElementsByClassName("left-sidebar")[0];
                        ReactDom.findDOMNode(element).className = `left-sidebar left-sidebar-expanded`;
                    }}>
                        <i className="material-icons md-light">chevron_right</i>
                    </button>}
                </div>
            </div>
        </div>
        <div className={'candidates-menu'} onMouseEnter={() => toggleFilterMenu(false)}>
            <table style={{ width: '100%' }}>
                <tbody>
                    {createSvgsTable(props.candidateSvgs, isLeftCollapsedOrExpanded === 'expanded')}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default LeftSideBar;