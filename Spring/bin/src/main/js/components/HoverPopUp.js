import React from "react";
import { numberWithCommas, electionMap } from "../App";

function HoverPopUp(props) {
    // console.log(props);
    return <div className={"hover-pop-up"}>

        <h1>{(props.layersArray.indexOf("District") > props.layersArray.indexOf("Precinct") ? "District " + props.currentlyHoveringMapFeature["Name"] : "Precinct " + '"' + props.currentlyHoveringMapFeature["Name"] + '"') + " Statistics"}</h1>
        {props.layersArray.indexOf("District") < props.layersArray.indexOf("Precinct") && <h2>{"District " + props.currentlyHoveringMapFeature.District}</h2>}
        {props.currentlyHoveringMapFeature.County && <h2>{props.currentlyHoveringMapFeature.County + " County"}</h2>}

        {delete props.currentlyHoveringMapFeature.County}
        {delete props.currentlyHoveringMapFeature.District}
        
        <table className={"popup-table"}>
            <tbody>
                {Object.keys(props.currentlyHoveringMapFeature).filter(key => key !== "Name").map((key, i) => (
                    <tr key={i}>
                        <td className={"td-align-left"}>{electionMap[key.substr(0, key.length - 1)] ? electionMap[key.substr(0, key.length - 1)] + ' ' + key.substr(key.length - 1) : key}</td>
                        <td className={"td-align-left"}>{numberWithCommas(props.currentlyHoveringMapFeature[key])}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>;
}

export default HoverPopUp;