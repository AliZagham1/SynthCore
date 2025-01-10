
import Image from "next/image"

export const Loader = () => {
    return (
        <div className="h-full flex flex-col justify-center items-center">
            <div className="w-10 h-10 rounded-full border-t-4 border-b-4 border-white animate-spin">
                <Image src = "/logo.png" alt = "logo" width = "100" height = "100" />

            </div>
            <p className="text-sm text-muted-foreground">
                SynthCore is thinking...
            </p>
        </div>
    )
}