import React from 'react';
import {Bar} from 'react-chartjs-2';

import '../App.css'


export default function BarChart (props) {

    let graphTitle = props.graphTitle;
    let labels = JSON.parse(props.labels);
    let dataPoints = JSON.parse(props.dataPoints);

    let graphData = {
        labels : labels,  //graph labels

        datasets: [
            {
                label: graphTitle,    //graph title
                backgroundColor: 'rgba(56,170,12,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: dataPoints      //bar graph data points
            }
        ]
    };

    return (
        <div className="graph-chart">
            <Bar 
                data={ graphData }
                options={{
                    title:{
                    display:true,     //show graph title
                    text:graphTitle,
                    fontSize:20
                    },

                    legend:{
                    display:false,    //do not show legend
                    position:'right'
                    },

                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true,  //origin at (0,0)
                                fontColor: 'white'
                            },
                        }],
                      xAxes: [{
                            ticks: {
                                fontColor: 'white'
                            },
                        }]
                    }
                }}
            />
        </div>
    )
}
