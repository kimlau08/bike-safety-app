import React, { Component } from 'react';
import genericImg from '../assets/bike-trail.jpg';

export default class ImageRow extends Component {
    constructor(props) {
        super(props);
    }

    displayImgCard(imgCardInfo) {
        return (
          <div className="bikeImgCard">
            <p className="reportTitle">{imgCardInfo.reportTitle}</p>
            <img className="bikeImg" src={imgCardInfo.bikeImg} />
          </div>
        )
    }

    render () {

        if (this.props.imgObjList === undefined) {
            return <div></div>
        }

        let theftImg=JSON.parse(this.props.imgObjList);

        return (
            <div className="bikeImgRow">
              {theftImg.map( this.displayImgCard ) }
            </div>
        )

    }
}
