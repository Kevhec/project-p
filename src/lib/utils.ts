import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSpan(index: number) {
  const position = index % 8

  switch (position) {
    case 0:
      return "col-span-2 row-span-2"
    case 1:
      return "row-span-2"
    case 2:
      return "row-span-2"
    case 3:
      return "col-span-2"
    case 4:
      return ""
    case 5:
      return ""
    case 6:
      return "col-span-2"
    case 7:
      return "col-span-2"
    default:
      return ""
  }
}
