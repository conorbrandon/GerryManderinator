import React from "react";
import { electionMap } from "../App";

const FilterMenu = (props) => {
  console.log(props);
  const sortThem = (sortBasis, sortOrder) => {
    // copy and sort allDistrictingMeasuresForState
    let allDistrictingMeasuresForStateCopy = JSON.parse(JSON.stringify(props.allDistrictingMeasuresForState));
    const splitSortBasis = sortBasis.split(" ");
    if (splitSortBasis.length === 2 && splitSortBasis[0] === "EFFICIENCY_GAP") {
      const electionIndex = splitSortBasis[1];
      allDistrictingMeasuresForStateCopy.sort((a, b) => {
        if (a.EFFICIENCY_GAP[electionIndex] < b.EFFICIENCY_GAP[electionIndex]) {
          return -1;
        }
        if (a.EFFICIENCY_GAP[electionIndex] > b.EFFICIENCY_GAP[electionIndex]) {
          return 1;
        }
        return 0;
      });
    } else if (splitSortBasis.length === 2 && splitSortBasis[0] === "D") {
      const electionIndex = splitSortBasis[1];
      allDistrictingMeasuresForStateCopy = allDistrictingMeasuresForStateCopy.map(districting => {
        if (districting.EFFICIENCY_GAP_FAVORS[electionIndex] === 'Dem.') districting.sortKey = districting.EFFICIENCY_GAP[electionIndex];
        if (districting.EFFICIENCY_GAP_FAVORS[electionIndex] === 'Rep.') districting.sortKey = -1 * (districting.EFFICIENCY_GAP[electionIndex]);
        if (districting.EFFICIENCY_GAP_FAVORS[electionIndex] === 'tie') districting.sortKey = 0;
        return districting;
      });
      allDistrictingMeasuresForStateCopy.sort((a, b) => {
        if (a.sortKey < b.sortKey) return 1;
        if (a.sortKey > b.sortKey) return -1;
        return 0;
      });
    } else if (splitSortBasis.length === 2 && splitSortBasis[0] === "R") {
      const electionIndex = splitSortBasis[1];
      allDistrictingMeasuresForStateCopy = allDistrictingMeasuresForStateCopy.map(districting => {
        if (districting.EFFICIENCY_GAP_FAVORS[electionIndex] === 'Rep.') districting.sortKey = districting.EFFICIENCY_GAP[electionIndex];
        if (districting.EFFICIENCY_GAP_FAVORS[electionIndex] === 'Dem.') districting.sortKey = -1 * (districting.EFFICIENCY_GAP[electionIndex]);
        if (districting.EFFICIENCY_GAP_FAVORS[electionIndex] === 'tie') districting.sortKey = 0;
        return districting;
      });
      allDistrictingMeasuresForStateCopy.sort((a, b) => {
        if (a.sortKey < b.sortKey) return 1;
        if (a.sortKey > b.sortKey) return -1;
        return 0;
      });
    } else {
      allDistrictingMeasuresForStateCopy.sort((a, b) => {
        if (a[sortBasis] < b[sortBasis]) {
          return (sortOrder === 'ascending' ? -1 : 1);
        }
        if (a[sortBasis] > b[sortBasis]) {
          return (sortOrder === 'ascending' ? 1 : -1);
        }
        return 0;
      });
    }
    console.log({ allDistrictingMeasuresForStateCopy });
    let candidateSvgsMap = {};
    for (let i = 0; i < props.candidateSvgs.length; i++) {
      const svg = props.candidateSvgs[i];
      candidateSvgsMap[svg.index] = svg.img;
    }
    let candidateSvgsCopy = [];
    for (let i = 0; i < allDistrictingMeasuresForStateCopy.length; i++) {
      const indexOfDist = allDistrictingMeasuresForStateCopy[i].candidateID;
      if (indexOfDist === 0) continue;
      candidateSvgsCopy.push({ index: indexOfDist, img: candidateSvgsMap[indexOfDist] });
    }
    console.log({ candidateSvgsCopy });
    props.setCandidateSvgs(candidateSvgsCopy);
  };

  return (
    <div>
      <div className='filter-menu'>
        <div className='tool-tip-wrapper'>
          <h1 style={{ fontSize: 'large' }}>Sort By:</h1>
          <div
            onMouseEnter={(e) => {
              console.log(e);
              props.setTooltipOpen(true);
              props.setTooltipText('Best to worst for a given measure. For an explanation of these measures, see a districting tab in the right sidebar.');
              props.setToolTipPosition([(e.clientX) + 'px', (e.clientY + 10) + 'px']);
            }}
            onMouseLeave={() => {
              props.setTooltipOpen(false);
              props.setTooltipText('');
              props.setToolTipPosition(['-100vw', '-100vh']);
            }}>
            <i className="material-icons md-light">info</i>
          </div>
        </div>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('candidateID', 'ascending')}>Candidate ID</a>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('OBJ_FUNC', 'descending')}>Objective Function</a>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('EQUAL_POPULATION_VARIANCE', 'ascending')}>Population Equality</a>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('NUM_OPPORTUNITY_DISTRICTS', 'descending')}>Number of Opportunity Districts</a>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('POLSBY_POPPER', 'descending')}>Polsby - Popper Compactness Score</a>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('GRAPH_COMPACTNESS', 'ascending')}>Graph Theoretical Compactness</a>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('EFFICIENCY_GAP' + ' ' + props.electionIndex, 'ascending')}>Efficiency Gap {electionMap[props.electionIndex]}</a>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('D' + ' ' + props.electionIndex, 'ascending')}>Favors Dems. {electionMap[props.electionIndex]}</a>
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('R' + ' ' + props.electionIndex, 'ascending')}>Favors Reps. {electionMap[props.electionIndex]}</a>
        {/* <a href="#" className="menu-item filter-option" onClick={() => sortThem('SPLIT_COUNTIES_SCORE', 'ascending')}>Split Counties Score</a> */}
        <a href="#" className="menu-item filter-option" onClick={() => sortThem('DEVIATION_FROM_ENACTED_AREA', 'ascending')}>Deviation From Enacted Area</a>
      </div>
    </div>
  );

}

export default FilterMenu;