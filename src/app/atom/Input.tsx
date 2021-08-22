import React, { InputHTMLAttributes } from 'react';
import cn from 'classnames';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({className, ...props}) => <input {...props} className={cn('py-2 px-5 bg-black text-white font-light rounded-lg transition w-full', className)} />;

export default Input;
