import { ChangeEvent, useState } from 'react';

export default function Component4487() {
  const [textValue, setTextValue] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  return <input type="text" onChange={onChange} value={textValue} />;
}