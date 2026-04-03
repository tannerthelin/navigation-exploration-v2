import { NavLink } from "react-router-dom";
import { useState } from "react";
import PageShell from "../components/PageShell";
import event1 from "../assets/placeholder images/placeholder-event-01.png";
import event2 from "../assets/placeholder images/placeholder-event-02.png";
import event3 from "../assets/placeholder images/placeholder-event-03.png";
import eventImage from "../assets/img/EventImage.avif";
import playIcon from "../assets/icons/play.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";

// ─── Data ────────────────────────────────────────────────────────────────────

type SessionState = "past-recording" | "past-pending" | "live" | "soon" | "future";

type Session = {
  id: number;
  title: string;
  date: string;
  startTime: Date;
  endTime: Date;
  duration: string;
  recordingUrl?: string;
};

type LiveCourse = {
  type: "live";
  id: number;
  title: string;
  cohortLabel: string;
  cohortDates: string;
  enrolledCount: number;
  registrants: string[];
  sessions: Session[];
  image: string;
  instructor: { name: string; avatar: string };
};

type SelfPacedCourse = {
  type: "selfPaced";
  id: number;
  title: string;
  image: string;
  percentComplete: number;
  totalTime: string;
};

type EnrolledCourse = LiveCourse | SelfPacedCourse;

function getSessionState(session: Session): SessionState {
  const now = new Date();
  if (session.endTime < now) {
    return session.recordingUrl ? "past-recording" : "past-pending";
  }
  if (session.startTime.getTime() - now.getTime() <= 30 * 60 * 1000) return "live";
  if (session.startTime.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) return "soon";
  return "future";
}

function sortKey(course: EnrolledCourse): number {
  if (course.type === "live") {
    const nextSession = course.sessions.find((s) => {
      const state = getSessionState(s);
      return state === "live" || state === "soon" || state === "future";
    });
    if (nextSession) return nextSession.startTime.getTime();
    return Number.MAX_SAFE_INTEGER;
  }
  if (course.percentComplete >= 100) return Number.MAX_SAFE_INTEGER;
  return Number.MAX_SAFE_INTEGER / 2;
}

// Session 4 of course 1 is "live now" (starts in 15 min)
const liveSessionStart = new Date(Date.now() + 15 * 60 * 1000);
const liveSessionEnd = new Date(Date.now() + 105 * 60 * 1000);

const enrolledCourses: EnrolledCourse[] = ([
  {
    type: "live" as const,
    id: 1,
    title: "MBA Admissions Strategy Bootcamp",
    cohortLabel: "Cohort 3",
    cohortDates: "Mar 12 – Apr 23, 2026",
    enrolledCount: 24,
    registrants: [pic1, pic3, pic4],
    image: event1,
    instructor: { name: "Sarah Chen", avatar: pic2 },
    sessions: [
      {
        id: 101, title: "Introduction & Goal Setting",
        date: "Mar 12", duration: "90 min",
        startTime: new Date("2026-03-12T17:00:00"),
        endTime: new Date("2026-03-12T18:30:00"),
        recordingUrl: "#",
      },
      {
        id: 102, title: "School Selection Strategy",
        date: "Mar 19", duration: "90 min",
        startTime: new Date("2026-03-19T17:00:00"),
        endTime: new Date("2026-03-19T18:30:00"),
      },
      {
        id: 103, title: "Crafting Your Story",
        date: "Mar 26", duration: "90 min",
        startTime: new Date("2026-03-26T17:00:00"),
        endTime: new Date("2026-03-26T18:30:00"),
        recordingUrl: "#",
      },
      {
        id: 104, title: "Building Your Narrative",
        date: "Today", duration: "90 min",
        startTime: liveSessionStart,
        endTime: liveSessionEnd,
      },
      {
        id: 105, title: "Essays & Short Answers",
        date: "Apr 9", duration: "90 min",
        startTime: new Date("2026-04-09T17:00:00"),
        endTime: new Date("2026-04-09T18:30:00"),
      },
      {
        id: 106, title: "Final Q&A & Wrap-Up",
        date: "Apr 23", duration: "60 min",
        startTime: new Date("2026-04-23T17:00:00"),
        endTime: new Date("2026-04-23T18:00:00"),
      },
    ],
  },
  {
    type: "live" as const,
    id: 2,
    title: "GMAT Exam Prep Bootcamp",
    cohortLabel: "Cohort 1",
    cohortDates: "Apr 7 – May 19, 2026",
    enrolledCount: 31,
    registrants: [pic5, pic6, pic3],
    image: event2,
    instructor: { name: "James Park", avatar: pic7 },
    sessions: [
      {
        id: 201, title: "Quantitative Reasoning Foundations",
        date: "Apr 7", duration: "60 min",
        startTime: new Date("2026-04-07T16:00:00"),
        endTime: new Date("2026-04-07T17:00:00"),
      },
      {
        id: 202, title: "Verbal Reasoning Deep Dive",
        date: "Apr 14", duration: "60 min",
        startTime: new Date("2026-04-14T16:00:00"),
        endTime: new Date("2026-04-14T17:00:00"),
      },
      {
        id: 203, title: "Data Insights & Problem Solving",
        date: "Apr 21", duration: "60 min",
        startTime: new Date("2026-04-21T16:00:00"),
        endTime: new Date("2026-04-21T17:00:00"),
      },
      {
        id: 204, title: "Practice Test Review",
        date: "Apr 28", duration: "60 min",
        startTime: new Date("2026-04-28T16:00:00"),
        endTime: new Date("2026-04-28T17:00:00"),
      },
      {
        id: 205, title: "Timing & Test Strategy",
        date: "May 5", duration: "60 min",
        startTime: new Date("2026-05-05T16:00:00"),
        endTime: new Date("2026-05-05T17:00:00"),
      },
      {
        id: 206, title: "Final Mock Exam & Debrief",
        date: "May 12", duration: "90 min",
        startTime: new Date("2026-05-12T16:00:00"),
        endTime: new Date("2026-05-12T17:30:00"),
      },
      {
        id: 207, title: "Score Submission Strategy",
        date: "May 19", duration: "60 min",
        startTime: new Date("2026-05-19T16:00:00"),
        endTime: new Date("2026-05-19T17:00:00"),
      },
    ],
  },
  {
    type: "live" as const,
    id: 5,
    title: "Tech PM Interview Accelerator",
    cohortLabel: "Cohort 2",
    cohortDates: "Jan 6 – Feb 3, 2026",
    enrolledCount: 18,
    registrants: [pic4, pic1, pic6],
    image: eventImage,
    instructor: { name: "Maria Torres", avatar: pic5 },
    sessions: [
      {
        id: 501, title: "PM Fundamentals",
        date: "Jan 6", duration: "60 min",
        startTime: new Date("2026-01-06T17:00:00"),
        endTime: new Date("2026-01-06T18:00:00"),
        recordingUrl: "#",
      },
      {
        id: 502, title: "Product Sense & Design",
        date: "Jan 13", duration: "60 min",
        startTime: new Date("2026-01-13T17:00:00"),
        endTime: new Date("2026-01-13T18:00:00"),
        recordingUrl: "#",
      },
      {
        id: 503, title: "Metrics & Analytical Questions",
        date: "Jan 20", duration: "60 min",
        startTime: new Date("2026-01-20T17:00:00"),
        endTime: new Date("2026-01-20T18:00:00"),
        recordingUrl: "#",
      },
      {
        id: 504, title: "Behavioral & Leadership",
        date: "Jan 27", duration: "60 min",
        startTime: new Date("2026-01-27T17:00:00"),
        endTime: new Date("2026-01-27T18:00:00"),
        recordingUrl: "#",
      },
      {
        id: 505, title: "Mock Interviews & Debrief",
        date: "Feb 3", duration: "90 min",
        startTime: new Date("2026-02-03T17:00:00"),
        endTime: new Date("2026-02-03T18:30:00"),
        recordingUrl: "#",
      },
    ],
  },
  {
    type: "selfPaced",
    id: 3,
    title: "Nail the Google PM Interview Cycle",
    image: event3,
    percentComplete: 65,
    totalTime: "7 hours",
  },
  {
    type: "selfPaced",
    id: 4,
    title: "Consulting Case Interview Mastery",
    image: eventImage,
    percentComplete: 20,
    totalTime: "6 hours",
  },
  {
    type: "selfPaced",
    id: 6,
    title: "MBA Application Essay Masterclass",
    image: event1,
    percentComplete: 100,
    totalTime: "4 hours",
  },
] as EnrolledCourse[]).sort((a, b) => sortKey(a) - sortKey(b));

const suggestedCourses = [
  { title: "Stanford MBA Application Workshop", type: "Live cohort", duration: "4 weeks", enrolledCount: "24 enrolled", image: event1 },
  { title: "Product Management Fundamentals", type: "Self-paced", duration: "8h", enrolledCount: null, image: event2 },
  { title: "Finance for Non-Finance MBAs", type: "Live cohort", duration: "3 weeks", enrolledCount: "18 enrolled", image: event3 },
  { title: "Leadership & Organizational Behavior", type: "Self-paced", duration: "6h", enrolledCount: null, image: eventImage },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatStartsIn(ms: number): string {
  const totalMins = Math.floor(ms / 60000);
  const days = Math.floor(totalMins / (60 * 24));
  const hours = Math.floor((totalMins % (60 * 24)) / 60);
  if (days > 0 && hours > 0) return `Starts in ${days}d ${hours}h`;
  if (days > 0) return `Starts in ${days}d`;
  return `Starts in ${hours}h`;
}

// ─── Session CTA ──────────────────────────────────────────────────────────────

function SessionCTA({ session }: { session: Session }) {
  const state = getSessionState(session);
  if (state === "live") {
    return (
      <button className="h-[30px] cursor-pointer rounded-lg bg-[#038561] px-3 text-[13px] font-medium text-white transition-colors hover:bg-[#038561]/90 whitespace-nowrap">
        Join now
      </button>
    );
  }
  if (state === "past-recording") {
    return (
      <button className="flex h-[28px] cursor-pointer items-center gap-1.5 rounded-lg border border-gray-stroke bg-white px-3 text-[12px] font-medium text-gray-dark transition-colors hover:bg-gray-hover whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-[#038561] shrink-0" />
        View recording
      </button>
    );
  }
  if (state === "past-pending") {
    return (
      <button className="flex h-[28px] cursor-pointer items-center gap-1.5 rounded-lg border border-gray-stroke bg-white px-3 text-[12px] font-medium text-gray-dark transition-colors hover:bg-gray-hover whitespace-nowrap" disabled>
        <span className="h-1.5 w-1.5 rounded-full bg-gray-stroke shrink-0" />
        Check back soon
      </button>
    );
  }
  if (state === "soon") {
    const ms = session.startTime.getTime() - Date.now();
    return (
      <span className="inline-flex h-[22px] items-center rounded-full bg-[#fdf0e1] px-2.5 text-[11.5px] font-medium text-[#ef8509] whitespace-nowrap">
        {formatStartsIn(ms)}
      </span>
    );
  }
  return (
    <span className="inline-flex h-[22px] items-center rounded-full bg-gray-hover px-2.5 text-[11.5px] font-medium text-[#9b9b9b] whitespace-nowrap">
      {session.date}
    </span>
  );
}

// ─── Session row ──────────────────────────────────────────────────────────────

function SessionRow({ session, index }: { session: Session; index: number }) {
  const state = getSessionState(session);
  const isPast = state === "past-recording" || state === "past-pending";
  const isLive = state === "live";

  return (
    <div
      className={`flex items-center gap-3 border-t border-gray-stroke px-5 py-[11px] transition-colors ${
        isLive ? "bg-[rgba(227,246,239,0.35)]" : ""
      } ${isPast ? "opacity-45" : ""}`}
    >
      <div
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border text-[11px] font-medium ${
          isLive
            ? "border-[#038561] bg-[#e3f6ef] text-[#185440]"
            : "border-gray-stroke bg-gray-hover text-[#9b9b9b]"
        }`}
      >
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-gray-dark">{session.title}</p>
        <p className="mt-0.5 text-[12px] text-[#9b9b9b]">{session.date} · {session.duration}</p>
      </div>
      <div className="shrink-0">
        <SessionCTA session={session} />
      </div>
    </div>
  );
}

// ─── Live course card ─────────────────────────────────────────────────────────

function LiveCourseCard({ course }: { course: LiveCourse }) {
  const isCompleted = course.sessions.every((s) => {
    const state = getSessionState(s);
    return state === "past-recording" || state === "past-pending";
  });

  const [sessionsOpen, setSessionsOpen] = useState(!isCompleted);

  // Find the next upcoming/live session to pin above the accordion
  const nextSessionIndex = course.sessions.findIndex((s) => {
    const state = getSessionState(s);
    return state === "live" || state === "soon" || state === "future";
  });
  const nextSession = nextSessionIndex !== -1 ? course.sessions[nextSessionIndex] : null;

  return (
    <div className={`overflow-hidden rounded-xl border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ${isCompleted ? "opacity-75" : ""}`}>

      {/* Zone 1: Header */}
      <div className="flex gap-4 p-5">
        {/* Thumbnail */}
        <div className="h-[54px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-gray-stroke">
          <img src={course.image} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Title + badges + instructor */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e3f6ef] px-2.5 py-0.5 text-[12px] font-medium text-[#185440]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#038561] shrink-0" />
              Live cohort
            </span>
          </div>
          <p className="truncate text-[17px] font-semibold leading-snug text-gray-dark">{course.title}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <img src={course.instructor.avatar} alt="" className="h-5 w-5 rounded-full object-cover shrink-0" />
            <span className="text-[13px] text-gray-light">{course.instructor.name}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <a href="#" className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-stroke bg-white px-3.5 text-[13px] font-medium text-gray-dark transition-colors hover:bg-gray-hover whitespace-nowrap">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="opacity-50 shrink-0">
              <path d="M2 2h10v10H2V2zm0 3h10M5 2v10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Syllabus
          </a>
          <a href="#" className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-stroke bg-white px-3.5 text-[13px] font-medium text-gray-dark transition-colors hover:bg-gray-hover whitespace-nowrap">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="opacity-50 shrink-0">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5.5 5l3 2-3 2V5z" fill="currentColor" />
            </svg>
            Recordings
          </a>
        </div>
      </div>

      {/* Zone 2: Cohort strip */}
      <div className="flex flex-wrap items-center gap-0 border-t border-b border-gray-stroke bg-gray-hover px-5 py-2.5">
        <div className="flex flex-col gap-0.5 border-r border-gray-stroke pr-4 mr-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#9b9b9b]">Cohort</span>
          <span className="text-[13px] font-medium text-gray-dark">{course.cohortLabel}</span>
        </div>
        <div className="flex flex-col gap-0.5 border-r border-gray-stroke pr-4 mr-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#9b9b9b]">Dates</span>
          <span className="text-[13px] font-medium text-gray-dark">{course.cohortDates}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#9b9b9b]">Enrolled</span>
          <span className="text-[13px] font-medium text-gray-dark">{course.enrolledCount} people</span>
        </div>
      </div>

      {/* Pinned next session (always visible) */}
      {nextSession && (
        <SessionRow session={nextSession} index={nextSessionIndex} />
      )}

      {/* Zone 3: Sessions accordion toggle */}
      <button
        onClick={() => setSessionsOpen(!sessionsOpen)}
        className="flex w-full items-center justify-between border-t border-gray-stroke px-5 py-[11px] transition-colors hover:bg-gray-hover"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-gray-dark">Sessions</span>
          <span className="inline-flex min-w-[28px] items-center justify-center rounded-full border border-gray-stroke bg-gray-hover px-2 py-px text-[11px] font-medium text-gray-light">
            {course.sessions.length}
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className={`shrink-0 text-[#9b9b9b] transition-transform ${sessionsOpen ? "rotate-180" : ""}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Sessions list */}
      {sessionsOpen && (
        <div>
          {course.sessions.map((session, i) => (
            <SessionRow key={session.id} session={session} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

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
        <h3 className="mt-1 text-[18px] font-medium leading-[1.2] text-gray-dark">
          {course.title}
        </h3>
        <div className="mt-3 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[14px] text-[#707070]">{course.percentComplete}% complete</p>
              <p className="text-[14px] text-[#9B9B9B]">{course.totalTime}</p>
            </div>
            <div className="h-[6px] w-full rounded-full bg-[#E5E5E5]">
              <div
                className="h-full rounded-full bg-[#038561] transition-all"
                style={{ width: `${course.percentComplete}%` }}
              />
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
    <div className="group flex cursor-pointer items-center gap-3">
      <div className="w-[108px] shrink-0 overflow-hidden rounded-[6px]">
        <img src={course.image} alt="" className="aspect-[120/63] w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[15px] font-medium leading-snug text-gray-dark transition-opacity group-hover:opacity-70">
          {course.title}
        </p>
        <p className="mt-0.5 text-[13px] text-[#707070]">
          {course.type} · {course.duration}
        </p>
        {course.enrolledCount && (
          <p className="text-[13px] text-[#707070]">{course.enrolledCount}</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Filter = "all" | "live" | "selfPaced";

export default function MyCourses() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleCourses = filter === "all"
    ? enrolledCourses
    : enrolledCourses.filter((c) => c.type === (filter === "live" ? "live" : "selfPaced"));

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
        {suggestedCourses.map((course, i) => (
          <SuggestedCourseCard key={i} course={course} />
        ))}
      </div>
    </>
  );

  return (
    <PageShell rightSidebar={suggestedCoursesSection}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-medium text-gray-dark leading-[1.1] md:text-[40px]">
          My Courses
        </h1>
        <div className="flex rounded-lg border border-gray-stroke/50 bg-gray-hover p-0.5 text-[14px] font-medium">
          {(["all", "live", "selfPaced"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-md px-3 py-1.5 transition-colors ${
                filter === f
                  ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  : "text-[#707070] hover:text-gray-dark"
              }`}
            >
              {f === "all" ? "All" : f === "live" ? "Live" : "Self-paced"}
            </button>
          ))}
        </div>
      </div>

      {/* Live cohort cards */}
      <div className="mt-6 flex flex-col gap-4">
        {visibleCourses
          .filter((c) => c.type === "live")
          .map((course) => (
            <LiveCourseCard key={course.id} course={course as LiveCourse} />
          ))}
      </div>

      {/* Self-paced courses */}
      {visibleCourses.some((c) => c.type === "selfPaced") && (
        <div className={`border-t border-gray-stroke/50 ${visibleCourses.some((c) => c.type === "live") ? "mt-6" : "mt-0"}`}>
          {visibleCourses
            .filter((c) => c.type === "selfPaced")
            .map((course) => (
              <SelfPacedCourseCard key={course.id} course={course as SelfPacedCourse} />
            ))}
        </div>
      )}
    </PageShell>
  );
}
