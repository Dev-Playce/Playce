interface ErrorTextProps {
  message?: string;
}

const ErrorText = ({ message }: ErrorTextProps) => {
  return <p className="pt-2 pl-2 m-0 text-red-500">{message}</p>;
};

export default ErrorText;
