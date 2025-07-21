interface ErrorMessageProps {
  message?: string;
}
const ErrorMessage = ({ message }: ErrorMessageProps) =>
  message ? <div className="text-xs text-red-500 mt-1">{message}</div> : null;

export default ErrorMessage;
