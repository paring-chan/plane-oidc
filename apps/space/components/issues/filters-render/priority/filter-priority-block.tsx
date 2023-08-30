"use client";

// mobx react lite
import { observer } from "mobx-react-lite";
// mobx hook
import { useMobxStore } from "lib/mobx/store-provider";
// interfaces
import { IIssuePriorityFilters } from "store/types/issue";

export const RenderIssuePriority = observer(({ priority }: { priority: IIssuePriorityFilters }) => {
  const store = useMobxStore();

  const removePriorityFromFilter = () => {};

  return (
    <div
      className={`flex-shrink-0 relative flex items-center flex-wrap gap-1 border px-[2px] py-0.5 rounded-full select-none ${
        priority.className || ``
      }`}
    >
      <div className="flex-shrink-0 w-[20px] h-[20px] flex justify-center items-center overflow-hidden rounded-full">
        <span className="material-symbols-rounded text-[14px]">{priority?.icon}</span>
      </div>
      <div className="text-sm font-medium whitespace-nowrap">{priority?.title}</div>
      <div
        className="flex-shrink-0 w-[20px] h-[20px] cursor-pointer flex justify-center items-center overflow-hidden rounded-full text-gray-500 hover:bg-gray-200/60 hover:text-gray-600"
        onClick={removePriorityFromFilter}
      >
        <span className="material-symbols-rounded text-[14px]">close</span>
      </div>
    </div>
  );
});