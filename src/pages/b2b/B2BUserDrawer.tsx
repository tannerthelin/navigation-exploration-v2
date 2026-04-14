import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import SidebarCard from "../../components/SidebarCard";

function ExpandableText({ text, className }: { text: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight + 2);
  }, []);

  return (
    <div>
      <p ref={ref} onClick={() => overflows && setExpanded((e) => !e)} className={`${className ?? ""} ${expanded ? "" : "line-clamp-2"} ${overflows ? "cursor-pointer" : ""}`}>{text}</p>
      {overflows && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 text-[14px] font-medium text-primary hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export interface CoachingSession {
  coach: string;
  coachImg?: string;
  coachHeadline?: string;
  date: string;
  status?: "scheduled" | "completed";
  summary: string;
  review?: { rating: number; text: string };
}

export interface LiveCourseEnrollment {
  cohort: string;
  startDate: string;
  endDate: string;
  status: "enrolled" | "invited";
  review?: { rating: number; text: string };
  inviteSent?: string;
}

export interface UserDetail {
  name: string;
  email: string;
  initials: string;
  coaching?: {
    granted: number;
    used: number;
    sessions: CoachingSession[];
    inviteSent?: string;
  };
  plus?: {
    topCategories: string[];
    recentItems: Array<{ title: string; category: string; type?: "video" | "document" }>;
    inviteSent?: string;
  };
  liveCourses?: LiveCourseEnrollment[];
}

interface Props {
  user: UserDetail | null;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < rating ? "#ffcb47" : "#e5e5e5"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-[24px] font-medium text-gray-dark">
      {children}
    </div>
  );
}

function InviteBanner({ message, inviteSent, variant = "yellow" }: { message: string; inviteSent?: string; variant?: "yellow" | "red" }) {
  const isRed = variant === "red";
  const styles = isRed ? "border-red/30 bg-red/5" : "border-[#ede9c8] bg-[#fdfbf0]";
  return (
    <div className={`rounded-lg border px-4 py-3 ${styles}`}>
      <div className={`font-medium text-gray-dark ${isRed ? "text-[16px]" : "text-[14px]"}`}>{message}</div>
      {inviteSent && (
        <div className="mt-0.5 text-[13px] text-gray-light">Last invite sent {inviteSent}</div>
      )}
      <button className={`mt-2 flex items-center gap-1 font-medium hover:underline ${isRed ? "text-[16px] text-red" : "text-[13px] text-primary"}`}>
        Resend invite
        {isRed && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>
    </div>
  );
}


export default function B2BUserDrawer({ user, onClose }: Props) {

  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/25"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-4 border-b border-gray-stroke px-6 py-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-xlight text-[13px] font-semibold text-dark-green">
                {user.initials}
              </div>
              <div className="min-w-0 flex-1 text-center">
                <div className="text-[16px] font-medium text-gray-dark">{user.name}</div>
                <div className="text-[14px] text-gray-xlight">{user.email}</div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-gray-hover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-6">

              {/* 1:1 Coaching */}
              {user.coaching && (
                <div>
                  <SectionLabel>1:1 Coaching</SectionLabel>

                  <div className="mb-3 flex items-baseline gap-2">
                    <span className="text-[18px] font-medium text-gray-dark">{user.coaching.used} / {user.coaching.granted}</span>
                    <span className="text-[14px] font-medium uppercase tracking-[0.06em] text-gray-light">sessions redeemed</span>
                  </div>

                  {user.coaching.sessions.length > 0 && (
                    <div className="flex flex-col">
                      {user.coaching.sessions.flatMap((s, i) => {
                        const items = [
                          <div key={`session-${i}`} className="border-b border-gray-stroke py-3">
                            <SidebarCard
                              variant="coach"
                              image={s.coachImg}
                              title={s.coach}
                              subtitle={s.coachHeadline ?? ""}
                              right={
                                <div className="flex flex-col items-end gap-0.5 text-gray-xlight">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                  </svg>
                                  <span className="text-[14px]">{s.date}</span>
                                </div>
                              }
                            />
                            {s.status === "scheduled"
                              ? <p className="mt-3 text-[14px] font-medium uppercase tracking-[0.06em] text-gray-light">Scheduled</p>
                              : <ExpandableText text={s.summary} className="mt-3 text-[16px] text-gray-light" />
                            }
                          </div>,
                        ];
                        if (s.review) {
                          items.push(
                            <div key={`review-${i}`} className="border-b border-gray-stroke py-3">
                              <SidebarCard
                                variant="coach"
                                image={s.coachImg}
                                title={s.coach}
                                subtitle={s.coachHeadline ?? ""}
                                right={
                                  <div className="flex flex-col items-end gap-0.5 text-gray-xlight">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    <span className="text-[14px]">{s.date}</span>
                                  </div>
                                }
                              />
                              <div className="flex flex-col gap-[6px] px-2">
                                <StarRating rating={s.review.rating} />
                                <ExpandableText text={s.review.text} className="text-[16px] italic text-gray-light" />
                              </div>
                            </div>
                          );
                        }
                        return items;
                      })}
                    </div>
                  )}
                  {user.coaching.used === 0 && (
                    <InviteBanner message="Not scheduled yet" inviteSent={user.coaching.inviteSent} />
                  )}
                </div>
              )}

              {/* Leland+ */}
              {user.plus && (
                <div>
                  <SectionLabel>Leland+</SectionLabel>
                  {user.plus.inviteSent && !user.plus.recentItems.length ? (
                    <InviteBanner message="Not activated yet" inviteSent={user.plus.inviteSent} />
                  ) : (
                    <>
                      <div className="mb-3 text-[14px] font-medium uppercase tracking-[0.06em] text-gray-light">Recently viewed</div>
                      <div className="flex flex-col">
                        {user.plus.recentItems.map((item, i, arr) => (
                          <div key={i} className={`flex items-center justify-between gap-3 py-2 ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                            <div className="flex min-w-0 items-center gap-2">
                              {item.type === "video" ? (
                                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-xlight">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M17.5 10C17.5 14.1425 14.1425 17.5 10 17.5C5.8575 17.5 2.5 14.1425 2.5 10C2.5 5.8575 5.8575 2.5 10 2.5C14.1425 2.5 17.5 5.8575 17.5 10Z"/>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M9.11753 7.549L12.3525 9.46234C12.7617 9.704 12.7617 10.2965 12.3525 10.5382L9.11753 12.4515C8.70086 12.6982 8.17419 12.3973 8.17419 11.9132V8.08734C8.17419 7.60317 8.70086 7.30234 9.11753 7.549Z"/>
                                </svg>
                              ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-xlight">
                                  <path d="M19.1213 6.12132L16.8787 3.87868C16.3161 3.31607 15.553 3 14.7574 3H7C6.20435 3 5.44129 3.31607 4.87868 3.87868C4.31607 4.44129 4 5.20435 4 6V18C4 18.7956 4.31607 19.5587 4.87868 20.1213C5.44129 20.6839 6.20435 21 7 21H17C17.7956 21 18.5587 20.6839 19.1213 20.1213C19.6839 19.5587 20 18.7956 20 18V8.24264C20 7.44699 19.6839 6.68393 19.1213 6.12132Z"/>
                                  <path d="M20 8.5H16.5C15.9696 8.5 15.4609 8.28929 15.0858 7.91421C14.7107 7.53914 14.5 7.03043 14.5 6.5V3"/>
                                  <path d="M16 16.5H8"/><path d="M8 13H16"/><path d="M10.7 9.5H8"/>
                                </svg>
                              )}
                              <span className="text-[16px] text-gray-dark">{item.title}</span>
                            </div>
                            <span className="shrink-0 text-[14px] text-gray-xlight">{item.category}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mb-3 mt-5 text-[14px] font-medium uppercase tracking-[0.06em] text-gray-light">Top categories</div>
                      <div className="flex flex-wrap gap-2">
                        {user.plus.topCategories.map((cat) => (
                          <span key={cat} className="rounded-full bg-gray-hover px-3 py-1 text-[14px] font-medium text-gray-light">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Live Courses */}
              {user.liveCourses && user.liveCourses.length > 0 && (
                <div>
                  <SectionLabel>Live Courses</SectionLabel>
                  <div className="flex flex-col">
                    {user.liveCourses.map((course, i, arr) => (
                      <div key={i} className={`pb-4 ${i > 0 ? "pt-4" : ""} ${i < arr.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[16px] font-medium text-gray-dark">{course.cohort}</div>
                          <span className="shrink-0 text-[14px] text-gray-xlight">{course.status === "enrolled" ? "Enrolled" : "Invited"}</span>
                        </div>
                        <div className="mt-1 text-[14px] text-gray-xlight">{course.startDate} – {course.endDate}</div>
                        {course.status === "invited" && (
                          <div className="mt-3">
                            <InviteBanner message="Not enrolled yet" inviteSent={course.inviteSent} variant="red" />
                          </div>
                        )}
                        {course.review && (
                          <div className="mt-3 flex flex-col gap-2 px-2">
                            <StarRating rating={course.review.rating} />
                            <ExpandableText text={course.review.text} className="text-[16px] italic text-gray-light" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
