import type { UploadStateType } from "@/types/general"
import { Check, CircleX } from "lucide-react"
import { Spinner } from "../ui/spinner"
import type { ComponentType, SVGProps } from "react"

interface Props {
  state: UploadStateType
  image?: string
}

function getOverlayProps(state: UploadStateType) {
  const props: {
    message: string
    background: string
    textColor: string
    IconComponent?: ComponentType<SVGProps<SVGSVGElement>>
  } = {
    message: "",
    background: "none",
    textColor: "text-black",
    IconComponent: undefined,
  }

  switch (state) {
    case "pending":
      props.message = "Subiendo recuerdo"
      props.background = "bg-state-pending"
      props.textColor = "text-state-pending-foreground"
      props.IconComponent = Spinner
      break
    case "fulfilled":
      props.message = "¡Recuerdo subido!"
      props.background = "bg-state-fulfilled"
      props.textColor = "text-state-fulfilled-foreground"
      props.IconComponent = Check
      break
    case "rejected":
      props.message = "Algo salió mal"
      props.background = "bg-state-pending"
      props.textColor = "text-state-pending-foreground"
      props.IconComponent = CircleX
      break
    default:
      props.message = "State not valid"
      props.background = "none"
      props.textColor = "text-black"
      props.IconComponent = Check
      break
  }

  return props
}

export default function UploadStateOverlay({ state, image }: Props) {
  const { IconComponent, message, background, textColor } =
    getOverlayProps(state)
  return (
    <div
      className={`absolute inset-0 ${background} ${textColor} rounded-md flex items-center justify-around gap-0.5 z-40 p-4`}
    >
      {image && (
        <figure>
          <img
            src={image}
            alt="Imagen cargada"
            width={50}
            height={50}
            className="object-cover aspect-square rounded-sm"
          />
        </figure>
      )}
      <div className="flex grow items-center justify-center gap-0.5">
        {IconComponent && <IconComponent />}
        <p className={`font-diphylleia`}>{message}</p>
      </div>
    </div>
  )
}
