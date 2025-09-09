import { ChangeEvent } from "react";
import CONST from "../constants";

interface StatusSelectProperties {
  id: string;
  name: string;
  required: boolean | false;
  value: string;
  readOnly?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

function StatusSelect(props: StatusSelectProperties) {
  const { id, name, value } = props;

  return (
    <select name={name} id={id} value={value} onChange={props.onChange}>
      { Object.keys(CONST.STATUS).map((key) => (
        <option key={key} value={CONST.STATUS[key as keyof typeof CONST.STATUS]}>
          {key}
        </option>
      )) }
    </select>
  );
}

export default StatusSelect;
