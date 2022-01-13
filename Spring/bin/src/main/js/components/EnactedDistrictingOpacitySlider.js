import React, { useState } from 'react';

const EnactedDistrictingOpacitySlider = (props) => {
    const [value, setValue] = useState(props.currentEnactedDistrictsOpacity);
    const handleChange = (e) => {
        setValue(e.target.value);
        props.setCurrentEnactedDistrictsOpacity(parseFloat(e.target.value));
    };
    return <div className='enacted-districting-opacity-slider'>
        Enacted Districting Opacity:<input type='range' step={.25} min={0} max={1} value={value} onChange={handleChange}></input>
    </div>
};

export default EnactedDistrictingOpacitySlider;