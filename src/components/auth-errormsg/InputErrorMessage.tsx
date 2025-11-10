interface IProps {
  msg?: string;
}

const InputErrorMessage = ({ msg }: IProps) => {
  return msg ? (
    <span className="block text-red-600 font-medium text-sm">{msg}</span>
  ) : null;
};

export default InputErrorMessage;
