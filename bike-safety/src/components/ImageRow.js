import React, { Component } from 'react';

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

        if (this.props.theftImgList === undefined) {
            return <div></div>
        }

        let theftImg=JSON.parse(this.props.theftImgList);

        return (
            <div className="bikeImgRow">
              {theftImg.map( this.displayImgCard ) }
            </div>
        )

    }
}
