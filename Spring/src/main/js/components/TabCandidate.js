import React, { useState } from "react";

import TabData from "./TabData";

const TabCandidate = (props) => {
    // console.log(props);
    return (
        <div>
            {props.index > -1 ?
                <div>
                    {props.districting && props.districting.index > 0 ?
                        TabData({...props}, true)
                        :
                        <span className="instruction-text">Please select a districting from the left sidebar</span>
                    }
                </div>
                :
                <div className="instruction-text">Please select a state from the dropdown, and then a districting from the left sidebar.</div>
            }
        </div>
    );
}

export default TabCandidate;