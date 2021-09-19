import React, { InputHTMLAttributes } from 'react';
import cn from 'classnames';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({className, ...props}) => <input {...props} className={cn('py-2 px-3 bg-white text-black dark:bg-black dark:text-white font-light rounded-lg transition w-full', className)} lang={navigator?.language} />;

export default Input;
