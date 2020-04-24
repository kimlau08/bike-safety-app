import React, { Component } from 'react';

export default class ImageRow extends Component {
    constructor(props) {
      super(props);
    }

    displayImgCard(imgCardInfo) { 
      //display the title, image, and description for a report

      let desc = "";
      if ( "description" in imgCardInfo) {
        desc = imgCardInfo.description;
      }

      return (
        <div className="bike-img-card">
          <p className="report-title">{imgCardInfo.reportTitle}</p>
          <img className="bike-img" src={imgCardInfo.bikeImg} />
          <p className="description-txt">{desc}</p>
        </div>
      )
    }

    render () {

        if (this.props.imgObjList === undefined) {
            return <div></div>
        }

        let imgObjList=JSON.parse(this.props.imgObjList);

        return (
            <div className="bike-img-row">

              {/* display image info objects */}
              {imgObjList.map( this.displayImgCard ) }
            </div>
        )

    }
}
