import React, { useState } from "react";
import DropdownMenu from "./DropdownMenu";

const DropdownButton = (props) => {

    // const [isOpen, setOpen] = useState(false);

    return (
        <div className='dropdown' onClick={() => { 
                // setOpen(!isOpen); 
                props.setCurrentOpenDropdown(!props.isOpen ? props.dropdownMenuClass : null);
            }}>
            <a href='#' className='icon-btn'>
                {props.buttonStyle}
            </a>
            {props.isOpen && <DropdownMenu items={props.items} dropdownMenuClass={props.dropdownMenuClass} />}
        </div>
    );
}

export default DropdownButton;