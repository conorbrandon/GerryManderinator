import React from "react";

import TabData from "./TabData";

const TabOptimized = (props) => {
    console.log(props);
    return (
        <div>
            {props.isOptimized ?
                TabData({...props})
                :
                <span className="instruction-text">Please optimize a candidate districting first.</span>
            }
        </div>
    );
}

export default TabOptimized;