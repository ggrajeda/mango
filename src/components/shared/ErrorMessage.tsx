interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-md p-3 text-sm text-destructive bg-destructive/3 border border-destructive relative">
      {message}
    </div>
  )
}
