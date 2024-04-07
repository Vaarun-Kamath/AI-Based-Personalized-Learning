import React from 'react';
import SimpleChart from '../charts/SimpleChart';

function UserAnalyticsSection() {
  const data = [12, 19, 3, 5, 2, 3];
  const data2 = [4, 10, 5, 10, 22, 8];
  return (
    <>
      <h2 className='font-bold text-3xl'>Your Analysis</h2>
      <div className='w-full grid grid-cols-3 gap-x-10'>
        <span className=''>
          <SimpleChart data={data} />
        </span>
        {/* <span>
          <SimpleChart data={data2} />
        </span> */}
      </div>
    </>
  );
}

export default UserAnalyticsSection;
