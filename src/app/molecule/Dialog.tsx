import React, { useCallback } from 'react';
import cn from 'classnames';
import { ReactComponent as Close } from 'assets/icons/close.svg';
import { Overlay } from './Overlay';

interface DialogProps {
  children: React.ReactChild;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Dialog(props: DialogProps) {
  const handleClose = useCallback(() => {
    if (props.onClose) {
      props.onClose();
    }
  }, [props]);

  return (
    <Overlay isOpen={props.isOpen}>
      <div className='dialog-wrapper'>
        <div className={cn('dialog--container', props.className)}>
          <div className='dialog'>
            {props.onClose && (
              <button
                type='button'
                className='fill-current absolute top-2 right-2'
                onClick={handleClose}
              >
                <Close />
              </button>
            )}
            {props.children}
          </div>
        </div>
      </div>
    </Overlay>
  );
}
