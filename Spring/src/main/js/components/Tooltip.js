import React from "react";

const Tooltip = (props) => {
  const bigSplit = props.text.split("SEP_BIG");
  const normalSection = bigSplit[0];
  const createSpanSection = (bigSplit) => {
    if (bigSplit.length === 2) {
      const smallSplit = bigSplit[1].split("SEP_SMALL");
      let thing = [];
      let i;
      for (i = 0; i < smallSplit.length; i++) {
        const element = smallSplit[i];
        thing.push(<div>
          {element}
        </div>)
      }
    } else return undefined;
  };
  return (
    <div className='tool-tip' style={{left: props.position[0], top: props.position[1]}}>
        <p>{normalSection}</p>
        <span>{createSpanSection(bigSplit)}</span>
    </div>
  );

}

export default Tooltip;