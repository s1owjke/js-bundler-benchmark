import { ChangeEvent, useState } from 'react';

export default function Component1901() {
  const [textValue, setTextValue] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  return <input type="text" onChange={onChange} value={textValue} />;
}
