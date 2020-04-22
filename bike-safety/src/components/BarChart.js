import React from 'react';
import {Bar} from 'react-chartjs-2';

const state = {
    labels: ['January', 'February', 'March',
             'April', 'May'],
    datasets: [
      {
        label: 'Rainfall',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [65, 59, 80, 81, 56]
      }
    ]
  }


export default function BarChart (props) {

    let graphTitle = props.graphTitle;
    let graphData = {
        labels : props.labels,

        datasets: [
            {
                label: graphTitle,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: props.dataPoints
            }
        ]
    };

    return (
        <div>
            <h1 style={{color:'green'}}>Bar Chart component</h1>

            <Bar
                data={ graphData }
                options={{
                    title:{
                    display:true,
                    text:'Average Rainfall per month',
                    fontSize:20
                    },
                    legend:{
                    display:true,
                    position:'right'
                    }
                }}
            />
        </div>
    )
}
