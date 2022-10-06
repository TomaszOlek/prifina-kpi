import React, { useRef, useEffect, useState } from "react";


export default function TotalDownloads({allTimeTotal,weeklyTotal}) {

  return (
    <div className="total_Downloads">
        <p>Last Week Downloads: {weeklyTotal}</p>
        <p>Time Z Downloads: {allTimeTotal}</p>
    </div>
  );
};

