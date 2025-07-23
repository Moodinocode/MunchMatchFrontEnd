import React from 'react'

const RestaurantCard = ({ imageUrls, title, description, tags, isNew =false}) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm border m-5">
        <figure>
            <img src={imageUrls?.[0]} alt={title} className='h-48 m-3'  />
        </figure>
        <div className="card-body">
            <h2 className="card-title">
            {title}
            {isNew && <div className="badge badge-secondary">NEW</div>}
            </h2>
            <p>{description}</p>
            <div className="card-actions justify-end">
                {tags.map((cat, idx) => (
                <div key={idx} className="badge badge-outline bg-amber-300">
                {cat}
                </div>
            ))}
            </div>
        </div>
    </div>
  )
}

export default RestaurantCard