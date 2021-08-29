import React, { useCallback, useRef, useState } from 'react';
import { Popover as TinyPopover, ArrowContainer, PopoverProps } from 'react-tiny-popover';

type Props = {
  children: React.ReactChild;
  content: React.ReactNode;
  popoverProps?: PopoverProps;
};

const Popover: React.FC<Props> = ({ children, content, popoverProps }) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const togglerRef = useRef(null);

  const handleEvent = useCallback((value: string) => () => setPopoverOpen(value === 'enter'), []);

  const element = React.cloneElement(React.Children.toArray(children)[0] as any, {
    ref: togglerRef,
    onMouseEnter: handleEvent('enter'),
    onMouseLeave: handleEvent('leave'),
  });

  return (
    <TinyPopover
      isOpen={isPopoverOpen}
      reposition={true}
      containerClassName="popover"
      positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
      content={({ position, childRect, popoverRect }) => <ArrowContainer position={position} childRect={childRect}
                                                                         popoverRect={popoverRect} arrowSize={12}
                                                                         arrowColor="blue"
                                                                         className='popover-arrow-container'
                                                                         arrowClassName='popover-arrow'><>{content}</>
      </ArrowContainer>}
      onClickOutside={handleEvent('leave')}
      {...popoverProps}
    >
      <>{element}</>
    </TinyPopover>
  );
};

export default Popover;
