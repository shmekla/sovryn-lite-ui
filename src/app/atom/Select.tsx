import React, { HTMLProps } from 'react';
import cn from 'classnames';

const Select: React.FC<HTMLProps<HTMLSelectElement>> = ({
  className,
  children,
  ...props
}) => (
  <select
    {...props}
    className={cn(
      'py-2 px-3 bg-white text-black dark:bg-black dark:text-white font-light rounded-lg transition w-full appearance-none select__caret',
      className,
    )}
    lang={navigator?.language}
  >
    {children}
  </select>
);

export default Select;
