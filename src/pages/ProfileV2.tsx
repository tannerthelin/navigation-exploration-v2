import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import TopNav from "../components/TopNav";
import MobileTopNav from "../components/MobileTopNav";
import BottomNav from "../components/BottomNav";
import { ExtraLinksProvider } from "../components/ExtraLinksContext";
import pic6 from "../assets/profile photos/pic-6.png";
import mailIcon from "../assets/icons/mail.svg";
import checkIcon from "../assets/icons/check.svg";
import shieldIcon from "../assets/icons/shield-light.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import wreathImg from "../assets/img/Wreath.svg";
import starIcon from "../assets/icons/icon/star.svg";
import atlassianLogo from "../assets/logos/atlassian.png";
import yaleLogo from "../assets/logos/yale.png";
import clientLogo1 from "../assets/logos/Rectangle 3012.png";
import clientLogo2 from "../assets/logos/Rectangle 3013.png";
import clientLogo3 from "../assets/logos/Rectangle 3017.png";
import clientLogo4 from "../assets/logos/Rectangle 3018.png";

const PROFILE_SECTIONS = [
  { id: "offerings", label: "Offerings" },
  { id: "about-samantha", label: "About" },
  { id: "work-experience", label: "Experience" },
  { id: "reviews", label: "Reviews" },
];

const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

export default function ProfileV2() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [stickyNavVisible, setStickyNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("offerings");
  const [adminOpen, setAdminOpen] = useState(false);
  const [showCustomerFavorite, setShowCustomerFavorite] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  const adminRef = useRef<HTMLDivElement>(null);
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navScrollRef = useRef<HTMLDivElement>(null);

  const setSectionRef = useCallback(
    (id: string) => (el: HTMLHeadingElement | null) => {
      sectionRefs.current[id] = el;
    },
    [],
  );

  const setGroupRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      groupRefs.current[id] = el;
    },
    [],
  );

  // Observer A: Show/hide sticky nav based on hero sentinel visibility
  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStickyNavVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Observer B: Track active section group
  useEffect(() => {
    const groups = Object.values(groupRefs.current).filter(Boolean) as HTMLDivElement[];
    if (groups.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-group");
            if (id) setActiveSection(id);
          }
        }
      },
      { rootMargin: "-60px 0px -70% 0px" },
    );

    groups.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll active tab into view
  useEffect(() => {
    const container = navScrollRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(`[data-section="${activeSection}"]`) as HTMLElement | null;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeSection]);

  // Close admin dropdown on outside click
  useEffect(() => {
    if (!adminOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [adminOpen]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile top nav */}
      <div className="md:hidden">
        <ExtraLinksProvider>
          <MobileTopNav />
        </ExtraLinksProvider>
      </div>

      {/* Desktop/Tablet top nav */}
      <div className="hidden md:block">
        <TopNav />
      </div>

      {/* Sticky secondary nav — portaled to body to escape framer-motion layoutId containing blocks */}
      {createPortal(
        <AnimatePresence>
          {stickyNavVisible && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 right-0 z-30 hidden border-b border-gray-stroke bg-white md:block"
            >
              <div className={`mx-auto flex items-stretch gap-4 px-6 transition-all duration-300 md:px-10 ${showSidebar ? "max-w-[1144px]" : "max-w-[900px]"}`}>
                {/* Left: photo + name + rate — click to scroll to top */}
                <div
                  className="flex shrink-0 cursor-pointer items-center gap-2.5"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <img
                    src={pic6}
                    alt="Samantha Parker"
                    className="h-10 w-10 rounded-[4px] object-cover"
                  />
                  <div className="flex flex-col text-[16px] leading-tight">
                    <span className="font-medium text-gray-dark">Samantha Parker</span>
                    <span className="text-[#707070]">$150/hr</span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="min-w-0 flex-1" />

                {/* Right: pivot tabs + CTA */}
                <div className="flex shrink-0 items-stretch">
                  <div
                    ref={navScrollRef}
                    className="scrollbar-hide flex items-stretch gap-1 overflow-x-auto"
                  >
                    {PROFILE_SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        data-section={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`shrink-0 cursor-pointer border-b-2 px-3 pt-4 pb-4 text-[16px] font-medium transition-colors ${
                          activeSection === section.id
                            ? "border-[#038561] text-gray-dark"
                            : "border-transparent text-gray-light hover:text-gray-dark"
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center pl-4">
                    <button className="cursor-pointer rounded-lg bg-[#038561] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                      Free intro call
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Full-bleed header background */}
      <div className="mt-14 w-full bg-[#f5f5f5] md:mt-0">
        {/* Category bar placeholder */}
        <div className={`mx-auto px-6 transition-all duration-300 ${showSidebar ? "max-w-[1144px]" : "max-w-[900px]"}`}>
          <div className="h-[44px]" />
        </div>

        {/* Remaining header space */}
        <div className="h-[78px]" />
      </div>

      {/* Main content area */}
      <div className={`mx-auto flex gap-16 px-6 py-0 transition-all duration-300 md:px-10 ${showSidebar ? "max-w-[1144px]" : "max-w-[900px]"}`}>
        {/* Left column — fills available width */}
        <div className="min-w-0 flex-1">
          {/* Profile photo + CTA buttons */}
          <div className="-mt-[80px] mb-4 flex items-end justify-between">
            <div className="group relative z-20 cursor-pointer rounded-lg border-[4px] border-white bg-white" onClick={() => setLightboxOpen(true)}>
              <div className="relative overflow-hidden rounded-[4px]">
                <motion.img
                  layoutId="profile-photo"
                  src={pic6}
                  alt="Samantha Parker"
                  className="block h-[132px] w-[132px] object-cover"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>
            </div>
            <div className="flex items-center gap-2 pb-[72px]">
              <button className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg border border-[#222222]/10 bg-white transition-colors hover:border-[#222222]/20">
                <img src={mailIcon} alt="Message" className="h-[20px] w-[20px]" />
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#222222]/10 bg-white px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:border-[#222222]/20"
              >
                {isFollowing && <img src={checkIcon} alt="" className="h-[18px] w-[18px]" />}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="cursor-pointer rounded-lg bg-[#038561] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#038561]/90">
                Free intro call
              </button>
            </div>
          </div>

          {/* Name + Supercoach badge */}
          <div className="mb-1 flex items-center gap-2">
            <h1 className="text-[18px] font-medium text-gray-dark">Samantha Parker</h1>
            <span className="text-[18px] text-[#999999]">·</span>
            <span className="text-[18px] text-[#707070]"><span className="text-[16px]">🏆</span> Supercoach</span>
          </div>

          {/* Headline */}
          <p className="mb-[6px] text-[24px] font-medium leading-[1.3] text-[#333333]">
            Experienced Product Leader at LinkedIn | Ex-Meta | Stanford GSB AdComm
          </p>

          {/* Credentials row */}
          <div className="mb-4 flex flex-wrap items-center gap-x-[20px] gap-y-[2px] text-[16px] text-[#707070]">
            {/* Atlassian */}
            <div className="flex items-center gap-[6px]">
              <img src={atlassianLogo} alt="Atlassian" className="h-[18px] w-[18px] rounded" />
              <span>Atlassian</span>
            </div>

            {/* Yale University */}
            <div className="flex items-center gap-[6px]">
              <img src={yaleLogo} alt="Yale University" className="h-[18px] w-[18px] rounded" />
              <span>Yale University</span>
            </div>

            {/* Successful clients at */}
            <div className="flex items-center gap-[6px]">
              <span>Successful clients at</span>
              <div className="flex items-center -space-x-[2px]">
                <img src={clientLogo1} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo2} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo3} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                <img src={clientLogo4} alt="" className="h-[18px] w-[18px] rounded border border-white" />
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mb-2 flex flex-col rounded-lg border border-gray-200">
            {/* Top row: stats (always visible) + Customer Favorite (desktop only) */}
            <div className="flex items-center">
              {/* Customer Favorite — desktop only */}
              {showCustomerFavorite && (
                <>
                  <div className="hidden flex-1 items-center justify-center gap-[6px] py-4 md:flex">
                    <img src={wreathImg} alt="" className="h-auto w-[24px]" />
                    <span className="text-center text-[18px] font-medium leading-tight text-gray-dark">Customer<br />Favorite</span>
                    <img src={wreathImg} alt="" className="h-auto w-[24px] scale-x-[-1]" />
                  </div>

                  <div className="hidden h-[36px] w-px bg-gray-200 md:block" />
                </>
              )}

              {/* Rating */}
              <div
                className="flex flex-1 cursor-pointer flex-col items-center justify-center py-4 transition-opacity hover:opacity-70"
                onClick={() => scrollToSection("reviews")}
              >
                <span className="text-[22px] font-medium leading-none text-gray-dark">5.0</span>
                <div className="mt-1 flex gap-px">
                  <img src={starIcon} alt="" className="h-[14px] w-[14px]" />
                  <img src={starIcon} alt="" className="h-[14px] w-[14px]" />
                  <img src={starIcon} alt="" className="h-[14px] w-[14px]" />
                  <img src={starIcon} alt="" className="h-[14px] w-[14px]" />
                  <img src={starIcon} alt="" className="h-[14px] w-[14px]" />
                </div>
              </div>

              <div className="h-[36px] w-px bg-gray-200" />

              {/* Reviews */}
              <div
                className="flex flex-1 cursor-pointer flex-col items-center justify-center py-4 transition-opacity hover:opacity-70"
                onClick={() => scrollToSection("reviews")}
              >
                <span className="text-[22px] font-medium leading-none text-gray-dark">52</span>
                <span className="text-[16px] leading-tight text-gray-dark underline decoration-[0.5px] decoration-gray-dark underline-offset-2">Reviews</span>
              </div>

              <div className="h-[36px] w-px bg-gray-200" />

              {/* Followers */}
              <div className="flex flex-1 flex-col items-center justify-center py-4">
                <span className="text-[22px] font-medium leading-none text-gray-dark">182</span>
                <span className="text-[16px] leading-tight text-gray-dark">Followers</span>
              </div>
            </div>

            {/* Customer Favorite — mobile only, own row */}
            {showCustomerFavorite && (
              <div className="flex items-center justify-center gap-[6px] border-t border-gray-200 py-4 md:hidden">
                <img src={wreathImg} alt="" className="h-auto w-[24px]" />
                <span className="text-center text-[18px] font-medium leading-tight text-gray-dark">Customer<br />Favorite</span>
                <img src={wreathImg} alt="" className="h-auto w-[24px] scale-x-[-1]" />
              </div>
            )}
          </div>

          {/* Availability row */}
          <div className="flex flex-col text-[16px] md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#1A73E8]">Available tomorrow</span>
              <span className="text-[#707070]">·</span>
              <span className="text-[#707070]">Responds within 12 hours</span>
            </div>
            <span className="text-[#9b9b9b]">1,240 minutes coached</span>
          </div>

          {/* Hero sentinel for sticky nav detection */}
          <div ref={heroSentinelRef} />

          {/* ── Offerings group: Offerings + Free Events + Resources ── */}
          <div ref={setGroupRef("offerings")} data-group="offerings">
            <div className="my-[36px] border-t border-gray-200" />

            <h2
              ref={setSectionRef("offerings")}
              className="scroll-mt-[60px] mb-4 text-[24px] font-medium text-gray-dark"
            >
              Offerings
            </h2>

            {/* Offering cards grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="h-[220px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[220px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[220px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>

            {/* Full-width placeholder */}
            <div className="mt-4 h-[88px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />

            {/* View more + guarantee */}
            <div className="mt-4 flex items-center justify-between">
              <button className="cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
                See 8 more packages
              </button>
              <div className="flex items-center gap-2 text-[15px] text-[#9b9b9b]">
                <img src={shieldIcon} alt="" className="w-[12px]" />
                <span>Protected by the <span className="cursor-pointer underline decoration-[0.5px] underline-offset-2 transition-colors hover:text-[#707070]">Leland Experience Guarantee</span></span>
              </div>
            </div>

            {/* Free events */}
            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-1 text-[24px] font-medium text-gray-dark">Free events</h2>
            <p className="mb-4 text-[18px] text-[#707070]">Live, interactive sessions you can join for free</p>
            <div className="flex flex-col gap-4">
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[100px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>
            <button className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See 2 more
              <img src={chevronDownIcon} alt="" className="h-[16px] w-[16px]" />
            </button>

            {/* Leland+ Resources */}
            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-1 text-[24px] font-medium text-gray-dark">Resources</h2>
            <p className="mb-4 text-[18px] text-[#707070]">Access expert resources from Samantha and hundreds of other coaches on Leland+</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[80px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[80px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[80px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[80px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>
            <button className="mt-4 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See more
            </button>
          </div>

          {/* ── About group: MBA Qualifications + About Samantha + Why do I coach? ── */}
          <div ref={setGroupRef("about-samantha")} data-group="about-samantha">
            <div className="my-[36px] border-t border-gray-200" />
            <h2
              ref={setSectionRef("about-samantha")}
              className="scroll-mt-[60px] mb-4 text-[24px] font-medium text-gray-dark"
            >
              MBA Qualifications
            </h2>
            <div className="flex flex-col gap-4">
              <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>

            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-4 text-[24px] font-medium text-gray-dark">About Samantha</h2>
            <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />

            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-4 text-[24px] font-medium text-gray-dark">Why do I coach?</h2>
            <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
          </div>

          {/* ── Experience group: Work Experience + Education ── */}
          <div ref={setGroupRef("work-experience")} data-group="work-experience">
            <div className="my-[36px] border-t border-gray-200" />
            <h2
              ref={setSectionRef("work-experience")}
              className="scroll-mt-[60px] mb-4 text-[24px] font-medium text-gray-dark"
            >
              Work Experience
            </h2>
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-[100px] w-[100px] shrink-0 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                  <div className="h-[100px] min-w-0 flex-1 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                </div>
              ))}
            </div>

            <div className="my-[36px] border-t border-gray-200" />
            <h2 className="mb-4 text-[24px] font-medium text-gray-dark">Education</h2>
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-[100px] w-[100px] shrink-0 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                  <div className="h-[100px] min-w-0 flex-1 rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Reviews group ── */}
          <div ref={setGroupRef("reviews")} data-group="reviews">
            <div className="my-[36px] border-t border-gray-200" />
            <div ref={setSectionRef("reviews")} className="scroll-mt-[60px]" />

            {/* Stars + rating */}
            <div className="mb-1 flex gap-px">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#222222">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-medium text-gray-dark">5.0</span>
              <span className="text-[16px] font-medium text-[#9b9b9b]">52 reviews</span>
            </div>

            <div className="my-5 border-t border-gray-200" />

            {/* Rating breakdown — Airbnb-style columns */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {/* Overall rating distribution */}
              <div className="col-span-2 sm:col-span-1">
                <p className="mb-1 text-[16px] text-gray-dark">Overall rating</p>
                <div className="flex flex-col gap-1">
                  {[
                    { star: 5, count: 48 },
                    { star: 4, count: 3 },
                    { star: 3, count: 1 },
                    { star: 2, count: 0 },
                    { star: 1, count: 0 },
                  ].map((row) => (
                    <div key={row.star} className="flex items-center gap-1.5">
                      <span className="w-[10px] shrink-0 text-[12px] text-[#707070]">{row.star}</span>
                      <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
                        <div
                          className="h-full rounded-full bg-gray-dark"
                          style={{ width: `${(row.count / 52) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {[
                {
                  label: "Knowledge",
                  score: 5.0,
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  ),
                },
                {
                  label: "Value",
                  score: 4.9,
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  ),
                },
                {
                  label: "Responsiveness",
                  score: 5.0,
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  ),
                },
                {
                  label: "Supportiveness",
                  score: 5.0,
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col justify-between border-l border-gray-200 pl-4">
                  <div>
                    <p className="text-[16px] text-gray-dark">{item.label}</p>
                    <p className="text-[22px] font-semibold text-gray-dark">{item.score.toFixed(1)}</p>
                  </div>
                  <div className="mt-3 text-gray-dark">{item.icon}</div>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-gray-200" />

            {/* Review cards */}
            <div className="flex flex-col gap-6">
              {[
                {
                  title: "Stop searching. Samantha is the real deal.",
                  body: "I tried a few different coaches before finding Samantha. Save your time, start with Samantha. She is extremely efficient with your time, gives specific and tactical feedback, and is not shy if a part of your application does not meet the bar...",
                  name: "Zack G.",
                  date: "April 2025",
                  detail: "Received coaching for MBA",
                },
                {
                  title: "The best MBA coach!!",
                  body: "The best decision I made in the MBA process was choosing to work with Samantha — she's the best coach out there! From the start, I was impressed by her ability to provide quick and actionable feedback, often turning around drafts in a day...",
                  name: "Anonymous",
                  date: "December 2024",
                  detail: "Received coaching for MBA",
                },
                {
                  title: "Highly recommend.",
                  body: "Working with Samantha was one of the best decisions I made ahead of my deferred MBA application process. She's incredibly personable, and helped me take my story and relay it in the best possible way...",
                  name: "Anonymous",
                  date: "November 2024",
                  detail: "Purchased package: MBA Applications",
                },
              ].map((review, i) => (
                <div key={i}>
                  {/* Stars + score */}
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <div className="flex gap-px">
                      {[...Array(5)].map((_, j) => (
                        <img key={j} src={starIcon} alt="" className="h-[14px] w-[14px]" />
                      ))}
                    </div>
                    <span className="text-[14px] text-[#707070]">5.0</span>
                    <span className="text-[15px] font-medium text-gray-dark">{review.title}</span>
                  </div>

                  {/* Body */}
                  <p className="mb-2 text-[15px] leading-relaxed text-[#555]">{review.body}</p>
                  <button className="mb-3 cursor-pointer text-[14px] font-medium text-[#038561] hover:underline">View more</button>

                  {/* Reviewer */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#038561] text-[13px] font-medium text-white">
                      {review.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[14px]">
                        <span className="font-medium text-gray-dark">{review.name}</span>
                        <span className="text-[#9b9b9b]">{review.date}</span>
                      </div>
                      <p className="text-[13px] text-[#9b9b9b]">{review.detail}</p>
                    </div>
                  </div>

                  {/* Accepted-to pills placeholder */}
                  <div className="mt-3">
                    <p className="mb-1.5 text-[13px] text-[#9b9b9b]">Client was accepted to:</p>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(i === 1 ? 3 : 2)].map((_, k) => (
                        <div key={k} className="h-[32px] w-[180px] rounded-lg bg-[#f5f5f5]" style={dashedBorderStyle} />
                      ))}
                    </div>
                  </div>

                  {i < 2 && <div className="mt-6 border-t border-gray-200" />}
                </div>
              ))}
            </div>

            {/* See all reviews */}
            <button className="mt-6 cursor-pointer rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[16px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]">
              See all 52 reviews
            </button>
          </div>
        </div>

        {/* Right column — fixed 240px sidebar, hidden on tablet */}
        {showSidebar && (
          <div className="hidden w-[240px] shrink-0 pt-6 lg:block">
            <div className="flex flex-col gap-[14px]">
              <div className="h-[160px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[280px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
              <div className="h-[120px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
            </div>
          </div>
        )}
      </div>

      {/* Profile photo lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute right-6 top-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>
            <motion.img
              layoutId="profile-photo"
              src={pic6}
              alt="Samantha Parker"
              className="max-h-[80vh] max-w-[80vw] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin controls */}
      <div ref={adminRef} className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <div className="mb-1.5 px-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-[#9b9b9b]">
                Admin controls
              </div>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[14px] text-gray-dark">Customer favorite</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showCustomerFavorite}
                    onChange={() => setShowCustomerFavorite(!showCustomerFavorite)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[14px] text-gray-dark">Show sidebar</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showSidebar}
                    onChange={() => setShowSidebar(!showSidebar)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-colors hover:bg-[#f5f5f5]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="3" r="1.5" fill="#9b9b9b" />
            <circle cx="8" cy="8" r="1.5" fill="#9b9b9b" />
            <circle cx="8" cy="13" r="1.5" fill="#9b9b9b" />
          </svg>
        </button>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
