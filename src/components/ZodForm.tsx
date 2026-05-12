import { useForm } from "react-hook-form"
import { DevTool} from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

let renderCount = 0

const schema = z.object({
    username: z.string().nonempty("Username is required"),
    email: z.email("Email format is not valid").nonempty("Email is required"),
    channel: z.string("required")
})

type FormValues = {
    username: string
    email: string
    channel: string
}

export const ZodForm = () => {

    const form = useForm<FormValues>({
        defaultValues: {
            username: "",
            email: "",
            channel: ""
        },
        resolver: zodResolver(schema)
    })
    const{ register, control, handleSubmit, formState } = form
    const { errors } = formState
    const onSubmit = (data: FormValues) => {
        console.log('Form Submitted', data)
    }

    renderCount++
    return (
        <div>
            <h1>Zoddie Form ({renderCount/2})</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" {...register("username")}></input>
                    <p className="error">{errors.username?.message}</p>
                </div>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" {...register("email")}></input>
                    <p className="error">{errors.email?.message}</p>
                </div>
                <div className="form-control">
                    <label htmlFor="channel">Channel</label>
                    <input type="text" id="channel" {...register("channel")}></input>
                    <p className="error">{errors.channel?.message}</p>
                </div>
                <br></br>
                <button>Submit</button>
            </form>
            <DevTool control={control}></DevTool>
        </div>
    )
}