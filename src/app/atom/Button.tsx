import React, { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & { text: React.ReactNode }> = ({text, className, ...props}) => <button {...props} className={cn('py-2 px-5 bg-green-500 text-white font-light rounded-lg transition duration-300 hover:bg-green-400', className)}>{text}</button>;

export default Button;
