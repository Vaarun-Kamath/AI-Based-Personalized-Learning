'use client';

import { isUserInExam } from '@/app/api/exam/handler';
import AllExamsSection from '@/components/section/AllExamsSection';
import UserAnalyticsSection from '@/components/section/UserAnalyticsSection';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function HomePage() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/`);
    },
  });
  const [loading, setLoading] = useState<boolean>(true);

  const user = session?.user;

  useEffect(() => {
    const checkUserInExam = async () => {
      try {
        if (!user) {
          console.error('User is undefined');
          return;
        }
        const res = await isUserInExam(user.username);
        if (res.errorCode) {
          console.error('Error fetching question', res.errorMessage);
        } else if (res.status === 200) {
          router.push('/exam/' + res.examId);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Please try again after some time');
      }
    };
    if (user) {
      checkUserInExam();
    }
  }, [user, router]);

  return (
    <>
      {loading ? null : (
        <div className='w-full flex flex-col gap-8'>
          <AllExamsSection />
          <hr className='border-2 border-gray-200 rounded-lg' />
          <UserAnalyticsSection />
        </div>
      )}
    </>
  );
}

export default HomePage;
