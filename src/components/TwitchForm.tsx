import { useFieldArray, useForm, type FieldErrors } from "react-hook-form"
import { DevTool} from "@hookform/devtools"
import { useEffect } from "react"
// Advanced Hook Form Features
let renderCount = 0

type FormValues = {
    username: string
    email: string
    channel: string
    social: {
        tiktok: string
        twitter: string
    }
    phones: string[]
    phNums: {
        number: string
    }[]
    age: number
    dob: Date
}

export const TwitchForm = () => {

    const form = useForm<FormValues>({
        defaultValues: {
            username: 'Tzuyu Chou',
            email: 'tzuyu@twice.com',
            channel: 'tzuyu4u',
            social: {
                    tiktok: "",
                    twitter: ""
                },
            phones: ["",""],
            phNums: [{ number: ""}],
            age: 0,
            dob: new Date()
        },
        //determines when the validation occurs, is optional
        mode: "onSubmit"
        /*defaultValues: async () => {
            const response = await fetch("https://jsonplaceholder.typicode.com/users/1")
            const data = await response.json()
            return {
                username: "Tzuyu",
                email: data.email,
                channel: "",
                social: {
                    tiktok: "",
                    twitter: ""
                }
            }
        }*/
    })
    const{ register, control, handleSubmit, formState , watch, getValues, setValue, reset} = form
    const { errors, isDirty, isSubmitting, isSubmitSuccessful } = formState
    //console.log({isSubmitting})
    //console.log({touchedFields, dirtyFields, isDirty})
    const { fields, append, remove } = useFieldArray({
        name: 'phNums',
        control
    })
    const onSubmit = (data: FormValues) => {
        console.log('Form Submitted', data)
    }
    const onError = (errors: FieldErrors<FormValues>) => {
        console.log("Form submitted ", errors)
    }
    // watch form values, if you dont'specify one, all is displayed
    const watchUsername = watch("username")
    // watch any form input change in the browser console
    useEffect(() => {
        const subscription = watch((value) => {
            console.log(value)
        })
        return () => subscription.unsubscribe()
    },[watch])

    const handleGetValues = () => {
        // You can pass field parameters to getValues("username")
        console.log("Get values", getValues())
    }

    const handleSetValue = () => {
        console.log("Set value", setValue("username", "Nayeon", {
            shouldDirty: true
        }))
    }
    // does not function
    useEffect(() => {
        if(isSubmitSuccessful) {
            reset()
        }
    },[isSubmitSuccessful, reset])

    renderCount++
    return (
        <div>
            <h1>Twitch Form ({renderCount/2})</h1>
            <h2>Watched value: {watchUsername}</h2>
            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
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
                            },
                            emailAvailable: async (fieldValue) => {
                            const response = await fetch(
                                `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                            )
                            const data  = await response.json()
                            return data.length == 0 || "Email already exists"
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
                <div className="form-control">
                    <label htmlFor="tiktok">TikTok</label>
                    <input type="text" id="tiktok" {...register("social.tiktok")}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="twitter">Twitter</label>
                    <input type="text" id="twitter" {...register("social.twitter", {
                        disabled: false,
                        required: "Enter twitter"
                    })}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="primary-phone">Primary Phone</label>
                    <input type="text" id="primary-phone" {...register("phones.0")}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="secondary-phone">Mobile</label>
                    <input type="text" id="secondary-phone" {...register("phones.1")}></input>
                </div>
                <div>
                    <label>List of phone numbers</label>
                    <div>
                        {
                            fields.map((field, index) => {
                                return (
                                    <div className = "form-control" key = {field.id}>
                                        <input type="text" {...register(`phNums.${index}.number` as const)}></input>
                                        {
                                            index > 0 && (
                                                <button type="button" onClick={() => remove(index)}>Remove Phone Number</button>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                        <button type="button" onClick={() => append({number : ""})}>Add Phone Number</button>
                    </div>
                </div>
                <div className="form-control">
                    <label htmlFor="age">Age</label>
                    <input type="number" id="age" {...register("age", {
                        valueAsNumber: true,
                        required: 'Required field'
                    })}></input>
                    <p className="error">{errors.age?.message}</p>
                </div>
                <div className="form-control">
                    <label htmlFor="dob">Dob</label>
                    <input type="date" id="dob" {...register("dob", {
                        valueAsDate: true,
                        required: 'Required field'
                    })}></input>
                    <p className="error">{errors.dob?.message}</p>
                </div>
                <br></br>
                <button disabled={!isDirty || isSubmitting}>Submit</button>
                <button type="button" onClick={handleGetValues}>Get Values</button>
                <button type="button" onClick={handleSetValue}>Set Value</button>
                <button type="button" onClick={() => reset()}>Reset</button>
            </form>
            <DevTool control={control}></DevTool>
        </div>
    )
}