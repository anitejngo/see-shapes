import React, { ReactElement } from 'react';

interface IconCheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  checkedIcon: ReactElement;
  uncheckedIcon: ReactElement;
}

export function IconCheckBox({ checked, onChange, checkedIcon, uncheckedIcon }: IconCheckBoxProps) {
  return (
    <div>
      <button
        onClick={() => {
          onChange(!checked);
        }}>
        {checked ? checkedIcon : uncheckedIcon}
      </button>
    </div>
  );
}
