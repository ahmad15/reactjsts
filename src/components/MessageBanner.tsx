import { useEffect } from 'react';
import isEmpty from 'lodash.isempty';

interface MessageBannerProperties {
  successMessage?: string;
  errorMessage?: string;
  autoClose?: number;
  onCLose: () => void;
}

function MessageBanner({ onCLose, ...props }: MessageBannerProperties) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCLose();
    }, (props.autoClose || 10000));
    return () => clearTimeout(timer);
  }, [onCLose, props.autoClose]);

  return (
    <section>
    { !isEmpty(props.successMessage) ? <div className="success-message">
        {props.successMessage}
        <button type='button' className='btn-logout' onClick={onCLose}>x</button>
      </div> : !isEmpty(props.errorMessage) ? <div className="error-message">
        {props.errorMessage}
        <button type='button' className='btn-logout' onClick={onCLose}>x</button>
      </div> : null }
    </section>
  );
}

export default MessageBanner;