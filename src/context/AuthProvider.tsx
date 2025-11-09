import type { AuthContextType } from "@/types/auth"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"
import { auth as standaloneAuth } from '@/config/firebase';
import { AuthContext } from "./authContext"
import { loginPopUp } from "@/config/firebase"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { toast } from 'sonner';

const ALLOWED_USERS = [
  { email: "pjmnzcvs@gmail.com", myPrincess: true },
  { email: "kevhec.dev@gmail.com", myPrincess: false },
  { email: "kevinalejandrohenca@gmail.com", myPrincess: false },
]

function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthContextType["user"]>()
  const [loading, setLoading] = useState(true)
  const auth = getAuth()

  const login = useCallback(async () => {
    setLoading(true)
    try {
      const response = await loginPopUp()
      const user = response.user

      const allowedUser = ALLOWED_USERS.find((validUser) => validUser.email === user.email)

      if (!allowedUser) {
        signOut(standaloneAuth)

        toast.error("Acceso denegado", {
          className: '!bg-red-500 !text-white !font-diphylleia'
        })
      } else {
        if (allowedUser.myPrincess) {
          toast("Bienvenida amor de mi vida 🤍", {
            className: '!bg-[#C42765] !text-white !font-diphylleia'
          })
        }
        setUser(user)
      }
    } catch (error) {
      toast.error("Error al iniciar sesión", {
        className: '!bg-red-500 !text-white !font-diphylleia'
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
    }),
    [user, loading, login]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
