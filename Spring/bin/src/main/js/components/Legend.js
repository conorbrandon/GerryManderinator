import React from "react";

function Legend(props) {
    return <div className={'legend'}>
            <div className={'legend-title'}>Legend</div>
            <table>
                <tbody>
                    <tr>
                        <td className={'legend-fill-key-value legend-border-cell'}>Fill</td>
                        <td className={'legend-fill-key-district legend-border-cell'} colSpan={2}>π’π π‘π£β«οΈ District</td>
                        <td className={'legend-fill-key-election'} colSpan={2}>π΄π΅ Election</td>
                    </tr>
                    <tr>
                        <td className={'legend-line-key-value legend-border-cell'}>Line</td>
                        <td className={'legend-line-key legend-border-cell'}>β¬οΈ District</td>
                        <td className={'legend-line-key legend-border-cell'}>βΎοΈ Precinct</td>
                        <td className={'legend-line-key legend-border-cell'}>β¬οΈ County</td>
                        <td className={'legend-line-key'}>β β β Enacted</td>
                    </tr> 
                </tbody>
            </table>
        </div>;
}

export default Legend;

{/* <table>
            <tbody>
                <tr>
                    <td className={'legend border-cell'}>π΄π’π΅π π‘π£β«οΈ District Colors</td>
                    <td>π΄π΅ Election Result</td>
                </tr>
                <tr>
                        <td className={'legend border-cell'}>β¬οΈ District</td>
                        <td className={'legend border-cell'}>β¬οΈ Precinct</td>
                        <td>π© County</td>
                    </tr> 
            </tbody>
        </table> */}