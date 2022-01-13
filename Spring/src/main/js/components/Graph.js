import React, { useState } from 'react';
import ReactDom from "react-dom";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { pauseAlgorithm, stopAlgorithm } from '../Requests';
import { numberWithCommas } from '../App';

const Graph = (props) => {

  const [isHidden, setIsHidden] = useState(false);
  console.log(props.isAlgorithmRunning);
  let numCensusBlocksMoved = 0;
  let timeElapsedMin = 0;
  let timeElapsedSec = 0;
  let eqPop = 0;
  let numIterations = 0;
  let status = '';
  let splitPrecincts = null;
  for (const key in props.algorithmStatus) {
    const element = props.algorithmStatus[key];
    
    if (key == 'numCensusBlocksMoved') {
      numCensusBlocksMoved = element;
    } else if (key == 'numIterations') {
      numIterations = element;
    }
    else if (key == 'timeElapsedMs') {
      let seconds = (element / 1000).toFixed(0);
      while (seconds > 61) {
        seconds -= 60;
        timeElapsedMin++;
      };
      timeElapsedSec = seconds;
    }
    else if (key == 'eqPop') {
      eqPop = element;
    }
    else if (key == 'status') {
      status = element;
    }
    else if (key === 'splitPrecincts') {
      splitPrecincts = element;
    }
  };
  //console.log({ algorithmStatus: props.algorithmStatus, status: props.algorithmStatus ? props.algorithmStatus.status : undefined });

  return (
    <div className='graph-container'>
      <button className='graph-container-collapse-button button'
        onClick={() => {
          setIsHidden(!isHidden);
          console.log(isHidden ? "visible" : "hidden");
          let element = document.getElementsByClassName("graph-container")[0];
          ReactDom.findDOMNode(element).style.top = isHidden ? '10vh' : (window.innerHeight - 125) + 'px';
        }}
      >
        {isHidden && <i className="material-icons md-light">keyboard_arrow_up</i>}
        {!isHidden && <i className="material-icons md-light">keyboard_arrow_down</i>}
      </button>
      {props.isOptimized && <button onClick={() => {
        props.setIsGraphVisible(false);
        props.setGraphData([]);
      }}
        style={{ float: 'right' }}>
        <i className="material-icons md-light">close</i>
      </button>}
      <BarChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="District" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Population" fill="#8884d8" />
      </BarChart>

      <div className='algorithm-status-container'>
        <div className='algorithm-status'>
          <div>
            <div className='algorithm-status-time'>
              Running time: <span>{timeElapsedMin}</span> mins, <span>{timeElapsedSec}</span> seconds
            </div>
            {/* <div className='algorithm-status-time'>
              Time to completion: <span>0</span> seconds
            </div> */}
            <div>
              Number of census blocks moved: {numberWithCommas(numCensusBlocksMoved)}
            </div>
            <div>
              Number of iterations: {numberWithCommas(numIterations)}
            </div>
          </div>
          <div style={{ marginTop: '3%' }}>
            Measures
            <table>
              <tbody>
                <tr>
                  <td>Equal Pop.</td>
                  <td>{(eqPop * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                  <td>Split precincts</td>
                  <td>{!splitPrecincts ? 'calculating...' : splitPrecincts}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!props.isOptimized && <div className='set-algorithm-status-container'>
        {props.isAlgorithmRunning === 'running' && <div>
          <button className='button'
            onClick={() => pauseAlgorithm("pause", props.reqObject, props.setAlgorithmStatus, props.setAlgorithmRunning, props.setCurrentInterval, props.currentInterval, props.setGraphData, props.setIsOptimized, props.setTabIndex, props.setCurrentOptimizedDistricts, props.setMostRecentDistricts, props.setOptimizedDistricting)}>
            <i className="material-icons md-light material-icons-align">pause</i>Pause Algorithm
          </button>
        </div>}
        {props.isAlgorithmRunning === 'paused' && <div>
          <button className='button'
            onClick={() => pauseAlgorithm("resume", props.reqObject, props.setAlgorithmStatus, props.setAlgorithmRunning, props.setCurrentInterval, props.currentInterval, props.setGraphData, props.setIsOptimized, props.setTabIndex, props.setCurrentOptimizedDistricts, props.setMostRecentDistricts, props.setOptimizedDistricting)}>
            <i className="material-icons md-light material-icons-align">play_arrow</i>Resume Algorithm
          </button>
        </div>}
        {props.isAlgorithmRunning !== '' && <div>
          <button className='button'
            onClick={() => stopAlgorithm(props.setAlgorithmRunning, props.setCurrentInterval, props.currentInterval, props.setIsOptimized, props.setTabIndex, props.setCurrentOptimizedDistricts, props.setOptimizedDistricting)}>
            <i className="material-icons md-light material-icons-align">stop</i>Stop Algorithm
          </button>
        </div>}
      </div>}
      {props.isOptimized && !splitPrecincts && <div style={{textAlign: 'center'}}><div>Algorithm Done!</div><div>Loading your districting... (this may take a little while, hold tight!)</div></div>}

    </div>
  );
};

export default Graph;