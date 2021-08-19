import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ReactComponent as Close } from 'assets/icons/close.svg';
import { useRef } from 'react';

interface DialogProps {
  children: React.ReactChild;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Dialog(props: DialogProps) {
  const [el, setElement] = useState<HTMLElement>();
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    const modalRoot = document.body;
    const element = document.createElement('div');
    modalRoot.appendChild(element);
    setElement(element);
    return () => {
      modalRoot.removeChild(element);
    };
  }, []);

  useLayoutEffect(() => {
    if (props.isOpen) {
      document.body.classList.add('dialog-open');
    } else {
      document.body.classList.remove('dialog-open');
    }
  }, [props.isOpen]);

  const handleClose = useCallback(() => {
    if (props.onClose) {
      props.onClose();
    }
  }, [props]);

  // const childrenWithTransitions = useMemo(() => {
  //   const items = props.isOpen ? React.Children.map(props.children, (child: React.ReactChild) => {
  //     if (child == null) {
  //       return null;
  //     }
  //     // add a special class to each child element that will automatically set the appropriate
  //     // CSS position mode under the hood. also, make the container focusable so we can
  //     // trap focus inside it (via `enforceFocus`).
  //     const decoratedChild =
  //       typeof child === "object" ? (
  //         React.cloneElement(child, {
  //           className: cn(child.props.className, 'overlay-content'),
  //           tabIndex: 0,
  //         })
  //       ) : (
  //         <span className={'overlay-content'}>{child}</span>
  //       );
  //     return (
  //       <CSSTransition classNames='dialog-transition' timeout={300}>
  //         {decoratedChild}
  //       </CSSTransition>
  //     );
  //
  //   }) : [];
  //   return items;
  // }, [props.children, props.isOpen]);

  if (el) {
    // todo: implement transitions.
    return createPortal(
            <TransitionGroup appear={true}>
              {props.isOpen && <CSSTransition nodeRef={overlayRef} classNames='overlay' timeout={300} key="__backdrop"><div ref={overlayRef} className="dialog--backdrop"/></CSSTransition>}
              {props.isOpen && <CSSTransition nodeRef={dialogRef} classNames='dialog' timeout={300} key="__dialog">
                <div ref={dialogRef} className="dialog-wrapper">
                <div className={cn('dialog--container', props.className)}>
                  <div className="dialog">
                    {props.onClose && <button className="fill-current absolute top-5 right-5" onClick={handleClose}>
                      <Close/>
                    </button>}
                    {props.children}
                  </div>
                </div>
                </div></CSSTransition>}
            </TransitionGroup>,
      el,
    );
  }

  return null;
}
