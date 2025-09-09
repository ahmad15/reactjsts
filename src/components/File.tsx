import { ChangeEvent } from "react";

interface FileProperties {
  id: string;
  required: boolean | false;
  readonly?: boolean;
  acceptType: string;
  fileInfo: File | null;
  readOnly?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function File(props: FileProperties) {
  const { fileInfo } = props;

  return (    
    <section>
        <input type="file" id={props.id} required={props.required} accept={props.acceptType} onChange={props.onChange} readOnly={props.readonly} />
        {fileInfo && (
          <section className="file-details">
            File details:
            <ul>
              <li>Name: {fileInfo?.name}</li>
              <li>Type: {fileInfo?.type}</li>
              <li>Size: {fileInfo?.size} bytes</li>
            </ul>
          </section>
        )}
    </section>
  );
}

export default File;
