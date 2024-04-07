'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart, { Point, BubbleDataPoint } from 'chart.js/auto';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { getUserData } from '@/app/api/home/handler';
import DisplayLoading from '../atoms/Loading';

interface SimpleChartProps {
  data: number[];
}

const SimpleChart: React.FC<SimpleChartProps> = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart>();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/`);
    },
  });
  const [chartData, setChartData] = useState<Array<number>>([]);
  const [userData, setUserData] = useState<any>();
  const user = session?.user;
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        if (!user) return;
        const res = await getUserData(user.username);
        if (res.errorCode) {
          console.error('Error fetching question', res.errorMessage);
        } else if (res.status === 200) {
          console.log(res);
          setUserData(res.topics);
        }
      } catch (error) {
        console.error('Please try again after some time');
      }
    };

    fetchQuestion();
  }, [user]);

  useEffect(() => {
    if (!userData) return;
    const data = Object.keys(userData).map(
      (key) => userData[key]['Easy']['correct']
    );
    setChartData(data);
    setLoading(false);
  }, [userData]);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy previous chart
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData).map((key) => key),
        datasets: [
          {
            label: 'Questions Attempted',
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [chartData]);

  return (
    <>
      {chartData.length > 0 ? (
        <canvas ref={chartRef} />
      ) : loading ? (
        <DisplayLoading />
      ) : (
        <p className='text-gray-500 font-semibold mx-2'>No Data Avaliable</p>
      )}
    </>
  );
};

export default SimpleChart;
