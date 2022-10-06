import React, { useRef, useEffect, useState } from "react";


export default function PackagesList({packages, handleChart}) {


  return (
    <div className="packages_list">
      <p>"@dynamic-data" Packages: </p>
      <div className="packages_list__scroll">
        {
          packages.map(item=>{
            return(
              <p key={item.packageName} onClick={ ()=> handleChart(item)}>
                {item.packageName.slice(13)}
              </p>
            )
          })
        }
      </div>
    </div>
  );
};
