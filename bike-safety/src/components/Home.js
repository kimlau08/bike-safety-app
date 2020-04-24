import React from 'react';

export default function Home(props) {

    if (props.location.swapDisplayCallback !== undefined) {
        props.location.swapDisplayCallback("home-container", props);
    }
    return (
        <div>
        </div>
    )
}
