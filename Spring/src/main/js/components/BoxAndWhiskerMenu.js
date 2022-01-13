import React from "react";
import { electionMap } from "../App";

const FilterMenu = (props) => {
  console.log(props, props.currentBoxWhiskerData[props.electionIndex], props.currentBoxWhiskerData[props.electionIndex + "D"] !== undefined);
  const basisNumberClassName = Object.keys(props.currentBoxWhiskerData[props.electionIndex + "D"]).length > 0  ? ' with-election' : ' no-election';
  return (
    <div className={'box-whisker-menu' + basisNumberClassName}>
      <a href="#" onClick={() => {
        props.setBoxVisible(!props.isBoxVisible);
        props.setBoxWhiskerBasis("WHITE");
      }} className="menu-item filter-option">White</a>

      <a href="#" onClick={() => {
        props.setBoxVisible(!props.isBoxVisible);
        props.setBoxWhiskerBasis("BLACK_OR_AFRICAN_AMERICAN");
      }} className="menu-item filter-option">Black or African American</a>

      <a href="#" onClick={() => {
        props.setBoxVisible(!props.isBoxVisible);
        props.setBoxWhiskerBasis("HISPANIC");
      }} className="menu-item filter-option">Hispanic</a>

      <a href="#" onClick={() => {
        props.setBoxVisible(!props.isBoxVisible);
        props.setBoxWhiskerBasis("ASIAN");
      }} className="menu-item filter-option">Asian</a>

      <a href="#" onClick={() => {
        props.setBoxVisible(!props.isBoxVisible);
        props.setBoxWhiskerBasis("AMERICAN_INDIAN_AND_ALASKA_NATIVE");
      }} className="menu-item filter-option">Native American or Indian</a>

      {
      Object.keys(props.currentBoxWhiskerData[props.electionIndex + "D"]).length > 0 && <div><a href="#" onClick={() => {
        props.setBoxVisible(!props.isBoxVisible);
        props.setBoxWhiskerBasis("DEMOCRATIC_PARTY");
      }} className="menu-item filter-option">{electionMap[props.electionIndex]} Dem.</a>

        <a href="#" onClick={() => {
          props.setBoxVisible(!props.isBoxVisible);
          props.setBoxWhiskerBasis("REPUBLICAN_PARTY");
        }} className="menu-item filter-option">{electionMap[props.electionIndex]} Rep.</a></div>
        }
    </div>
  );

}

export default FilterMenu;