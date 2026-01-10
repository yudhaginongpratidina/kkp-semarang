interface FormControlProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode
}

export default function FormControl({ children, onSubmit, ...props }: FormControlProps) {
    return (
        <form {...props} onSubmit={(e) => {
            e.preventDefault()
            onSubmit?.(e)
        }} className="w-full flex flex-col gap-4">
            {children}
        </form>
    )
}