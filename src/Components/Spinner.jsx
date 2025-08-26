import React from 'react'

const Spinner = ({ size = "md", className = "" }) => {
  return (
        <span
      className={`loading loading-spinner loading-${size} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner