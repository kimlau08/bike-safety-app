import React from 'react';

export default function Home(props) {

    if (props.swapDisplayCallback !== undefined) {
        props.swapDisplayCallback("home-container", props);
    }

    return (  //display already rendered in App.js
        <div>
        </div>
    )
}
