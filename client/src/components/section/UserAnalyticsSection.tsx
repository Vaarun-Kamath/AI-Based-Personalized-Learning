import React from "react";
import SimpleChart from "../charts/SimpleChart";

function UserAnalyticsSection() {
  const data = [12, 19, 3, 5, 2, 3];
  return (
    <>
      <h2 className="font-bold text-3xl">Your Analysis</h2>
      <div className="w-full grid grid-cols-3">
        <span className="">
          <SimpleChart data={data} />
        </span>
      </div>
    </>
  );
}

export default UserAnalyticsSection;
