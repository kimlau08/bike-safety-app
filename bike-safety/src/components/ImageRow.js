import React, { Component } from 'react';

export default class ImageRow extends Component {
    constructor(props) {
        super(props);
    }

    displayImgCard(imgCardInfo) {

        let desc = "";
        if ( "description" in imgCardInfo) {
          desc = imgCardInfo.description;
        }

        return (
          <div className="bikeImgCard">
      {/* <p className="reportTitle">{imgCardInfo.reportTitle}</p> */}
            <img className="bikeImg" src={imgCardInfo.bikeImg} />
            <p className="descriptionTxt">{desc}</p>
          </div>
        )
    }

    render () {

        if (this.props.imgObjList === undefined) {
            return <div></div>
        }

        let imgObjList=JSON.parse(this.props.imgObjList);

        return (
            <div className="bikeImgRow">
              {imgObjList.map( this.displayImgCard ) }
            </div>
        )

    }
}
