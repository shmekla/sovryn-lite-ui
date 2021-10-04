import React, { useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import CircularProgress from './CircularProgress';

type SpinnerProps = {
  className: string;
  show?: boolean;
  size?: number;
  strokeWidth?: number;
  transitionMs?: number;
};

const Spinner: React.FC<SpinnerProps> = ({
  className,
  show,
  size,
  strokeWidth,
  transitionMs,
}) => {
  const ref = useRef<HTMLDivElement>(null!);
  return (
    <TransitionGroup appear={true} component={null}>
      {show && (
        <CSSTransition
          key='spinner'
          nodeRef={ref}
          timeout={300}
          classNames='spinner'
        >
          <div className={cn(className)} ref={ref}>
            <div className='animate-spin'>
              <CircularProgress
                progress={50}
                size={size}
                strokeWidth={strokeWidth}
                transitionMs={transitionMs}
              />
            </div>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

Spinner.defaultProps = {
  show: true,
  size: 24,
  strokeWidth: 3,
  transitionMs: 50,
};

export default Spinner;
