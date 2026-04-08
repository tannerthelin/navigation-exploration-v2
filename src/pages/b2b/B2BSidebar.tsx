import { navItems, type B2BView } from "./B2BData";
import { Avatar } from "./B2BShared";

export default function B2BSidebar({
  activeView,
  onNavigate,
}: {
  activeView: B2BView;
  onNavigate: (view: B2BView) => void;
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-stroke bg-white">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[18px] font-medium text-gray-dark transition-all ${
              activeView === item.key
                ? "bg-[#222222]/5"
                : "hover:bg-gray-hover"
            }`}
          >
            <img src={item.icon} alt="" className="h-6 w-6 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-gray-stroke p-4">
        <div className="flex items-center gap-[10px]">
          <Avatar initials="KB" bg="bg-primary-xlight" color="text-dark-green" />
          <div>
            <div className="text-[13px] font-semibold text-gray-dark">Katie Brown</div>
            <div className="text-[11px] text-gray-xlight">Account Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
