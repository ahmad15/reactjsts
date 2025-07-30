import { ChangeEvent } from "react";

import '../styles/Switch.scss';

interface SwitchProperties {
  id: string;
  label: string;
  "data-on"?: string;
  isChecked: boolean;
  "data-off"?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Switch(props: SwitchProperties) {
  const labelId = `label-${props.id}`;
  const descriptionId = `description-${props.id}`;

  const labelBy = labelId + ' ' + descriptionId;

  return (    
    <label htmlFor={props.id} className="switch">
      <input
        id={props.id}
        type="checkbox"
        role="switch"
        data-on={props['data-on']}
        checked={props.isChecked}
        data-off={props['data-off']}
        onChange={props.onChange}
        aria-checked={props.isChecked}
        aria-labelledby={labelBy}
      />
      <div className="switch-labels">
        <span id={labelId}>{props.label}</span>
      </div>
    </label>
  );
}

Switch.defaultProps = {
  "data-on": 'ON',
  "data-off": 'OFF'
}

export default Switch;
