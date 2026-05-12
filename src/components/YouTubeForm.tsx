import { useForm } from "react-hook-form"
import { DevTool} from "@hookform/devtools"

let renderCount = 0

type FormValues = {
    username: string
    email: string
    channel: string
}

export const YouTubeForm = () => {

    const form = useForm<FormValues>()
    const{ register, control, handleSubmit, formState } = form
    const { errors } = formState
    const onSubmit = (data: FormValues) => {
        console.log('Form Submitted', data)
    }

    renderCount++
    return (
        <div>
            <h1>YouTube Form ({renderCount/2})</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" {...register("username", {
                        required: {
                            value: true,
                            message: 'Required field'

                        }
                    })}></input>
                    <p className="error">{errors.username?.message}</p>
                </div>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" {...register("email", {
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email'
                        },
                        //Custom Validations
                        validate: {
                            notAdmin: (fieldValue) => {
                                return (fieldValue !== "admin@gmail.com" || "Enter a different email")
                            },
                            notBanned: (fieldValue) => {
                                return (!fieldValue.endsWith("banned.com") || "Invalid email domain")
                            }
                        }
                    })}></input>
                    <p className="error">{errors.email?.message}</p>
                </div>
                <div className="form-control">
                    <label htmlFor="channel">Channel</label>
                    <input type="text" id="channel" {...register("channel", {
                        required: 'Required field'
                    })}></input>
                    <p className="error">{errors.channel?.message}</p>
                </div>
                <br></br>
                <button>Submit</button>
            </form>
            <DevTool control={control}></DevTool>
        </div>
    )
}