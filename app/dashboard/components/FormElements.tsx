export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
) => {
  return (
    <input
      {...props}
      className="border-[#55b0e9] border-2 rounded-md w-full px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary"
    />
  );
};
export const Textarea: React.FC<
  React.InputHTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  return (
    <textarea
      {...props}
      className="border-[#55b0e9] border-2 rounded-md w-full px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary"
    />
  );
};
