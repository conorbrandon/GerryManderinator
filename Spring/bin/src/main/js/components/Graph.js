import React, { useState } from 'react';
import ReactDom from "react-dom";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { pauseAlgorithm, stopAlgorithm } from '../Requests';

const Graph = (props) => {

  const [isHidden, setIsHidden] = useState(false);
  return (
    <div className='graph-container'>
      <button className='graph-container-collapse-button button'
        onClick={() => {
          setIsHidden(!isHidden);
          console.log(isHidden ? "visible" : "hidden");
          let element = document.getElementsByClassName("graph-container")[0];
          ReactDom.findDOMNode(element).style.top = isHidden ? '15vh' : (window.innerHeight - 125) + 'px';
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
              Running time: <span>0</span> seconds
            </div>
            <div className='algorithm-status-time'>
              Time to completion: <span>0</span> seconds
            </div>
          </div>
          <div style={{marginTop: '3%'}}>
            Measures
            <table>
              <tbody>
                <tr>
                  <td>Equal Pop.</td>
                  <td>n/a</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!props.isOptimized && <div className='set-algorithm-status-container'>
        {props.isAlgorithmRunning === 'running' && <div>
          <button className='button'
            onClick={() => pauseAlgorithm("pause", props.setAlgorithmRunning, props.setCurrentInterval, props.currentInterval, props.setGraphData, props.setIsOptimized, props.setTabIndex, props.setCurrentOptimizedDistricts, props.setOptimizedDistricting)}>
            <i className="material-icons md-light material-icons-align">pause</i>Pause Algorithm
          </button>
        </div>}
        {props.isAlgorithmRunning === 'paused' && <div>
          <button className='button'
            onClick={() => pauseAlgorithm("resume", props.setAlgorithmRunning, props.setCurrentInterval, props.currentInterval, props.setGraphData, props.setIsOptimized, props.setTabIndex, props.setCurrentOptimizedDistricts, props.setOptimizedDistricting)}>
            <i className="material-icons md-light material-icons-align">play_arrow</i>Resume Algorithm
          </button>
        </div>}
        <div>
          <button className='button'
            onClick={() => stopAlgorithm(props.setAlgorithmRunning, props.setCurrentInterval, props.currentInterval, props.setIsOptimized, props.setTabIndex, props.setCurrentOptimizedDistricts, props.setOptimizedDistricting)}>
            <i className="material-icons md-light material-icons-align">stop</i>Stop Algorithm
          </button>
        </div>
      </div>}

    </div>
  );
};

export default Graph;