import { MAX_THUMBNAILS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import React, { memo, useEffect, useRef } from "react"
import type { DayButtonProps } from "react-day-picker"
import { useMediaQuery } from "react-responsive"

interface Props extends DayButtonProps {
  thumbsByDay: Record<string, string[]>
}

const CustomDayButton = memo(function CustomDayButton({
  thumbsByDay,
  day,
  modifiers,
  className,
  children,
  ...buttonProps
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const thumbs = thumbsByDay[format(day.date, "dd-MM-yyyy")] || []
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 900px)" })

  const classes = cn(
    "relative w-full text-sm md:text-base h-full rounded-md border focus:bg-[#E16696] text-white flex px-2 py-1 bg-[#931C4B] transition-colors",
    {
      "bg-[#A85D7A] hover:bg-[#C18BA0]": modifiers.outside,
      "hover:bg-[#C42765]": !modifiers.outside,
    },
    className
  )

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])
  return (
    <button ref={ref} className={classes} {...buttonProps}>
      {children}
      {thumbs.length > 0 && (
        <figure
          className={cn(
            "absolute bottom-0.5 left-1/2 items-end flex justify-end w-[95%] -translate-x-1/2 rounded-full p-0.5 bg-white font-diphylleia",
            {
              "w-5 h-5 p-0 translate-none left-auto right-1 bottom-1 text-black":
                isTabletOrMobile,
              "w-10 left-none right-0 -translate-x-2.5": !isTabletOrMobile && thumbs.length === 2,
              "w-6 right-0 translate-x-1.5": !isTabletOrMobile && thumbs.length === 1,
            }
          )}
        >
          {(isTabletOrMobile || thumbs.length > 3) && (
            <div
              className={cn(
                "w-5 h-5 leading-none pb-px text-xs text-center flex items-center justify-center aspect-square rounded-full text-gray-500 z-10",
                {
                  "text-black": isTabletOrMobile,
                }
              )}
            >
              <p>
                {isTabletOrMobile
                  ? thumbs.length
                  : `${thumbs.length - MAX_THUMBNAILS}+`}
              </p>
            </div>
          )}
          {!isTabletOrMobile &&
            thumbs.slice(0, MAX_THUMBNAILS).map((thumb, i) => (
              <img
                key={`${thumb}-${i}`}
                src={thumb}
                alt="Thumbnail"
                width={20}
                height={20}
                className={`w-5 h-5 aspect-square rounded-full object-cover z-(--z-index) border-2 border-white last:-ml-1`}
                style={
                  {
                    "--right-offset": `${i * 5}px`,
                    "--z-index": i * 10 + 10,
                  } as React.CSSProperties
                }
              />
            ))}
        </figure>
      )}
    </button>
  )
})

export default CustomDayButton
