import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SessionCard from "./SessionCard";
import { useSessionLayout } from "./SessionLayoutContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimeSlot = {
  id: number;
  startTime: Date;
  endTime: Date;
  joinUrl?: string;
  recordingUrl?: string;
};

export type Session = {
  id: number;
  title: string;
  duration: string;
  slots: [TimeSlot, TimeSlot]; // [morning, evening]
};

export type LiveCourse = {
  type: "live";
  id: number;
  title: string;
  cohortDateLabel: string;
  cohortDates: string;
  registrants: string[];
  sessions: Session[];
  image: string;
  cohortSelected?: boolean;
};

type SessionState = "past-recording" | "past-pending" | "live" | "soon" | "future";

export function getSessionState(slot: TimeSlot): SessionState {
  const now = new Date();
  if (slot.endTime < now) return slot.recordingUrl ? "past-recording" : "past-pending";
  if (slot.startTime.getTime() - now.getTime() <= 30 * 60 * 1000) return "live";
  if (slot.startTime.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) return "soon";
  return "future";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatStartsIn(ms: number): string {
  const totalMins = Math.floor(ms / 60000);
  const days = Math.floor(totalMins / (60 * 24));
  const hours = Math.floor((totalMins % (60 * 24)) / 60);
  if (days > 0 && hours > 0) return `Starts in ${days}d ${hours}h`;
  if (days > 0) return `Starts in ${days}d`;
  return `Starts in ${hours}h`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatSlotDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " at " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ─── Figma icon assets ────────────────────────────────────────────────────────

const figmaSyllabusIcon = "https://www.figma.com/api/mcp/asset/6eb7cc2d-90b9-49e5-9d0b-541c668a79f0";
const figmaPlayIcon = "https://www.figma.com/api/mcp/asset/dab3b9c4-442a-4fe1-b04e-5026b09d9843";
const figmaSlack1 = "https://www.figma.com/api/mcp/asset/c66c77e8-363b-4742-87f2-1fb9b18416c0";
const figmaSlack2 = "https://www.figma.com/api/mcp/asset/9453f0d5-c53a-4128-b604-1ff16db95a9f";
const figmaSlack3 = "https://www.figma.com/api/mcp/asset/a51db8bb-c981-4b77-a5dc-761d347a7019";
const figmaSlack4 = "https://www.figma.com/api/mcp/asset/d6fb8824-812f-4b5c-8d90-5b56cb53286a";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SlackIcon() {
  return (
    <div className="relative h-5 w-5 shrink-0 overflow-hidden">
      <div className="absolute inset-[10%]">
        <div className="absolute inset-[52.14%_52.15%_10.01%_10%]">
          <img alt="" className="absolute block max-w-none size-full" src={figmaSlack1} />
        </div>
        <div className="absolute inset-[10%_52.15%_52.14%_10%]">
          <img alt="" className="absolute block max-w-none size-full" src={figmaSlack2} />
        </div>
        <div className="absolute inset-[10%_10%_52.14%_52.15%]">
          <img alt="" className="absolute block max-w-none size-full" src={figmaSlack3} />
        </div>
        <div className="absolute inset-[52.14%_10%_10%_52.15%]">
          <img alt="" className="absolute block max-w-none size-full" src={figmaSlack4} />
        </div>
      </div>
    </div>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-hover px-3 py-2 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#ebebeb]">
      {icon}
      {label}
    </button>
  );
}

// ─── Session rows ─────────────────────────────────────────────────────────────

const SLOT_TIME_LABELS = ["9:00 AM", "7:00 PM"] as const;

function SessionRowSimple({ session, isNext }: { session: Session; index: number; isNext: boolean; isFirst?: boolean }) {
  const slots = session.slots.map((slot) => {
    const state = getSessionState(slot);
    return {
      slot,
      state,
      status: (state === "live" ? "live" : (state === "past-recording" || state === "past-pending") ? "past" : "upcoming") as "live" | "upcoming" | "past",
      startsInText: isNext && (state === "soon" || state === "future")
        ? formatStartsIn(slot.startTime.getTime() - Date.now()).replace("Starts in ", "")
        : undefined,
    };
  });

  return (
    <div className="flex items-stretch px-2 sm:px-3">
      {/* Left OR bracket connector */}
      <div className="flex shrink-0 flex-col items-end justify-center py-5 pl-2">
        <div className="h-[30px] w-2 border-l border-t border-dashed border-[#9b9b9b]" />
        <span className="py-2 text-[14px] font-medium uppercase tracking-[0.1em] text-[#9b9b9b]">or</span>
        <div className="h-[30px] w-2 border-l border-b border-dashed border-[#9b9b9b]" />
      </div>
      {/* Session cards */}
      <div className="min-w-0 flex-1">
        {slots.map(({ slot, state, status, startsInText }, slotIndex) => (
          <SessionCard
            key={slot.id}
            title={`${session.title} – ${SLOT_TIME_LABELS[slotIndex] ?? formatTime(slot.startTime)}`}
            dateTime={formatSlotDateTime(slot.startTime)}
            duration={session.duration}
            image=""
            type="event"
            status={status}
            startsIn={startsInText}
            hasRecording={state === "past-recording"}
            hideImage
          />
        ))}
      </div>
    </div>
  );
}

function SessionRow({ session, isNext }: { session: Session; isNext: boolean; isFirst?: boolean }) {
  return (
    <div className="px-2 sm:px-3">
      {session.slots.map((slot, slotIndex) => {
        const state = getSessionState(slot);
        const status: "live" | "upcoming" | "past" =
          state === "live" ? "live" : (state === "past-recording" || state === "past-pending") ? "past" : "upcoming";
        const startsInText = isNext && (state === "soon" || state === "future")
          ? formatStartsIn(slot.startTime.getTime() - Date.now()).replace("Starts in ", "")
          : undefined;
        return (
          <SessionCard
            key={slot.id}
            title={`${session.title} – ${SLOT_TIME_LABELS[slotIndex] ?? formatTime(slot.startTime)}`}
            dateTime={formatSlotDateTime(slot.startTime)}
            duration={session.duration}
            image=""
            type="event"
            status={status}
            startsIn={startsInText}
            hasRecording={state === "past-recording"}
            hideImage
          />
        );
      })}
    </div>
  );
}

// ─── Select Cohort Modal ──────────────────────────────────────────────────────

const mockCohorts = [
  { id: 1, dates: "May 5 – Jun 9, 2026",   days: "Tuesdays & Thursdays", time: "7:00 PM PT", urgencyTag: "6 days left to enroll" },
  { id: 2, dates: "Jul 7 – Aug 11, 2026",  days: "Mondays & Wednesdays",  time: "9:00 AM PT", urgencyTag: null },
  { id: 3, dates: "Sep 8 – Oct 13, 2026",  days: "Tuesdays & Thursdays", time: "7:00 PM PT", urgencyTag: null },
];

function SelectCohortModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          {/* Panel — bottom sheet on mobile, centered on sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[480px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-stroke px-5 py-4">
              <h2 className="text-[18px] font-medium text-gray-dark">Select a cohort</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Cohort list */}
            <div className="divide-y divide-gray-stroke">
              {mockCohorts.map((cohort) => (
                <div key={cohort.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">{cohort.dates}</p>
                    <p className="text-[14px] leading-[1.3] text-gray-light">{cohort.days} · {cohort.time}</p>
                    {cohort.urgencyTag && (
                      <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[14px] font-medium text-[#92400E]">
                        {cohort.urgencyTag}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { onSelect(); onClose(); }}
                    className="shrink-0 rounded-lg bg-gray-dark px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-[#444444]"
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-stroke px-5 py-4">
              <p className="text-[14px] text-gray-light">
                Don't see a time that works?{" "}
                <a href="#" className="font-medium text-gray-dark underline">Get notified about future cohorts</a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Live course card ─────────────────────────────────────────────────────────

export default function LiveCourseCard({ course }: { course: LiveCourse }) {
  const { simpleSessionLayout } = useSessionLayout();
  const isCompleted = course.sessions.length > 0 && course.sessions.every((s) =>
    s.slots.every((slot) => {
      const st = getSessionState(slot);
      return st === "past-recording" || st === "past-pending";
    })
  );
  const nextSession = course.sessions.find((s) =>
    s.slots.some((slot) => {
      const st = getSessionState(slot);
      return st === "live" || st === "soon" || st === "future";
    })
  );
  const [sessionsOpen, setSessionsOpen] = useState(!isCompleted);
  const [cohortSelected, setCohortSelected] = useState(course.cohortSelected ?? true);
  const [cohortModalOpen, setCohortModalOpen] = useState(false);

  const actionButtons = cohortSelected ? (
    <>
      <ActionButton
        icon={
          <div className="relative h-5 w-5 shrink-0 overflow-hidden">
            <div className="absolute inset-[18.75%_16.67%]">
              <div className="absolute inset-[-6%_-5.63%]">
                <img alt="" className="block max-w-none size-full" src={figmaSyllabusIcon} />
              </div>
            </div>
          </div>
        }
        label="Syllabus"
      />
      <ActionButton
        icon={
          <div className="relative h-5 w-5 shrink-0">
            <img alt="" className="absolute block max-w-none size-full" src={figmaPlayIcon} />
          </div>
        }
        label="Recordings"
      />
      <ActionButton icon={<SlackIcon />} label="Group Slack" />
    </>
  ) : (
    <button
      onClick={() => setCohortModalOpen(true)}
      className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-dark px-3 py-2 text-[16px] font-medium text-white transition-colors hover:bg-[#444444]"
    >
      Select cohort
    </button>
  );

  return (
    <div className={`overflow-hidden rounded-xl border border-gray-stroke ${isCompleted ? "opacity-75" : ""}`}>

      {/* Zone 1: Header */}
      <div className="flex flex-col gap-5 bg-white p-4 sm:p-5 md:flex-row md:items-center md:gap-5">
        <div className="flex flex-col gap-3 min-[428px]:flex-row min-[428px]:items-start md:contents">
          {/* Thumbnail */}
          <img
            src={course.image}
            alt=""
            className="h-auto w-[122px] shrink-0 rounded-lg object-cover min-[428px]:h-16 md:h-[100px] md:w-[190px]"
          />
          {/* Title group */}
          <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-[1_0_0] md:gap-4">
            <div>
              <p className="text-[14px] font-medium uppercase tracking-[1.4px] text-gray-light">Live cohort</p>
              <p className="mt-1 text-[20px] font-medium leading-[1.2] text-gray-dark min-[428px]:text-[24px]">{course.title}</p>
            </div>
            {/* Buttons: desktop only */}
            <div className="hidden flex-wrap gap-2 md:flex">{actionButtons}</div>
          </div>
        </div>
        {/* Buttons: mobile/tablet only */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-5 sm:px-5 md:hidden">{actionButtons}</div>
      </div>

      {/* Zone 3: Sessions accordion toggle */}
      {cohortSelected && <button
        onClick={() => setSessionsOpen(!sessionsOpen)}
        className="flex w-full cursor-pointer items-center gap-3 border-t border-gray-stroke bg-white px-4 py-3 sm:px-5"
      >
        <span className="flex-1 text-left leading-[1.2]">
          <span className="text-[16px] font-medium text-gray-dark">{course.sessions.length} Sessions</span>
          <span className="ml-2 text-[16px] font-normal text-gray-light">{course.cohortDates}</span>
          {!isCompleted && sessionsOpen && (
            <a
              href="#"
              onClick={(e) => e.stopPropagation()}
              className="ml-3 hidden text-[16px] font-normal text-gray-light underline sm:inline"
            >
              Add all to calendar
            </a>
          )}
        </span>
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          className={`shrink-0 text-[#9b9b9b] transition-transform ${sessionsOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>}

      {/* Sessions list */}
      {cohortSelected && sessionsOpen && (
        <div className="bg-white pb-2">
          {simpleSessionLayout
            ? course.sessions.map((session, i) => (
                <SessionRowSimple key={session.id} session={session} index={i + 1} isNext={session.id === nextSession?.id} isFirst={i === 0} />
              ))
            : course.sessions.map((session, i) => (
                <SessionRow key={session.id} session={session} isNext={session.id === nextSession?.id} isFirst={i === 0} />
              ))
          }
        </div>
      )}

      <SelectCohortModal
        open={cohortModalOpen}
        onClose={() => setCohortModalOpen(false)}
        onSelect={() => setCohortSelected(true)}
      />
    </div>
  );
}
