import React from 'react';

const TrashIcon = ({ className = '' }) => {
  return (
    <svg
      className={`icon-trash w-7 h-10 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 40"
    >
      <path
        className="trash-lid origin-bottom-right transition-transform duration-200 ease-in-out group-hover:translate-y-[-2px] group-hover:rotate-[30deg]"
        fillRule="evenodd"
        d="M6 15l4 0 0-3 8 0 0 3 4 0 0 2 -16 0zM12 14l4 0 0 1 -4 0z"
      />
      <path
        className="trash-can"
        d="M8 17h2v9h8v-9h2v9a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z"
      />
    </svg>
  );
};

export default TrashIcon;
