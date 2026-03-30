import { useState } from "react";

const tabs = ["Upcoming", "Past"] as const;

export default function Calendar() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Upcoming");

  const dashedBorderStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
  };

  return (
    <div>
      <h1 className="text-[32px] font-medium text-gray-dark md:text-[40px]">
        Calendar
      </h1>

      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer rounded-full px-4 py-2 text-[16px] font-medium transition-colors ${
              activeTab === tab
                ? "border-[1.5px] border-gray-dark bg-[#222222]/5 text-gray-dark"
                : "border-[1.5px] border-transparent bg-[#222222]/5 text-gray-dark hover:bg-[#222222]/[0.08]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[160px] rounded-xl bg-[#F5F5F5]"
            style={dashedBorderStyle}
          />
        ))}
      </div>
    </div>
  );
}
