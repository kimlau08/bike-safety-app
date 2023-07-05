import React from 'react';

const displayImgCard = (imgCardInfo) => { 
  //display the title, image, and description for a report

  let desc = "";
  if ( "description" in imgCardInfo) {
    desc = imgCardInfo.description;
  }

  return (
    <div className="bike-img-card">
      <p className="report-title">{imgCardInfo.reportTitle}</p>
      <img className="bike-img" src={imgCardInfo.bikeImg} alt="A bike in outdoor" />
      <p className="description-txt">{desc}</p>
    </div>
  )
};

export default function ImageRow(props) {

      if (props.imgObjList === undefined) {
          return <div></div>
      }

      let imgObjList=JSON.parse(props.imgObjList);

      return (
          <div className="bike-img-row">

            {/* display image info objects */}
            {imgObjList.map( displayImgCard ) }
          </div>
      )

}
