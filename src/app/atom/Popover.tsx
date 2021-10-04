import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Popover as TinyPopover,
  ArrowContainer,
  PopoverProps,
} from 'react-tiny-popover';
import cn from 'classnames';
import { ReactComponent as HelpIcon } from 'assets/icons/help-circle.svg';

type Props = {
  children: React.ReactChild;
  content: React.ReactNode;
  popoverProps?: PopoverProps;
  showHelpIcon?: boolean;
  helpIconClassName?: string;
};

const Popover: React.FC<Props> = ({
  children,
  content,
  popoverProps,
  showHelpIcon,
  helpIconClassName,
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const togglerRef = useRef(null);

  const handleEvent = useCallback(
    (value: string) => () => setPopoverOpen(value === 'enter'),
    [],
  );

  const element = useMemo(
    () =>
      React.cloneElement(
        <span
          className={cn(
            showHelpIcon &&
              'flex flex-row justify-start items-center space-x-1',
          )}
        >
          {React.Children.toArray(children)[0]}
          {showHelpIcon && <HelpIcon className={cn(helpIconClassName)} />}
        </span>,
        {
          ref: togglerRef,
          onMouseEnter: handleEvent('enter'),
          onMouseLeave: handleEvent('leave'),
        },
      ),
    [children, handleEvent, showHelpIcon, helpIconClassName],
  );

  return (
    <TinyPopover
      isOpen={isPopoverOpen}
      reposition={true}
      padding={10}
      positions={['top', 'bottom', 'left', 'right']}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowSize={12}
          arrowColor='#111827'
        >
          <div className='popover'>{content}</div>
        </ArrowContainer>
      )}
      onClickOutside={handleEvent('leave')}
      {...popoverProps}
    >
      {element}
    </TinyPopover>
  );
};

Popover.defaultProps = {
  helpIconClassName: 'w-4 h-4 fill-current',
};

export default Popover;
