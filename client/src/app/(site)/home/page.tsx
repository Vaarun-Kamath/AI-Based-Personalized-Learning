import AllExamsSection from "@/components/section/AllExamsSection";
import UserAnalyticsSection from "@/components/section/UserAnalyticsSection";
import React from "react";

function HomePage() {
  return (
    <div className="w-full flex flex-col gap-8">
      <AllExamsSection />
      <hr className="border-2 border-gray-200 rounded-lg" />
      <UserAnalyticsSection />
    </div>
  );
}

export default HomePage;
