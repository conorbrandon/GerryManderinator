import React from "react";

import TabData from "./TabData";

const TabEnacted = (props) => {
    return (
        <div>
            {props.index > -1 ?
                TabData({...props})
                :
                <span className="instruction-text">Please select a state from the dropdown</span>
            }
        </div>
    );
}

export default TabEnacted;