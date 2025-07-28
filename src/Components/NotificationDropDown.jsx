import { Bell, X, Check, Clock } from 'lucide-react'
import { useState } from 'react'
import { checkNotifications } from '../Services/notificationService'
import useNotificationStore from '../store/useNotificationStore'

const NotificationDropDown = ({ notifications }) => {
  const [showAll, setShowAll] = useState(false)
  const {checkedNotifications} = useNotificationStore()
  
  const handleClick = (e) => {
    e.preventDefault();
    console.log("checked")
    checkNotifications()
      .then(response => {
        console.log(response.data)
        checkedNotifications()
      })
      .catch(error => console.log(error) )
  
  }

  const validNotifications = notifications?.filter(Boolean) || []
  const unreadCount = validNotifications.filter(not => !not?.checked).length
  
 
  const displayNotifications = showAll ? validNotifications : validNotifications.slice(0, 5)
  const hasMore = validNotifications.length > 5

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recently'
    
    const now = new Date()
    const notTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getNotificationIcon = (notification) => {
    // You can customize this based on notification type
    if (notification?.type === 'poll_ended') {
      return <Check className="w-4 h-4 text-green-500" />
    }
    if (notification?.type === 'poll_created') {
      return <Clock className="w-4 h-4 text-blue-500" />
    }
    return <Bell className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="dropdown dropdown-end mr-4" onClick={(e) => handleClick(e)}>
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost btn-circle relative"
        
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
      
      <div className="dropdown-content bg-base-100 rounded-lg shadow-xl border border-gray-200 z-50 w-80">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-sm text-blue-600 font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {validNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
              <p className="text-gray-400 text-xs mt-1">We'll notify you when something happens</p>
            </div>
          ) : (
            <>
              {displayNotifications.map((notification,index) => (
                <div  key={`${notification?.id || index}`}>
                <div 
                  className={`px-4 py-2 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group ${
                    !notification?.checked ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${
                        !notification?.checked ? 'text-gray-900 font-medium' : 'text-gray-700'
                      }`}>
                        {notification?.content || "No content available"}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-gray-500">
                          {formatTime(notification?.createdAt)}
                        </p>
                        
                        {!notification?.checked && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                    </div>
                  </div>
                  
                </div>
                <hr className='text-gray-300 w-11/12 mx-auto' />
                </div>
              ))}
              
              {/* Show More/Less Button */}
              {hasMore && (
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowAll(!showAll)
                    }}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-3 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    {showAll 
                      ? `Show Less` 
                      : `Show ${validNotifications.length - 5} More Notifications`
                    }
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {/* {validNotifications.length > 0 && (
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <button 
              className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                // Add mark all as read functionality here
                handleClick(e);
                console.log('Mark all as read')
              }}
            >
              Mark All as Read
            </button>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default NotificationDropDown