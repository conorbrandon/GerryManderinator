import React from "react";
import { electionMap } from "../App";

const SvgPopUp = (props) => {
    // console.log(props);
    return <div className='svg-hover-popup'>
        <h1>Districting {props.hoverSvgPopupData.Districting} Measures</h1>
        <table>
            <tbody>
                <tr>
                    <td>
                        Objective Function
                    </td>
                    <td>
                        {(props.hoverSvgPopupData.OBJ_FUNC || 0).toFixed(2)}
                    </td>
                </tr>
                <tr>
                    <td>
                        Equal Population Variance
                    </td>
                    <td>
                        {(props.hoverSvgPopupData.EQUAL_POPULATION_VARIANCE * 100).toFixed(2)}%
                    </td>
                </tr>
                <tr>
                    <td>
                        Political Deviation From Enacted (average across elections)
                    </td>
                    <td>
                        {(props.hoverSvgPopupData.POLITICAL_DEVIATION_FROM_ENACTED * 100).toFixed(2)}%
                    </td>
                </tr>
                <tr>
                    <td>
                        Racial Deviation From Enacted (average across races)
                    </td>
                    <td>
                        {(props.hoverSvgPopupData.RACIAL_DEVIATION_FROM_ENACTED * 100).toFixed(2)}%
                    </td>
                </tr>
                <tr>
                    <td>
                        Number of Opportunity Districts
                    </td>
                    <td>
                        {props.hoverSvgPopupData.NUM_OPPORTUNITY_DISTRICTS}
                    </td>
                </tr>
                <tr>
                    <td>
                        Polsby - Popper Compactness Score
                    </td>
                    <td>
                        {props.hoverSvgPopupData.POLSBY_POPPER.toFixed(2)}
                    </td>
                </tr>
                <tr>
                    <td>
                        Graph Theoretical Compactness
                    </td>
                    <td>
                        {props.hoverSvgPopupData.GRAPH_COMPACTNESS.toFixed(2)}
                    </td>
                </tr>
                <tr>
                    <td>
                        Efficiency Gap {electionMap[props.electionIndex]}
                    </td>
                    <td>
                        {props.hoverSvgPopupData.EFFICIENCY_GAP[props.electionIndex] ? (props.hoverSvgPopupData.EFFICIENCY_GAP[props.electionIndex] * 100).toFixed(2) + '%' : 'n/a'}
                    </td>
                </tr>
                <tr>
                    <td>
                        Efficiency Gap {electionMap[props.electionIndex]} Favors
                    </td>
                    <td>
                        {props.hoverSvgPopupData.EFFICIENCY_GAP_FAVORS[props.electionIndex]}
                    </td>
                </tr>
                {/* <tr>
                    <td>
                        Split Counties Score
                    </td>
                    <td>
                        {props.hoverSvgPopupData.SPLIT_COUNTIES_SCORE.toFixed(2)}
                    </td>
                </tr> */}
                <tr>
                    <td>
                        Deviation From Enacted Area
                    </td>
                    <td>
                        {(props.hoverSvgPopupData.DEVIATION_FROM_ENACTED_AREA * 100).toFixed(2)}%
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
};

export default SvgPopUp;