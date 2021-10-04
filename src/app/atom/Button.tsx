import React, { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

type ButtonIntent = 'success' | 'danger';

const Button: React.FC<
  React.DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { text: React.ReactNode; intent?: ButtonIntent; loading?: boolean }
> = ({ text, className, intent, loading, ...props }) => (
  <button
    {...props}
    className={cn(
      'py-2 px-5 text-white font-light rounded-lg transition duration-300',
      props.disabled && 'bg-opacity-25 cursor-not-allowed',
      intent === 'success' && 'bg-green-500 hover:bg-green-400',
      intent === 'danger' && 'bg-red-600 hover:bg-red-500',
      loading && 'cursor-progress',
      className,
    )}
  >
    {text}
  </button>
);

Button.defaultProps = {
  intent: 'success',
};

export default Button;
