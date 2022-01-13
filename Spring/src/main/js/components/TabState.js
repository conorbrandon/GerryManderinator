import React from "react";

import { electionMap, numberWithCommas, populationMap } from "../App";

const TabState = (props) => {

    let { currentStateElections, currentStateDemographics, electionIndex, populationIndex } = props;
    // console.log({ currentStateElections, currentStateDemographics, electionIndex, populationIndex }, JSON.stringify(currentStateDemographics));
    currentStateDemographics = currentStateDemographics[populationIndex].populations;

    const roundRawDecimal = (rawDecimal) => {
        return (rawDecimal * 100).toFixed(2);
    }

    return (
        <div className='state-tab'>
            { props.index > -1 ? 
                <div>
                    <div className="state-total-pop">
                        <span>Total Population: { numberWithCommas(currentStateDemographics.ALL) }</span>
                    </div><p>Using <span style={{backgroundColor: 'white', color: 'black', padding: '2px'}}>{electionMap[props.electionIndex]}</span> for election data</p>
                    <table className="state-voters-table">
                        <thead>
                        <tr>
                            <th>Party</th>
                            <th>Votes</th>
                            <th>% of Votes</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Democratic</td>
                            <td className="td-align-left">{ currentStateElections[electionIndex] && currentStateElections[electionIndex].votes.DEMOCRATIC_PARTY ? numberWithCommas(currentStateElections[electionIndex].votes.DEMOCRATIC_PARTY) : 'n/a' }</td>
                            <td className="td-align-left">{ currentStateElections[electionIndex] && currentStateElections[electionIndex].votes.DEMOCRATIC_PARTY ? roundRawDecimal(currentStateElections[electionIndex].votes.DEMOCRATIC_PARTY / (currentStateElections[electionIndex].votes.DEMOCRATIC_PARTY + currentStateElections[electionIndex].votes.REPUBLICAN_PARTY )) + '%' : 'n/a' }</td>
                        </tr>
                        <tr>
                            <td>Republican</td>
                            <td className="td-align-left">{ currentStateElections[electionIndex] && currentStateElections[electionIndex].votes.DEMOCRATIC_PARTY ? numberWithCommas(currentStateElections[electionIndex].votes.REPUBLICAN_PARTY) : 'n/a' }</td>
                            <td className="td-align-left">{ currentStateElections[electionIndex] && currentStateElections[electionIndex].votes.DEMOCRATIC_PARTY ? roundRawDecimal(currentStateElections[electionIndex].votes.REPUBLICAN_PARTY / (currentStateElections[electionIndex].votes.DEMOCRATIC_PARTY + currentStateElections[electionIndex].votes.REPUBLICAN_PARTY )) + '%' : 'n/a' }</td>
                        </tr>
                        </tbody>
                    </table>
                    <p>Using <span style={{backgroundColor: 'white', color: 'black', padding: '2px'}}>{populationMap[props.populationIndex]}</span> for population data</p>
                    <table  className="state-ethnicities-table">
                    <thead>
                        <tr>
                            <th>Race or Ethnicity</th>
                            <th>Population</th>
                            <th>% of Pop.</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>White</td>
                            <td className="td-align-left">{numberWithCommas(currentStateDemographics.WHITE)}</td>
                            <td className="td-align-left">{roundRawDecimal(currentStateDemographics.WHITE / currentStateDemographics.ALL)}%</td>
                        </tr>
                        <tr>
                            <td>Black or African American</td>
                            <td className="td-align-left">{numberWithCommas(currentStateDemographics.BLACK_OR_AFRICAN_AMERICAN)}</td>
                            <td className="td-align-left">{roundRawDecimal(currentStateDemographics.BLACK_OR_AFRICAN_AMERICAN / currentStateDemographics.ALL)}%</td>
                        </tr>
                        <tr>
                            <td>Native American or Indian</td>
                            <td className="td-align-left">{numberWithCommas(currentStateDemographics.AMERICAN_INDIAN_AND_ALASKA_NATIVE)}</td>
                            <td className="td-align-left">{roundRawDecimal(currentStateDemographics.AMERICAN_INDIAN_AND_ALASKA_NATIVE / currentStateDemographics.ALL)}%</td>
                        </tr>
                        <tr>
                            <td>Asian</td>
                            <td className="td-align-left">{numberWithCommas(currentStateDemographics.ASIAN)}</td>
                            <td className="td-align-left">{roundRawDecimal(currentStateDemographics.ASIAN / currentStateDemographics.ALL)}%</td>
                        </tr>
                        <tr>
                            <td>Pacific Islander or Hawaiian</td>
                            <td className="td-align-left">{numberWithCommas(currentStateDemographics.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER)}</td>
                            <td className="td-align-left">{roundRawDecimal(currentStateDemographics.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER / currentStateDemographics.ALL)}%</td>
                        </tr>
                        <tr>
                            <td>Some Other Race</td>
                            <td className="td-align-left">{numberWithCommas(currentStateDemographics.SOME_OTHER_RACE)}</td>
                            <td className="td-align-left">{currentStateDemographics.SOME_OTHER_RACE ? roundRawDecimal(currentStateDemographics.SOME_OTHER_RACE / currentStateDemographics.ALL) + '%' : 'n/a'}</td>
                        </tr>
                        <tr>
                            <td>Two or more races</td>
                            <td className="td-align-left">{numberWithCommas(currentStateDemographics.TWO_OR_MORE_RACES)}</td>
                            <td className="td-align-left">{currentStateDemographics.TWO_OR_MORE_RACES ? roundRawDecimal(currentStateDemographics.TWO_OR_MORE_RACES / currentStateDemographics.ALL) + '%' : 'n/a'}</td>
                        </tr>
                        <tr>
                            <td>Hispanic</td>
                            <td className="td-align-left">{numberWithCommas(currentStateDemographics.HISPANIC)}</td>
                            <td className="td-align-left">{roundRawDecimal(currentStateDemographics.HISPANIC / currentStateDemographics.ALL)}%</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                : 
                <div className="instruction-text">Please select a state from the dropdown</div>
            }
        </div>
    );
}

export default TabState;