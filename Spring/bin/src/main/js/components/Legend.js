import React from "react";

function Legend(props) {
    return <div className={'legend'}>
            <div className={'legend-title'}>Legend</div>
            <table>
                <tbody>
                    <tr>
                        <td className={'legend-fill-key-value legend-border-cell'}>Fill</td>
                        <td className={'legend-fill-key-district legend-border-cell'} colSpan={2}>🟢🟠🟡🟣⚫️ District</td>
                        <td className={'legend-fill-key-election'} colSpan={2}>🔴🔵 Election</td>
                    </tr>
                    <tr>
                        <td className={'legend-line-key-value legend-border-cell'}>Line</td>
                        <td className={'legend-line-key legend-border-cell'}>⬛️ District</td>
                        <td className={'legend-line-key legend-border-cell'}>◾️ Precinct</td>
                        <td className={'legend-line-key legend-border-cell'}>⬜️ County</td>
                        <td className={'legend-line-key'}>— — — Enacted</td>
                    </tr> 
                </tbody>
            </table>
        </div>;
}

export default Legend;

{/* <table>
            <tbody>
                <tr>
                    <td className={'legend border-cell'}>🔴🟢🔵🟠🟡🟣⚫️ District Colors</td>
                    <td>🔴🔵 Election Result</td>
                </tr>
                <tr>
                        <td className={'legend border-cell'}>⬜️ District</td>
                        <td className={'legend border-cell'}>⬛️ Precinct</td>
                        <td>🟩 County</td>
                    </tr> 
            </tbody>
        </table> */}