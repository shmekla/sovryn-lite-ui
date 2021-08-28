import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRef } from 'react';

interface OverlayProps {
  children: React.ReactChild;
  usePortal?: boolean;
  isOpen?: boolean;
  className?: string;
  enforceFocus?: boolean;
  autoFocus?: boolean;
}

export function Overlay(props: OverlayProps) {
  const [el, setElement] = useState<HTMLElement>();
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const childRef = useRef(null);

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

  const maybeRenderBackdrop = useCallback(() => {
    if (props.isOpen) {
      return (
        <CSSTransition nodeRef={overlayRef} classNames='overlay' timeout={300} key="__backdrop"><div ref={overlayRef} className="dialog--backdrop"/></CSSTransition>
      );
    }
    return null;
  }, [props.isOpen]);

  const maybeRenderChild = useCallback((child?: React.ReactNode, index?: number) => {
    if (typeof child === 'function') {
      child = child();
    }
    if (child === null) {
      return null;
    }

    // add a special class to each child element that will automatically set the appropriate
    // CSS position mode under the hood. also, make the container focusable so we can
    // trap focus inside it (via `enforceFocus`).
    const decoratedChild =
      typeof child === "object" ? (
        React.cloneElement(child as React.ReactElement, {
          className: cn((child as React.ReactElement).props.className, 'overlay-content'),
          tabIndex: props.enforceFocus || props.autoFocus ? 0 : undefined,
          ref: childRef,
        })
      ) : (
        <span className={'overlay-content'} ref={childRef}>{child}</span>
      );

      return (
        <CSSTransition nodeRef={childRef} classNames='dialog' timeout={300} key={index}>{decoratedChild}</CSSTransition>
      );
  }, [props.autoFocus, props.enforceFocus]);

  const childrenWithTransitions = useMemo(() => {
    const items = props.isOpen ? React.Children.map(props.children, maybeRenderChild) ?? [] : [];
    const maybeBackdrop = maybeRenderBackdrop();
    if (maybeBackdrop !== null) {
      items.unshift(maybeBackdrop);
    }
    return items;
  }, [props.children, props.isOpen, maybeRenderChild, maybeRenderBackdrop]);

  // const handleKeyDown = (e: any) => console.log(e);

  const transitionGroup = useMemo(() => {
    return (
      <TransitionGroup
        appear={true}
        className={cn('overlay', props.isOpen && 'overlay-open')}
        // onKeyDown={handleKeyDown}
        ref={containerRef}
      >
        {childrenWithTransitions}
      </TransitionGroup>
    )
  }, [childrenWithTransitions, props.isOpen]);

  if (props.usePortal) {
    return el ? createPortal(transitionGroup, el) : null;
  } else {
    return transitionGroup;
  }
  // if (el) {
  //   // todo: implement transitions.
  //   return createPortal(
  //     <TransitionGroup appear={true}>
  //       {props.isOpen && <CSSTransition nodeRef={overlayRef} classNames='overlay' timeout={300} key="__backdrop"><div ref={overlayRef} className="dialog--backdrop"/></CSSTransition>}
  //       {props.isOpen && <CSSTransition nodeRef={dialogRef} classNames='dialog' timeout={300} key="__dialog">
  //         <div ref={dialogRef} className="dialog-wrapper">
  //           <div className={cn('dialog--container', props.className)}>
  //             <div className="dialog">
  //               {props.onClose && <button className="fill-current absolute top-5 right-5" onClick={handleClose}>
  //                 <Close/>
  //               </button>}
  //               {props.children}
  //             </div>
  //           </div>
  //         </div></CSSTransition>}
  //     </TransitionGroup>,
  //     el,
  //   );
  // }
  //
  // return null;
}

Overlay.defaultProps = {
  usePortal: true,
};
