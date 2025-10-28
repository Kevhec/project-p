import z from 'zod'

const imageSchema = z.object({
  file: z.instanceof(File),
  name: z.string().min(1, "El nombre es obligatorio"),
  date: z.date().min(1, "La fecha es obligatoria"),
  type: z.string()
})

const formSchema = z.object({
  images: z.array(imageSchema).nonempty("Se debe cargar por lo menos un recuerdo")
})

export {
  imageSchema,
  formSchema,
}
