import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useDateSelect from "@/hooks/useDateSelect"
import { DATE_FORMAT, INITIAL_YEAR, months } from "@/lib/constants"
import { useCallback, useEffect, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { formSchema } from "@/lib/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as exif from "exifr"
import getUrls from "@/lib/getUrl"
import type { UploadFileData } from "@/types/general"
import UploadStateOverlay from "@/components/internal/UploadStateOverlay"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import useUploadImages from "@/hooks/useUploadImages"
import { usePictures } from "@/context/picturesContext"
import CustomDayButton from "@/components/internal/CustomDayButton"
import type { DayButtonProps, Modifiers } from "react-day-picker"
import { useNavigate } from "react-router"
import { Spinner } from "@/components/ui/spinner"

const MAX_FILES_PER_UPLOAD = 10

export default function CalendarRoute() {
  const { loading, uploadState, clearUploadState, uploadImages } =
    useUploadImages()
  const {
    monthData,
    loading: monthDataLoading,
    handleLoading,
    getMonthData,
    changeDate,
  } = usePictures()
  const navigate = useNavigate()

  const {
    selectProps: { selectedMonth, selectedYear, onMonthChange, onYearChange },
    calendarProps,
  } = useDateSelect()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { images: [] },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const parsedMetadata = await Promise.all(
        acceptedFiles.map((file) => {
          return exif.parse(file)
        })
      )

      acceptedFiles.forEach((file, i) => {
        append({
          file,
          name: file.name,
          date: parsedMetadata[i]?.CreateDate || new Date(file.lastModified),
          type: file.type,
        })
      })
    },
    [append]
  )

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const presignedUrls = await getUrls(
        values.images.map(({ file }) => ({
          name: file.name,
          type: 'image/webp',
        }))
      )

      if (!presignedUrls) return

      const uploadArray: UploadFileData[] = values.images.map((value, i) => {
        const { file, name, date } = value
        const imageData = { file, name, date }
        const uploadMetaData = presignedUrls[i]

        return {
          imageData,
          uploadMetaData,
          trackIndex: i,
        }
      })

      const results = await uploadImages(uploadArray)
      const fulfilledRequestsIndexes: number[] = []
      for (let i = 0; i < results.length; i++) {
        const result = results[i]

        if (result.status === "fulfilled") {
          fulfilledRequestsIndexes.push(i)
        }
      }

      const selectedYear = calendarProps.selected?.getFullYear()
      const selectedMonth = calendarProps.selected?.getMonth()

      const wasAddedToCurrentDate = values.images.some((value) => {
        const valueDate = value.date
        const valueYear = valueDate.getFullYear()
        const valueMonth = valueDate.getMonth()

        return valueYear === selectedYear && valueMonth === selectedMonth
      })

      if (wasAddedToCurrentDate && calendarProps.selected) {
        changeDate(calendarProps.selected)
      }
      clearUploadState()
      remove(fulfilledRequestsIndexes)
    } catch (error) {
      console.error(error)
    }
  }

  const thumbsByDay = useMemo(() => {
    if (monthData.length === 0) return {}

    const dateMapping: Record<string, string[]> = {}

    monthData.forEach((file) => {
      const date = format(file.date, DATE_FORMAT)
      if (!dateMapping[date]) dateMapping[date] = []

      dateMapping[date].push(file.urls.thumb)
    })

    return dateMapping
  }, [monthData])

  const handleDayClick = (date: Date, modifiers: Modifiers) => {
    const thumbsKey = format(date, DATE_FORMAT)
    const monthKey = format(date, 'MM-yyyy')

    // TODO: Verify if this is needed
    /* getMonthData(date) */

    if (monthData.length > 0 && !modifiers.outside) {
      const dayHasImages = thumbsByDay[thumbsKey]?.length > 0
      navigate(`${monthKey}${dayHasImages ? `#${thumbsKey}` : ''}`, {
        state: { day: dayHasImages ? thumbsKey : undefined }
      })
    }
  }

  useEffect(() => {
    if (!calendarProps.selected) return
    getMonthData(calendarProps.selected)
  }, [calendarProps.selected, getMonthData])

  useEffect(() => {
    handleLoading(true)
  }, [selectedMonth, selectedYear, handleLoading])

  const { getRootProps, open, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: true,
    accept: { "image/*": [] },
  })

  return (
    <div className="w-full relative" {...getRootProps()}>
      {isDragActive && (
        <div className="bg-[#EFE6DD] absolute inset-0 z-50 grid content-center">
          <p className="font-diphylleia text-4xl text-center">
            Aquí van los recuerdos...
          </p>
        </div>
      )}
      <div className="absolute top-0 right-0 opacity-40 md:opacity-100">
        <img
          src="/images/background-flowers.png"
          alt="Arreglo florar de Buganvilias"
          className="w-48 md:w-3xs"
        />
      </div>
      <input {...getInputProps()} />
      <ScrollArea className="h-screen max-w-screen overflow-hidden pb-10">
        <div className="w-full p-4 pt-10 md:px-20 md:pt-20 md:max-w-6xl mx-auto">
          <h1 className="font-great-vibes text-7xl text-center">
            Nuestros días
          </h1>
          <div className="flex flex-col md:grid md:grid-cols-[1fr_2fr] md:justify-center md:max-h-[500px]">
            <div className="flex flex-col gap-4 grow">
              <div
                className={cn(
                  "flex flex-col relative gap-2.5 mt-24 items-center transition-all",
                  { "mt-0": fields.length > 0 }
                )}
              >
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={onMonthChange}
                >
                  <SelectTrigger
                    size="sm"
                    className="capitalize font-diphylleia text-2xl border-none px-4 h-fit! self-start w-44! rounded-full hover:bg-slate-100 transition-colors focus-visible:ring-0! shadow-none"
                  >
                    <SelectValue placeholder={months[selectedMonth]} />
                  </SelectTrigger>
                  <p className="font-diphylleia absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    de
                  </p>
                  <SelectContent className="font-diphylleia">
                    {months.map((month, i) => (
                      <SelectItem
                        className="capitalize"
                        value={i.toString()}
                        key={`${month}-${i}-monthSelect`}
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={onYearChange}
                >
                  <SelectTrigger
                    size="sm"
                    className="capitalize font-diphylleia self-end text-lg border-none p-4 h-fit! w-34! rounded-full hover:bg-slate-100 transition-colors focus-visible:ring-0! shadow-none pl-4"
                  >
                    <SelectValue placeholder={months[selectedMonth]} />
                  </SelectTrigger>
                  <SelectContent className="font-diphylleia">
                    {Array.from({ length: 20 }, (_, i) => {
                      const yearOption = INITIAL_YEAR + i

                      return (
                        <SelectItem
                          value={yearOption.toString()}
                          key={`${yearOption}-${i}-yearsSelect`}
                        >
                          {yearOption}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
                <ScrollArea
                  className={cn(
                    "md:h-[400px] md:p-4 bg-white rounded-md border transition-all py-4",
                    {
                      "md:h-fit": fields.length === 0
                    }
                  )}
                >
                  <div>
                    <h2 className="font-diphylleia mb-2 text-center text-lg">
                      Nuevos recuerdos ♥️
                    </h2>
                    <Button
                      className={cn(
                        'bg-[#931C4B] hover:bg-[#C42765] text-white font-diphylleia w-10/12 mx-auto block',
                        { "mb-4": fields.length > 0 }
                      )}
                      onClick={open}
                    >
                      Abrir galería
                    </Button>
                    {fields.length > 0 && (
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          id="upload-form"
                          className="space-y-4"
                        >
                          {fields.map((field, index) => {
                            const itemState = uploadState[index]
                            const imageUrl = URL.createObjectURL(field.file)

                            return (
                              <Card
                                key={field.id}
                                className="relative flex-row gap-2 py-4"
                              >
                                {itemState && (
                                  <UploadStateOverlay
                                    state={itemState}
                                    image={imageUrl}
                                  />
                                )}
                                <CardHeader className="pl-4 py-0 pr-0 container-normal flex flex-col">
                                  <CardAction className="absolute right-0.5 top-0.5">
                                    <Button
                                      variant="ghost"
                                      className="w-4 p-1 h-auto aspect-square"
                                      onClick={() => remove(index)}
                                      disabled={itemState === "pending"}
                                    >
                                      <X />
                                      <span className="sr-only">Eliminar</span>
                                    </Button>
                                  </CardAction>
                                  <div className="w-min space-y-0.5">
                                    <p
                                      className={cn(
                                        "font-diphylleia text-sm text-center",
                                        {
                                          "text-rose-800":
                                            index + 1 > MAX_FILES_PER_UPLOAD,
                                        }
                                      )}
                                    >
                                      {index + 1} / 10
                                    </p>
                                    <figure className="mx-auto w-14 aspect-square">
                                      <img
                                        src={imageUrl}
                                        alt={field.name}
                                        width={50}
                                        height={50}
                                        className="object-cover rounded-sm aspect-square w-full"
                                      />
                                    </figure>
                                  </div>
                                </CardHeader>
                                <CardContent className="flex items-center gap-2 relative px-0 flex-col grow pr-6">
                                  <FormField
                                    control={form.control}
                                    name={`images.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem className="gap-0.5 w-full">
                                        <FormLabel className="text-xs sr-only">
                                          Nombre
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Recuerdo 1"
                                            className="text-xs!"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`images.${index}.date`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col gap-0.5 w-full">
                                        <FormLabel className="text-xs sr-only">
                                          Fecha
                                        </FormLabel>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <FormControl>
                                              <Button
                                                variant={"outline"}
                                                className={cn(
                                                  "w-full pl-3 text-left font-normal text-xs",
                                                  !field.value &&
                                                    "text-muted-foreground"
                                                )}
                                              >
                                                {field.value ? (
                                                  format(field.value, "PPP", {
                                                    locale: es,
                                                  })
                                                ) : (
                                                  <span>Escoge una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                              </Button>
                                            </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                          >
                                            <Calendar
                                              mode="single"
                                              selected={field.value}
                                              onSelect={field.onChange}
                                              locale={es}
                                              captionLayout="dropdown"
                                            />
                                          </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </CardContent>
                              </Card>
                            )
                          })}
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                          >
                            {!loading &&
                            Object.values(uploadState).some(
                              (value) => value === "rejected"
                            )
                              ? "Intentar de nuevo"
                              : "Subir recuerdos"}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </div>
                </ScrollArea>
            </div>
            <div className="relative h-fit">
              {monthDataLoading && (
                <div className="absolute w-full h-[calc(100%-1.25rem)] bottom-0 left-1/2 -translate-x-1/2 z-40 max-w-[550px] max-h-[427px] bg-[#931C4B] flex items-center justify-center rounded-md">
                  <Spinner className="text-[#EDDDE9]" />
                </div>
              )}
              <Calendar
                mode="single"
                hideNavigation={true}
                captionLayout="label"
                locale={es}
                {...calendarProps}
                className="p-2 md:p-4 w-full md:mx-auto md:max-w-[550px] max-h-[427px] transition-all mt-5 md:mt-10 rounded-[12px] bg-[#EDDDE9]"
                classNames={{
                  month_caption: "hidden",
                }}
                onDayClick={handleDayClick}
                components={{
                  DayButton: (props: DayButtonProps) => (
                    <CustomDayButton {...props} thumbsByDay={thumbsByDay} />
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
