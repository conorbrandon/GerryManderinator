import React from "react";

import { numberWithCommas, electionMap, populationMap } from "../App";

const TabData = (props, candidateTab = false) => {

    console.log({ props });
    let distDataRaw = props.districting.Districts;
    console.log({distDataRaw});
    let distData = [];
    for (const key in distDataRaw) {
        let OPPORTUNITY_DISTRICT_FOR = [];
        if ( (distDataRaw[key].demographics[props.populationIndex].populations.BLACK_OR_AFRICAN_AMERICAN / distDataRaw[key].demographics[props.populationIndex].populations.ALL) > .5) OPPORTUNITY_DISTRICT_FOR.push("Black or African American");
        if ( (distDataRaw[key].demographics[props.populationIndex].populations.AMERICAN_INDIAN_AND_ALASKA_NATIVE / distDataRaw[key].demographics[props.populationIndex].populations.ALL) > .5) OPPORTUNITY_DISTRICT_FOR.push("Native American or Indian");
        if ( (distDataRaw[key].demographics[props.populationIndex].populations.ASIAN / distDataRaw[key].demographics[props.populationIndex].populations.ALL) > .5) OPPORTUNITY_DISTRICT_FOR.push("Asian");
        if ( (distDataRaw[key].demographics[props.populationIndex].populations.HISPANIC / distDataRaw[key].demographics[props.populationIndex].populations.ALL) > .5) OPPORTUNITY_DISTRICT_FOR.push("Hispanic");
        if ( (distDataRaw[key].demographics[props.populationIndex].populations.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER / distDataRaw[key].demographics[props.populationIndex].populations.ALL) > .5) OPPORTUNITY_DISTRICT_FOR.push("Pacific Islander or Hawaiian");
        distDataRaw[key].OPPORTUNITY_DISTRICT_FOR = OPPORTUNITY_DISTRICT_FOR;
        distData.push(distDataRaw[key]);
    }
    // console.log({distData});

    const createMeasureTextStandalone = () => {
        return <div className="measure-text-standalone">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Objective Function
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText(`A function used to select districtings with weights on parameters that reflect a \'good\' districting. Objective Function values:
                                        ( (1 - EQUAL_POP_) * .7) + SEP_SMALL
                                        ( (1 - GTC) * .05) + (POL_POP * .05) + SEP_SMALL
                                        (DEV_ENACTED_AREA * .1) + SEP_SMALL
                                        ( (1 - ( (EFF_GAP_HOUSE20 + EFF_GAP_PRES20) / 2) ) * .1)`);
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{(props.districting.Measures.OBJ_FUNC || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Equal Population Variance
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The difference between the most populous and least populous district\'s population divided by the ideal district population for the state. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{(props.districting.Measures.EQUAL_POPULATION_VARIANCE * 100).toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Political Deviation From Enacted (average across elections)
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The mean sum of squares percentage difference between a district\'s election results and the enacted districting\'s district\'s election results. Lower means the change was small.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.POLITICAL_DEVIATION_FROM_ENACTED ? (props.districting.Measures.POLITICAL_DEVIATION_FROM_ENACTED * 100).toFixed(2) + '%' : 'n/a'}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Racial Deviation From Enacted (average across races)
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The mean sum of squares percentage difference between a district\'s demographic\'s and the enacted districting\'s district\'s demographic\'s. Lower means the change was small.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.RACIAL_DEVIATION_FROM_ENACTED ? (props.districting.Measures.RACIAL_DEVIATION_FROM_ENACTED * 100).toFixed(2) + '%' : 'n/a'}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Number of Opportunity Districts
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The number of districts where a minority group has greater than 50% population in the district.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.NUM_OPPORTUNITY_DISTRICTS}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Polsby Popper Compactness Score
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of compactness calculated by using the district\'s area and perimeter. Higher is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.POLSBY_POPPER.toFixed(2)}</td>
                    </tr>
                    {/* table mid point */}
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Graph Theoretical Compactness
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of compactness calculated by using the ratio of edge nodes to total nodes in a connected graph of precincts in a district. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.GRAPH_COMPACTNESS ? props.districting.Measures.GRAPH_COMPACTNESS.toFixed(2) : 'n/a'}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Efficiency Gap {electionMap[props.electionIndex]}
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of how many votes are being wasted in an election. Defined as lost votes (all votes for the losing party) and excess votes (votes above 50% for the winning party). Can indicate packing/cracking. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.EFFICIENCY_GAP[props.electionIndex] ? (props.districting.Measures.EFFICIENCY_GAP[props.electionIndex] * 100).toFixed(2) + '%' : 'n/a'}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Efficiency Gap {electionMap[props.electionIndex]} Favors
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The party that won the most districts in the state is the party that the efficiency gap \'favors\'.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.EFFICIENCY_GAP_FAVORS[props.electionIndex]}</td>
                    </tr>
                    {/* <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Split Counties Score
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of how/if counties are split between districts. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.SPLIT_COUNTIES_SCORE.toFixed(2)}</td>
                    </tr> */}
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Total Split Counties
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The total number of counties in the state that are split by a district. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.NUM_SPLIT_COUNTIES}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Deviation From Enacted Area
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of how close the districting\'s district\'s boundaries are to the enacted districting. Calculated by finding the enacted district that intersects the most in terms of area to a candidate\'s districts. Lower is closer.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{(props.districting.Measures.DEVIATION_FROM_ENACTED_AREA * 100).toFixed(2)}%</td>
                    </tr>
                </tbody>
            </table>
        </div>;
    };
    const createBigMeasureTextStandalone = () => {
        return <div className="measure-text-standalone" style={{ display: 'flex', flexDirection: 'row' }}>
            <table style={{ margin: '10px' }}>
                <tbody>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Objective Function
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText(`A function used to select districtings with weights on parameters that reflect a \'good\' districting. Objective Function values:
                                        ( (1 - EQUAL_POP_) * .7) + SEP_SMALL
                                        ( (1 - GTC) * .05) + (POL_POP * .05) + SEP_SMALL
                                        (DEV_ENACTED_AREA * .1) + SEP_SMALL
                                        ( (1 - ( (EFF_GAP_HOUSE20 + EFF_GAP_PRES20) / 2) ) * .1)`);
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{(props.districting.Measures.OBJ_FUNC || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Equal Population Variance
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The difference between the most populous and least populous district\'s population divided by the ideal district population for the state. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{(props.districting.Measures.EQUAL_POPULATION_VARIANCE * 100).toFixed(2)}%</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Political Deviation From Enacted (average across elections)
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The mean sum of squares percentage difference between a district\'s election results and the enacted districting\'s district\'s election results. Lower means the change was small.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.POLITICAL_DEVIATION_FROM_ENACTED ? (props.districting.Measures.POLITICAL_DEVIATION_FROM_ENACTED * 100).toFixed(2) + '%' : 'n/a'}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Racial Deviation From Enacted (average across races)
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The mean sum of squares percentage difference between a district\'s demographic\'s and the enacted districting\'s district\'s demographic\'s. Lower means the change was small.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.RACIAL_DEVIATION_FROM_ENACTED ? (props.districting.Measures.RACIAL_DEVIATION_FROM_ENACTED * 100).toFixed(2) + '%' : 'n/a'}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Number of Opportunity Districts
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The number of districts where a minority group has greater than 50% population in the district.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.NUM_OPPORTUNITY_DISTRICTS}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Polsby Popper Compactness Score
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of compactness calculated by using the district\'s area and perimeter. Higher is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.POLSBY_POPPER.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <table style={{ margin: '10px' }}>
                <tbody>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Graph Theoretical Compactness
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of compactness calculated by using the ratio of edge nodes to total nodes in a connected graph of precincts in a district. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.GRAPH_COMPACTNESS ? props.districting.Measures.GRAPH_COMPACTNESS.toFixed(2) : 'n/a'}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Efficiency Gap {electionMap[props.electionIndex]}
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of how many votes are being wasted in an election. Defined as lost votes (all votes for the losing party) and excess votes (votes above 50% for the winning party). Can indicate packing/cracking. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.EFFICIENCY_GAP[props.electionIndex] ? (props.districting.Measures.EFFICIENCY_GAP[props.electionIndex] * 100).toFixed(2) + '%' : 'n/a'}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Efficiency Gap {electionMap[props.electionIndex]} Favors
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The party that won the most districts in the state is the party that the efficiency gap \'favors\'.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.EFFICIENCY_GAP_FAVORS[props.electionIndex]}</td>
                    </tr>
                    {/* <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Split Counties Score
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of how/if counties are split between districts. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.SPLIT_COUNTIES_SCORE.toFixed(2)}</td>
                    </tr> */}
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Total Split Counties
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('The total number of counties in the state that are split by a district. Lower is better.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{props.districting.Measures.NUM_SPLIT_COUNTIES}</td>
                    </tr>
                    <tr>
                        <td>
                            <div className='tool-tip-wrapper'>Deviation From Enacted Area
                                <div
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => {
                                        props.setTooltipOpen(true);
                                        props.setTooltipText('A measure of how close the districting\'s district\'s boundaries are to the enacted districting. Calculated by finding the enacted district that intersects the most in terms of area to a candidate\'s districts. Lower is closer.');
                                        props.setToolTipPosition([(e.clientX - 250) + 'px', (e.clientY) + 'px']);
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
                        </td>
                        <td className={'td-align-right'}>{(props.districting.Measures.DEVIATION_FROM_ENACTED_AREA * 100).toFixed(2)}%</td>
                    </tr>
                </tbody>
            </table>
        </div>;
    };

    const validateIsNan = (input) => {
        if (isNaN(input)) return 'n/a';
        else return input + '%';
    };

    let currentlyUsingPop = populationMap[props.populationIndex];
    return <div className="tab-wrapper">
        {candidateTab && <div id="the-top-of-candidate">
            {((props.isAlgorithmRunning !== 'running' && props.isAlgorithmRunning !== 'paused') || !props.isGraphVisible) && <div className='shuffle-btn-area'>
                <button className='shuffle-btn button' onClick={() => props.handleOptimizeClick(props.algorithmParameters)}>Equalize Population</button>
            </div>}
            <div className="algorithm-options">
                <h3>Algorithm Options</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label>Timeout: </label>
                            </td>
                            <td>
                                <input type='text' onBlur={(e) => props.setAlgorithmParameters({ ...props.algorithmParameters, timeout: e.target.value })}></input>seconds
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Equality Threshold: </label>
                            </td>
                            <td>
                                <input type='text' onBlur={(e) => props.setAlgorithmParameters({ ...props.algorithmParameters, equality: e.target.value })}></input>%
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Currently using:
                            </td>
                            <td>
                                {currentlyUsingPop}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Objective Function Values
                            </td>
                            <td>
                                <span>
                                    ( (1 - EQUAL_POP_) * .7) + <br />
                                    ( (1 - GTC) * .05) + (POL_POP * .05) + <br />
                                    (DEV_ENACTED_AREA * .1) + <br />
                                    ( (1 - ( (EFF_GAP_HOUSE20 + EFF_GAP_PRES20) / 2) ) * .1)
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
            </div>
        </div>}
        <h1 id="dist-summary-heading">{props.districting.index === 0 ? 'Enacted ' : ''}Districting {props.districting.index > 0 ? props.districting.index : ''} Summary</h1>
        <table className="detailed-district-stats">
            <thead>
                <tr>
                    <th>District</th>
                    <th>Party</th>
                    <th>Population</th>
                    <th>% Population</th>
                </tr>
            </thead>
            <tbody>
                {distData.map((dist) => (
                    <tr key={dist.districtNumber}>
                        <td>{dist.districtNumber}</td>
                        <td className={"td-align-left " + (dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY ? (dist.elections[props.electionIndex].votes.REPUBLICAN_PARTY > dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY ? 'Rep' : 'Dem') : 'n/a')}>
                            {(dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY ? (dist.elections[props.electionIndex].votes.REPUBLICAN_PARTY > dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY ? 'Rep' : 'Dem') : 'n/a')}
                        </td>
                        <td className="td-align-left">
                            {numberWithCommas(dist.demographics[props.populationIndex].populations.ALL)}
                        </td>
                        <td className="td-align-left">
                            {((dist.demographics[props.populationIndex].populations.ALL / props.stateTotalPop) * 100).toFixed(2) + "%"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="district-measures jump-to-dist">
            <table>
                <tbody>
                    <tr>
                        <td id="jump-to-dist-text">Jump to district:&nbsp;</td>
                        <td>{distData.map((dist) => (
                            <a key={dist.districtNumber} onClick={() => document.querySelector("#district-measures-" + (dist.districtNumber)).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })}> <u>{dist.districtNumber}</u></a>
                        ))}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {props.isRightCollapsedOrExpanded !== 'expanded' ? createMeasureTextStandalone() : createBigMeasureTextStandalone()}

        {distData.map((dist) => (
            <div key={dist.districtNumber} className="district-measures" id={"district-measures-" + (dist.districtNumber)}
                onMouseEnter={() => props.setFHover({ id: dist.districtNumber, action: 'enter' })}
                onMouseLeave={() => props.setFHover({ id: dist.districtNumber, action: 'leave' })} >

                <h3 className="district-measures-header"><u>District #{dist.districtNumber}</u></h3>

                <h4 className="district-measure-text-standalone">Population: {numberWithCommas(dist.demographics[props.populationIndex].populations.ALL)}</h4>
                <h4 className="district-measure-text-standalone">{electionMap[props.electionIndex]} Election Winner Party: &nbsp;
                    <span className={"district-measure-text-standalone party " + (dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY ? (dist.elections[props.electionIndex].votes.REPUBLICAN_PARTY > dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY ? 'Rep' : 'Dem') : 'n/a')}>{(dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY ? (dist.elections[props.electionIndex].votes.REPUBLICAN_PARTY > dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY ? 'Rep' : 'Dem') : 'n/a')}</span>
                </h4>

                <div className={props.isRightCollapsedOrExpanded === 'expanded' ? 'district-measures-expanded' : ''}>
                    <div style={{ flex: props.isRightCollapsedOrExpanded === 'expanded' ? '55%' : '' }}>
                        <table className="detailed-district-stats">
                            <thead>
                                <tr>
                                    <th>Party</th>
                                    <th>Votes</th>
                                    <th>% Votes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="td-align-left Dem">Dem.</td>
                                    <td className="td-align-left">{numberWithCommas(dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY)}</td>
                                    <td className="td-align-left">{validateIsNan((dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY / (dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY + dist.elections[props.electionIndex].votes.REPUBLICAN_PARTY) * 100).toFixed(2))}</td>
                                </tr>
                                <tr>
                                    <td className="td-align-left Rep">Rep.</td>
                                    <td className="td-align-left">{numberWithCommas(dist.elections[props.electionIndex].votes.REPUBLICAN_PARTY)}</td>
                                    <td className="td-align-left">{validateIsNan((dist.elections[props.electionIndex].votes.REPUBLICAN_PARTY / (dist.elections[props.electionIndex].votes.DEMOCRATIC_PARTY + dist.elections[props.electionIndex].votes.REPUBLICAN_PARTY) * 100).toFixed(2))}</td>
                                </tr>
                            </tbody>
                        </table>
                        {props.isRightCollapsedOrExpanded === 'expanded' && <div><h4>Polsby - Popper Compactness Score: {dist.polsbyPopper.toFixed(2)}</h4>
                            <h4>Graph Theoretical Compactness Score: {dist.graphCompactness ? dist.graphCompactness.toFixed(2) : 'n/a'}</h4>
                            <h4>Opportunity District For: {dist.OPPORTUNITY_DISTRICT_FOR.length > 0 ? dist.OPPORTUNITY_DISTRICT_FOR.join(", ") : 'none'}</h4>
                            <h4>Number of Split Counties: {dist.numSplitCounties}</h4>
                        </div>}
                    </div>

                    <table className="state-ethnicities-table" style={{ flex: props.isRightCollapsedOrExpanded === 'expanded' ? '45%' : '' }}>
                        <thead>
                            <tr>
                                <th>Race or Ethnicity</th>
                                <th>Pop.</th>
                                <th>% of Pop.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>White</td>
                                <td className="td-align-left">{numberWithCommas(dist.demographics[props.populationIndex].populations.WHITE)}</td>
                                <td className="td-align-left">{((dist.demographics[props.populationIndex].populations.WHITE / dist.demographics[props.populationIndex].populations.ALL) * 100).toFixed(1) + "%"}</td>
                            </tr>
                            <tr>
                                <td>Black or African American</td>
                                <td className="td-align-left">{numberWithCommas(dist.demographics[props.populationIndex].populations.BLACK_OR_AFRICAN_AMERICAN)}</td>
                                <td className={"td-align-left" + (((dist.demographics[props.populationIndex].populations.BLACK_OR_AFRICAN_AMERICAN / dist.demographics[props.populationIndex].populations.ALL)) > .5 ? ' highlight-opportunity' : '')}>{((dist.demographics[props.populationIndex].populations.BLACK_OR_AFRICAN_AMERICAN / dist.demographics[props.populationIndex].populations.ALL) * 100).toFixed(1) + "%"}</td>
                            </tr>
                            <tr>
                                <td>Native American or Indian</td>
                                <td className="td-align-left">{numberWithCommas(dist.demographics[props.populationIndex].populations.AMERICAN_INDIAN_AND_ALASKA_NATIVE)}</td>
                                <td className={"td-align-left" + (((dist.demographics[props.populationIndex].populations.AMERICAN_INDIAN_AND_ALASKA_NATIVE / dist.demographics[props.populationIndex].populations.ALL)) > .5 ? ' highlight-opportunity' : '')}>{((dist.demographics[props.populationIndex].populations.AMERICAN_INDIAN_AND_ALASKA_NATIVE / dist.demographics[props.populationIndex].populations.ALL) * 100).toFixed(1) + "%"}</td>
                            </tr>
                            <tr>
                                <td>Asian</td>
                                <td className="td-align-left">{numberWithCommas(dist.demographics[props.populationIndex].populations.ASIAN)}</td>
                                <td className={"td-align-left" + (((dist.demographics[props.populationIndex].populations.ASIAN / dist.demographics[props.populationIndex].populations.ALL)) > .5 ? ' highlight-opportunity' : '')}>{((dist.demographics[props.populationIndex].populations.ASIAN / dist.demographics[props.populationIndex].populations.ALL) * 100).toFixed(1) + "%"}</td>
                            </tr>
                            <tr>
                                <td>Pacific Islander or Hawaiian</td>
                                <td className="td-align-left">{numberWithCommas(dist.demographics[props.populationIndex].populations.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER)}</td>
                                <td className={"td-align-left" + (((dist.demographics[props.populationIndex].populations.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER / dist.demographics[props.populationIndex].populations.ALL)) > .5 ? ' highlight-opportunity' : '')}>{((dist.demographics[props.populationIndex].populations.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER / dist.demographics[props.populationIndex].populations.ALL) * 100).toFixed(1) + "%"}</td>
                            </tr>
                            <tr>
                                <td>Some Other Race</td>
                                <td className="td-align-left">{numberWithCommas(dist.demographics[props.populationIndex].populations.SOME_OTHER_RACE)}</td>
                                <td className="td-align-left">{validateIsNan(((dist.demographics[props.populationIndex].populations.SOME_OTHER_RACE / dist.demographics[props.populationIndex].populations.ALL) * 100).toFixed(1))}</td>
                            </tr>
                            <tr>
                                <td>Two or more races</td>
                                <td className="td-align-left">{numberWithCommas(dist.demographics[props.populationIndex].populations.TWO_OR_MORE_RACES)}</td>
                                <td className="td-align-left">{validateIsNan(((dist.demographics[props.populationIndex].populations.TWO_OR_MORE_RACES / dist.demographics[props.populationIndex].populations.ALL) * 100).toFixed(1))}</td>
                            </tr>
                            <tr>
                                <td>Hispanic</td>
                                <td className="td-align-left">{numberWithCommas(dist.demographics[props.populationIndex].populations.HISPANIC)}</td>
                                <td className={"td-align-left" + (((dist.demographics[props.populationIndex].populations.HISPANIC / dist.demographics[props.populationIndex].populations.ALL)) > .5 ? ' highlight-opportunity' : '')}>{((dist.demographics[props.populationIndex].populations.HISPANIC / dist.demographics[props.populationIndex].populations.ALL) * 100).toFixed(1) + "%"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {props.isRightCollapsedOrExpanded !== 'expanded' && <div><h4>Polsby - Popper Compactness Score: {dist.polsbyPopper.toFixed(2)}</h4>
                    <h4>Graph Theoretical Compactness Score: {dist.graphCompactness ? dist.graphCompactness.toFixed(2) : 'n/a'}</h4>
                    <h4>Opportunity District For: {dist.OPPORTUNITY_DISTRICT_FOR.length > 0 ? dist.OPPORTUNITY_DISTRICT_FOR.join(", ") : 'none'}</h4>
                    <h4>Number of Split Counties: {dist.numSplitCounties}</h4>
                </div>}

                <div className="back-to-top-text" style={{ marginLeft: props.isRightCollapsedOrExpanded === 'expanded' ? '87%' : '75%' }}>
                    <u><a onClick={() => document.querySelector(candidateTab ? "#the-top-of-candidate" : "#dist-summary-heading").scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })}>Back to top</a></u>
                </div>
            </div>
        ))}
    </div>;
}

export default TabData;