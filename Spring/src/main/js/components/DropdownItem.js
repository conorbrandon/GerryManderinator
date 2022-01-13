import React from "react";

// const DropDownItem = (props) => { 

//     return(
//       <a href="#" className="menu-item" onClick={() => props.setSelectedState({lat:props.lat, lng:props.lng, zoom:props.zoom, stateIndex:props.stateIndex})}>
//         <span className="icon-button">{props.leftIcon}</span>
//         {props.children}
//       </a>
//     );
// }

const DropdownItem = ({icon, text, callback, callbackParams}) => {

    // I wonder if open/setOpen doesn't have to be passed all the way down to here
    // maybe clicking anywhere withing DropdownMenu does the trick
    // not to mention we want mousedown type thing...
    const handleClick = () => {
        callback(callbackParams);
    }

    const classNameForItem = text === "Arizona" || text === "Georgia" || text === "Nevada" ? "state-flag" : "options-option"
    return (
        <a href='#' className='menu-item state-flag' onClick={() => handleClick()}>
            <span className={'icon-btn ' + classNameForItem}>{icon}</span>
            <span>{text}</span>
        </a>
    );
}

export default DropdownItem;