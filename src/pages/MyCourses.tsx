import { NavLink } from "react-router-dom";
import { useState } from "react";
import PageShell from "../components/PageShell";
import LiveCourseCard, { LiveCourse, TimeSlot, getSessionState } from "../components/LiveCourseCard";
import { useSessionLayout } from "../components/SessionLayoutContext";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";
import eventImage from "../assets/img/EventImage.avif";
import playIcon from "../assets/icons/play.svg";
import playVideoIcon from "../assets/icons/play-video.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";

// ─── Data ────────────────────────────────────────────────────────────────────

type SelfPacedCourse = {
  type: "selfPaced";
  id: number;
  title: string;
  image: string;
  percentComplete: number;
  totalTime: string;
};

type EnrolledCourse = LiveCourse | SelfPacedCourse;

function sortKey(course: EnrolledCourse): number {
  if (course.type === "live") {
    const next = course.sessions.find((s) => {
      const st = getSessionState(s.slots[0]);
      return st === "live" || st === "soon" || st === "future";
    });
    if (next) return next.slots[0].startTime.getTime();
    return Number.MAX_SAFE_INTEGER;
  }
  if (course.percentComplete >= 100) return Number.MAX_SAFE_INTEGER;
  return Number.MAX_SAFE_INTEGER / 2;
}

const liveNow = new Date(Date.now() + 15 * 60 * 1000);
const liveEnd = new Date(Date.now() + 105 * 60 * 1000);
const eveningSoon = new Date(Date.now() + 3 * 60 * 60 * 1000);
const eveningSoonEnd = new Date(Date.now() + 4.5 * 60 * 60 * 1000);

const enrolledCourses: EnrolledCourse[] = ([
  {
    type: "live" as const,
    id: 1,
    title: "MBA Admissions Strategy Bootcamp",
    cohortDateLabel: "Spring admissions",
    cohortDates: "Mar 12 – Apr 23, 2026",
    registrants: [pic1, pic3, pic4],
    image: event1,
    sessions: [
      { id: 101, title: "Introduction & Goal Setting", duration: "90 min", slots: [
        { id: 1010, startTime: new Date("2026-03-12T09:00:00"), endTime: new Date("2026-03-12T10:30:00"), recordingUrl: "#" },
        { id: 1011, startTime: new Date("2026-03-12T19:00:00"), endTime: new Date("2026-03-12T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 102, title: "School Selection Strategy", duration: "90 min", slots: [
        { id: 1020, startTime: new Date("2026-03-19T09:00:00"), endTime: new Date("2026-03-19T10:30:00"), recordingUrl: "#" },
        { id: 1021, startTime: new Date("2026-03-19T19:00:00"), endTime: new Date("2026-03-19T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 103, title: "Crafting Your Story", duration: "90 min", slots: [
        { id: 1030, startTime: new Date("2026-03-26T09:00:00"), endTime: new Date("2026-03-26T10:30:00"), recordingUrl: "#" },
        { id: 1031, startTime: new Date("2026-03-26T19:00:00"), endTime: new Date("2026-03-26T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 104, title: "Building Your Narrative", duration: "90 min", slots: [
        { id: 1040, startTime: liveNow, endTime: liveEnd },
        { id: 1041, startTime: eveningSoon, endTime: eveningSoonEnd },
      ] as [TimeSlot, TimeSlot] },
      { id: 105, title: "Essays & Short Answers", duration: "90 min", slots: [
        { id: 1050, startTime: new Date("2026-04-09T09:00:00"), endTime: new Date("2026-04-09T10:30:00") },
        { id: 1051, startTime: new Date("2026-04-09T19:00:00"), endTime: new Date("2026-04-09T20:30:00") },
      ] as [TimeSlot, TimeSlot] },
      { id: 106, title: "Final Q&A & Wrap-Up", duration: "60 min", slots: [
        { id: 1060, startTime: new Date("2026-04-23T09:00:00"), endTime: new Date("2026-04-23T10:00:00") },
        { id: 1061, startTime: new Date("2026-04-23T19:00:00"), endTime: new Date("2026-04-23T20:00:00") },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  {
    type: "live" as const,
    id: 7,
    title: "Law School Admissions Bootcamp",
    cohortDateLabel: "Fall admissions",
    cohortDates: "May 5 – Jun 9, 2026",
    registrants: [pic3, pic5, pic1],
    image: event3,
    cohortSelected: false,
    sessions: [],
  },
  {
    type: "live" as const,
    id: 5,
    title: "Tech PM Interview Accelerator",
    cohortDateLabel: "Winter cohort",
    cohortDates: "Jan 6 – Feb 3, 2026",
    registrants: [pic4, pic1, pic6],
    image: eventImage,
    sessions: [
      { id: 501, title: "PM Fundamentals", duration: "60 min", slots: [
        { id: 5010, startTime: new Date("2026-01-06T09:00:00"), endTime: new Date("2026-01-06T10:00:00"), recordingUrl: "#" },
        { id: 5011, startTime: new Date("2026-01-06T19:00:00"), endTime: new Date("2026-01-06T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 502, title: "Product Sense & Design", duration: "60 min", slots: [
        { id: 5020, startTime: new Date("2026-01-13T09:00:00"), endTime: new Date("2026-01-13T10:00:00"), recordingUrl: "#" },
        { id: 5021, startTime: new Date("2026-01-13T19:00:00"), endTime: new Date("2026-01-13T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 503, title: "Metrics & Analytical Questions", duration: "60 min", slots: [
        { id: 5030, startTime: new Date("2026-01-20T09:00:00"), endTime: new Date("2026-01-20T10:00:00"), recordingUrl: "#" },
        { id: 5031, startTime: new Date("2026-01-20T19:00:00"), endTime: new Date("2026-01-20T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 504, title: "Behavioral & Leadership", duration: "60 min", slots: [
        { id: 5040, startTime: new Date("2026-01-27T09:00:00"), endTime: new Date("2026-01-27T10:00:00"), recordingUrl: "#" },
        { id: 5041, startTime: new Date("2026-01-27T19:00:00"), endTime: new Date("2026-01-27T20:00:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
      { id: 505, title: "Mock Interviews & Debrief", duration: "90 min", slots: [
        { id: 5050, startTime: new Date("2026-02-03T09:00:00"), endTime: new Date("2026-02-03T10:30:00"), recordingUrl: "#" },
        { id: 5051, startTime: new Date("2026-02-03T19:00:00"), endTime: new Date("2026-02-03T20:30:00"), recordingUrl: "#" },
      ] as [TimeSlot, TimeSlot] },
    ],
  },
  { type: "selfPaced" as const, id: 3, title: "Nail the Google PM Interview Cycle", image: event3, percentComplete: 65, totalTime: "7 hours" },
  { type: "selfPaced" as const, id: 4, title: "Consulting Case Interview Mastery", image: eventImage, percentComplete: 20, totalTime: "6 hours" },
  { type: "selfPaced" as const, id: 6, title: "MBA Application Essay Masterclass", image: event1, percentComplete: 100, totalTime: "4 hours" },
] as EnrolledCourse[]).sort((a, b) => sortKey(a) - sortKey(b));

const suggestedCourses = [
  { title: "Stanford MBA Application Workshop", type: "Live cohort", duration: "4 weeks", enrolledCount: "24 enrolled", image: event1 },
  { title: "Product Management Fundamentals", type: "Self-paced", duration: "8h", enrolledCount: null, image: event2 },
  { title: "Finance for Non-Finance MBAs", type: "Live cohort", duration: "3 weeks", enrolledCount: "18 enrolled", image: event3 },
  { title: "Leadership & Organizational Behavior", type: "Self-paced", duration: "6h", enrolledCount: null, image: eventImage },
];

// ─── Self-paced card ──────────────────────────────────────────────────────────

function SelfPacedCourseCard({ course }: { course: SelfPacedCourse }) {
  const isCompleted = course.percentComplete >= 100;
  const isNotStarted = course.percentComplete === 0;
  return (
    <div className="flex gap-5 border-b border-gray-stroke/50 py-6">
      <div className="w-1/2 shrink-0 md:w-[220px]">
        <img
          src={course.image}
          alt=""
          className={`aspect-[120/63] w-full rounded-lg object-cover${isCompleted ? " opacity-50" : ""}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-2">
          <img src={playIcon} alt="" className="h-[20px] w-[20px] shrink-0" />
          <span className="text-[14px] text-[#707070]">Self-paced</span>
        </div>
        <h3 className="mt-1 text-[18px] font-medium leading-[1.2] text-gray-dark">{course.title}</h3>
        <div className="mt-3 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[14px] text-[#707070]">{course.percentComplete}% complete</p>
              <p className="text-[14px] text-[#9B9B9B]">{course.totalTime}</p>
            </div>
            <div className="h-[6px] w-full rounded-full bg-[#E5E5E5]">
              <div className="h-full rounded-full bg-[#038561] transition-all" style={{ width: `${course.percentComplete}%` }} />
            </div>
          </div>
          {isCompleted ? (
            <button className="hidden shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-hover bg-gray-hover px-4 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:border-gray-stroke hover:bg-white md:flex">
              View
            </button>
          ) : (
            <button className="hidden shrink-0 cursor-pointer rounded-lg bg-[#038561] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#038561]/90 md:block">
              {isNotStarted ? "Start" : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Suggested course card ────────────────────────────────────────────────────

function SuggestedCourseCard({ course }: { course: (typeof suggestedCourses)[0] }) {
  return (
    <div className="group flex cursor-pointer items-center gap-4">
      {/* Thumbnail: 122×64 fixed */}
      <div className="h-16 w-[122px] shrink-0 overflow-hidden rounded-lg">
        <img src={course.image} alt="" className="h-full w-full object-cover" />
      </div>
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Title */}
        <p className="overflow-hidden text-ellipsis text-[16px] font-medium leading-[1.2] text-gray-dark transition-opacity group-hover:opacity-70" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {course.title}
        </p>
        {/* Icon + type · duration */}
        <div className="flex items-center gap-1.5">
          {course.type === "Self-paced" ? (
            <img src={playVideoIcon} alt="" className="h-[18px] w-[18px] shrink-0 opacity-50" />
          ) : (
            <div className="flex items-center pr-1.5">
              {[pic1, pic2, pic3].map((avatar, i) => (
                <div key={i} className="-mr-1.5 h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full border border-white">
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[1.2] text-[#707070]">
            {course.type} · {course.duration}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Variant = "simple" | "grouped";

export default function MyCourses() {
  const { setSimpleSessionLayout } = useSessionLayout();
  const [variant, setVariant] = useState<Variant>("simple");

  function applyVariant(v: Variant) {
    setVariant(v);
    setSimpleSessionLayout(v === "grouped");
  }

  const suggestedCoursesSection = (
    <>
      <NavLink
        to="/browse"
        className="flex items-center gap-1.5 text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-opacity hover:opacity-80"
      >
        Suggested courses
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </NavLink>
      <div className="mt-4 flex flex-col gap-5">
        {suggestedCourses.map((course, i) => <SuggestedCourseCard key={i} course={course} />)}
      </div>
    </>
  );

  return (
    <PageShell rightSidebar={suggestedCoursesSection}>
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-medium leading-[1.1] text-gray-dark md:text-[40px]">My Courses</h1>
        <div className="flex rounded-lg border border-gray-stroke/50 bg-gray-hover p-0.5 text-[14px] font-medium">
          {(["simple", "grouped"] as Variant[]).map((v) => (
            <button
              key={v}
              onClick={() => applyVariant(v)}
              className={`cursor-pointer rounded-md px-3 py-1.5 capitalize transition-colors ${
                variant === v ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#707070] hover:text-gray-dark"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Live cohort cards */}
      <div className="mt-8 flex flex-col gap-8">
        {enrolledCourses
          .filter((c) => c.type === "live")
          .map((course) => <LiveCourseCard key={course.id} course={course as LiveCourse} />)}
      </div>

      {/* Self-paced courses */}
      {enrolledCourses.some((c) => c.type === "selfPaced") && (
        <div className={`border-t border-gray-stroke/50 ${enrolledCourses.some((c) => c.type === "live") ? "mt-8" : "mt-0"}`}>
          <p className="pt-8 text-[14px] font-medium uppercase tracking-[0.1em] text-[#707070]">Self-paced</p>
          {enrolledCourses
            .filter((c) => c.type === "selfPaced")
            .map((course) => <SelfPacedCourseCard key={course.id} course={course as SelfPacedCourse} />)}
        </div>
      )}
    </PageShell>
  );
}
