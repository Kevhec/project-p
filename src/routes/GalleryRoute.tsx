import { ScrollArea } from "@/components/ui/scroll-area"
import { usePictures } from "@/context/picturesContext"
import { DATE_FORMAT } from "@/lib/constants"
import { parse } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { cn, getSpan } from "@/lib/utils"
import type { DocumentDataType } from "@/types/general"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useMediaQuery } from 'react-responsive'

export default function GalleryRoute() {
  const [activeImage, setActiveImage] = useState<DocumentDataType | null>(null)
  const { monthData, getMonthData } = usePictures()
  const { day } = useParams()
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const currentDayImages = useMemo(() => {
    if (!day) return []
    const galleryDay = Number.parseInt(day.split("-")[0])
    return monthData.filter((file) => file.date.getDate() === galleryDay)
  }, [monthData, day])

  useEffect(() => {
    if (!monthData?.length && day) {
      const parsedDate = parse(day, DATE_FORMAT, new Date())
      getMonthData(parsedDate)
    }
  }, [day, monthData, getMonthData])

  return (
    <ScrollArea className="h-screen w-full p-4">
      <div className="relative w-full max-w-5xl mx-auto">
        <Button
          asChild
          variant="outline"
          className="absolute left-0 rounded-full bg-[#931C4B] hover:bg-[#E16696] text-white"
        >
          <Link to="/calendar" viewTransition>
            <ArrowLeft />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <h1 className="text-center font-great-vibes text-4xl my-6">{day}</h1>
      </div>
      <div className="relative mx-auto w-full max-w-5xl grid grid-cols-2 auto-rows-[minmax(auto,200px)] md:grid-cols-4 gap-2 md:gap-4">
        {currentDayImages.map((file, i) => {
          const bentoVariant = getSpan(i)
          const containerClasses = cn("w-full", {
            [bentoVariant]: !isMobile
          })
          const fullSizeUrl = file.urls.fullSize
          const isActive = activeImage?.urls?.fullSize === file?.urls?.fullSize

          return (
            <motion.figure
              key={file.id}
              layoutId={fullSizeUrl}
              className={containerClasses}
              data-active={isActive}
              onClick={() => setActiveImage(file)}
            >
              <motion.img
                src={fullSizeUrl}
                className="w-full h-full object-cover transition-all object-top row-span rounded-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15, ease: "easeIn" }}
              />
            </motion.figure>
          )
        })}
        <AnimatePresence>
          {activeImage && (
            <>
              <motion.div
                key="backdrop"
                className="fixed inset-0 bg-black/70 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => setActiveImage(null)}
              />

              <motion.div
                key="modal"
                className="fixed inset-0 flex flex-col gap-2 items-center justify-center z-50 pointer-events-none"
              >
                <motion.img
                  layoutId={activeImage.urls.fullSize}
                  src={activeImage.urls.fullSize}
                  className="min-w-[20vw] max-w-[90vw] max-h-[90vh] rounded-2xl object-contain pointer-events-auto"
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
                <p className="text-white font-diphylleia">{activeImage.name}</p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ScrollArea>
  )
}
