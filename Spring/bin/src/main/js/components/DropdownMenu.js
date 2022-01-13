import React from "react";
import DropdownItem from "./DropdownItem";

// these are going to have to go in Navbar, and be passed down in props
// import { ReactComponent as Ari } from '../assets/Arizona.svg';
// import { ReactComponent as Geo } from '../assets/Georgia.svg';
// import { ReactComponent as Nev } from '../assets/Nevada.svg';
// import { ReactComponent as SBU } from '../assets/Wolfie.svg';

// const DropDownMenu = (props) => {
//     return(
//       <div className="dropdown">
//         <DropdownItem setSelectedState={props.setSelectedState} lat={34.048927} lng={-111.093735} zoom={7.3} stateIndex={0} leftIcon={<Ari className="state-icon"/>}> Arizona </DropdownItem>
//         <DropdownItem setSelectedState={props.setSelectedState} lat={32.165623} lng={-82.900078} zoom={7.5} stateIndex={1} leftIcon={<Geo className="state-icon"/>}> Georgia </DropdownItem>
//         <DropdownItem setSelectedState={props.setSelectedState} lat={39.5158825} lng={-116.8537227} zoom={7.3} stateIndex={2} leftIcon={<Nev className="state-icon"/>}> Nevada </DropdownItem>
//         <DropdownItem setSelectedState={props.setSelectedState} lat={40.912949} lng={-73.123647} zoom={19} stateIndex={3} leftIcon={<SBU className="state-icon"/>}> Best Class </DropdownItem>
//       </div>
//     );
// }

// callback is whatever function the DropdownItem should call when clicked
const DropdownMenu = ({items, dropdownMenuClass}) => {
    return (
        <div className={'dropdown-menu ' + dropdownMenuClass}>
            {items.filter(item => item !== undefined).map((item, i) => (
                <DropdownItem key={i}
                    icon={item.icon} 
                    text={item.text} 
                    callback={item.callback} 
                    callbackParams={item.callbackParams} />
            ))}
        </div>
    );
}

export default DropdownMenu;
