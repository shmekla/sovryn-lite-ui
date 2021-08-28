import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import Button from '../atom/Button';

type PopoverProps = {
  // referenceElement: any;
};

export const Popover: React.FC<PopoverProps> = () => {

  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const [arrowElement, setArrowElement] = useState<any>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  return (
    <>
      <Button aria-describedby="tooltip" ref={setReferenceElement} text="Popover" />
      <div role="tooltip" className="bg-black p-3 rounded-lg text-white" ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        Popper element
        <div ref={setArrowElement!} style={styles.arrow} />
      </div>
    </>
  );
};
