import React, { useState } from 'react';
import ReactApexChart from "react-apexcharts";
Apex.theme
function BoxAndWhisker(props) {

  let { boxWhiskerBasis, currentBoxWhiskerData, whichDistrictingsOnPlot,
    selectedDistricting, enactedDistricting, optimizedDistricting, 
  populationIndex, electionIndex } = props;
  
  whichDistrictingsOnPlot = Object.keys(whichDistrictingsOnPlot);
  console.log({ props }, whichDistrictingsOnPlot);
  let otherBoxWhiskerBasis;
  if (boxWhiskerBasis === "BLACK_OR_AFRICAN_AMERICAN") otherBoxWhiskerBasis = "BLACK";
  if (boxWhiskerBasis === "AMERICAN_INDIAN_AND_ALASKA_NATIVE") otherBoxWhiskerBasis = "INDIAN";
  if (boxWhiskerBasis === "DEMOCRATIC_PARTY") otherBoxWhiskerBasis = electionIndex + "D";
  if (boxWhiskerBasis === "REPUBLICAN_PARTY") otherBoxWhiskerBasis = electionIndex + "R";
  const boxWhiskerDataRaw = currentBoxWhiskerData[otherBoxWhiskerBasis || boxWhiskerBasis];
  let boxWhiskerData = [];
  for (const dist in boxWhiskerDataRaw) {
    boxWhiskerData.push({
      x: parseInt(dist),
      y: JSON.parse(boxWhiskerDataRaw[dist])
    });
  }

  const comparator = (a, b) => {
    if ((a.demographics[populationIndex].populations[boxWhiskerBasis] || a.elections[electionIndex].votes[boxWhiskerBasis]) < (b.demographics[populationIndex].populations[boxWhiskerBasis] || b.elections[electionIndex].votes[boxWhiskerBasis])) return -1;
    else return 1;
  };
  let outliers = [];
  if (whichDistrictingsOnPlot.includes('enacted')) {
    let points = Object.values(enactedDistricting.Districts).sort(comparator).map(dist => {
      return {
        x: '',
        y: dist.demographics[populationIndex].populations[boxWhiskerBasis] || dist.elections[electionIndex].votes[boxWhiskerBasis]
      };
    });
    outliers.push({
      name: 'enacted',
      type: 'scatter',
      data: points
    });
  }
  if (whichDistrictingsOnPlot.includes('candidate')) {
    let points = Object.values(selectedDistricting.Districts).sort(comparator).map(dist => {
      return {
        x: '',
        y: dist.demographics[populationIndex].populations[boxWhiskerBasis] || dist.elections[electionIndex].votes[boxWhiskerBasis]
      }
    });
    outliers.push({
      name: 'candidate',
      type: 'scatter',
      data: points
    });
  }
  if (whichDistrictingsOnPlot.includes('optimized')) {
    let points = Object.values(optimizedDistricting.Districts).sort(comparator).map(dist => {
      return {
        x: '',
        y: dist.demographics[populationIndex].populations[boxWhiskerBasis] || dist.elections[electionIndex].votes[boxWhiskerBasis]
      }
    });
    outliers.push({
      name: 'optimized',
      type: 'scatter',
      data: points
    });
  }

  const series = [
    {
      name: 'box',
      type: 'boxPlot',
      data: boxWhiskerData,
    }
  ];
  series.push(...outliers);

  const options = {
    chart: {
      type: 'boxPlot',
      height: 350,
      background: '#f0f2f5',
      foreColor: '#000000'
    },
    colors: ['#2E93fA', '#66DA26', '#f716e8', '#FF9800'],
    title: {
      text: (otherBoxWhiskerBasis || boxWhiskerBasis) + ' Boxplot',
      align: 'center'
    },
    xaxis: {
      type: 'int',
      tooltip: {
        formatter: function (val) {
          return val
        }
      }
    },
    tooltip: {
      theme: 'dark',
      shared: false,
      intersect: true
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#00788c',
          lower: '#1d1160'
        }
      }
    },
    grid: {
      borderColor: '#717571'
    }
  };

  return (
    <div className='box-plot'>
      <button onClick={() => {
        console.log("closing box");
        props.setBoxVisible(false);
    }}
      style={{ float: 'left', zIndex: 5, position: 'absolute' }}>
      <i className="material-icons md-light">close</i>
    </button>
      <ReactApexChart
        options={options}
        series={series}
        type="boxPlot"
      >

      </ReactApexChart>
    </div>
  );
}


export default BoxAndWhisker;