import React from 'react';
import {Bar} from 'react-chartjs-2';

import '../App.css'


export default function BarChart (props) {

    let graphTitle = props.graphTitle;
    let labels = JSON.parse(props.labels);
    let dataPoints = JSON.parse(props.dataPoints);

    let graphData = {
        labels : labels,

        datasets: [
            {
                label: graphTitle,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: dataPoints
            }
        ]
    };

    return (
        <div className="graphChart">
            <Bar 
                data={ graphData }
                options={{
                    title:{
                    display:true,
                    text:graphTitle,
                    fontSize:20
                    },

                    legend:{
                    display:false,
                    position:'right'
                    }
                }}
            />
        </div>
    )
}
