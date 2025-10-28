import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useDateSelect from "@/hooks/useDateSelect"
import { INITIAL_YEAR, months } from "@/lib/constants"
import { useCallback } from "react"
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
import { Separator } from '@/components/ui/separator'
import * as exif from 'exifr'
import compressImage from '@/lib/compressImage'
import uploadImage from '@/lib/uploadImage'
import getUrls from '@/lib/getUrl'

export default function CalendarRoute() {
  const {
    selectProps: { selectedMonth, selectedYear, onMonthChange, onYearChange },
    calendarProps: {
      calendarDate,
      selectedDate,
      setCalendarDate,
      handleDayPickerSelect,
    },
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
      const parsedMetadata = await Promise.all(acceptedFiles.map((file) => {
        return exif.parse(file)
      }));

      acceptedFiles.forEach((file, i) => {
        append({
          file,
          name: file.name,
          date: parsedMetadata[i]?.CreateDate || new Date(file.lastModified),
          type: file.type
        })
      })
    },
    [append]
  )

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const optimizedImages = await Promise.allSettled(values.images.map(({ file }) => {
        return compressImage(file);
      }))

      const presignedUrls = await getUrls(values.images.map(({ file }) => ({
        name: file.name,
        type: file.type
      })))

      console.log({presignedUrls})

      await Promise.allSettled(optimizedImages.map((result, i) => {
        if (result.status === 'rejected') return

        const file = result.value;
        const url = presignedUrls?.[i]

        if (!file || !url) return;
        return uploadImage(file, presignedUrls[i])
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
      <input {...getInputProps()} />
      <div className="w-full px-20 pt-20 max-w-6xl mx-auto">
        <h1 className="font-great-vibes text-7xl text-center">Nuestros días</h1>
        <div className="grid grid-cols-[1fr_2fr] justify-center max-h-[500px]">
          <div className="flex flex-col gap-4 grow">
            <div>
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
            </div>
            {fields.length > 0 && (
              <ScrollArea className="h-[400px] p-4 bg-white rounded-md">
                <div>
                  <h2 className="font-diphylleia mb-2 text-center text-lg">
                    Cargar recuerdos ♥️
                  </h2>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      id="upload-form"
                      className="space-y-4"
                    >
                      {fields.map((field, index) => (
                        <div key={field.id}>
                          <div className="flex items-center gap-2 relative">
                            <Button
                              variant="destructive"
                              className='w-4 p-1 h-auto aspect-square'
                              onClick={() => remove(index)}
                            >
                              <X />
                              <span className='sr-only'>Eliminar</span>
                            </Button>
                            <figure>
                              <img
                                src={URL.createObjectURL(field.file)}
                                alt={field.name}
                                width={50}
                                height={50}
                                className="object-cover aspect-square rounded-sm"
                              />
                            </figure>
                            <div className='space-y-1 ml-2 grow'>
                              <FormField
                                control={form.control}
                                name={`images.${index}.name`}
                                render={({ field }) => (
                                  <FormItem className='gap-0.5'>
                                    <FormLabel className='text-xs'>Nombre</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Recuerdo 1"
                                        className='text-xs!'
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
                                  <FormItem className="flex flex-col gap-0.5">
                                    <FormLabel className='text-xs'>Fecha</FormLabel>
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
                                              format(field.value, "PPP", { locale: es })
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
                            </div>
                          </div>
                          {
                            index < fields.length - 1 && (
                              <Separator className='w-full' />
                            )
                          }
                        </div>
                      ))}
                    <Button type='submit' className='w-full'>
                      Subir recuerdos
                    </Button>
                    </form>
                  </Form>
                </div>
              </ScrollArea>
            )}
          </div>
          <Calendar
            mode="single"
            hideNavigation={true}
            captionLayout="label"
            locale={es}
            month={calendarDate}
            onMonthChange={setCalendarDate}
            selected={selectedDate}
            onSelect={handleDayPickerSelect}
            className="p-4 w-full mx-auto max-w-[550px] mt-10 rounded-md"
            classNames={{
              month_caption: "hidden",
            }}
          />
        </div>
      </div>
    </div>
  )
}
