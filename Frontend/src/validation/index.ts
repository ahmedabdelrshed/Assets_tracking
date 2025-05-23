import * as yup from "yup";

export const registerSchema = yup.object({
    name: yup.string().required("Username is required").min(5, "Username should be at least 5 characters."),
    username: yup.string().required("Email is required").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please Enter a valid Email."),
    password: yup.string().required("Password is required")
        .min(8, "Password must be at least 8 characters long"),
})

export const loginSchema = yup.object({
    username: yup.string().required("Email is required").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please Enter a valid Email."),
    password: yup.string().required("Password is required")
})

export const validateTodo = (title: string, description: string) => {
    const errors = { title: "", description: "" }
    if (title.trim() === '') errors.title = "Please enter a title todo"
    if (description.trim() === '') errors.description = "Please enter a description todo"
    return errors;
}