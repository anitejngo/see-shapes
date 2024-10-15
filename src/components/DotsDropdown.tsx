import React from 'react';

interface DotsDropdownProps {
  options: Array<{ label: string; onClick: () => void }>;
}

export function DotsDropdown({ options }: DotsDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        id="dropdownMenuIconHorizontalButton"
        data-dropdown-toggle="dropdownDotsHorizontal"
        className={`border inline-flex items-center px-4 py-2.5 ml-1 text-sm font-medium text-center text-gray-900 bg-white rounded hover:bg-gray-100 hover:text-gray-600`}
        type="button"
        onClick={toggleDropdown}>
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 3">
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
        </svg>
      </button>

      <div
        id="dropdownDotsHorizontal"
        className={`z-10 ${
          isOpen ? 'block' : 'hidden'
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute right-0`}>
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="dropdownMenuIconHorizontalButton">
          {options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className="block w-full line-clamp-1 px-4 py-2 hover:bg-gray-100">
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
