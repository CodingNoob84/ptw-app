"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Permit Approved",
    description: "Your permit PTW-2023-002 has been approved by the engineer.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Permit Requires Changes",
    description: "Your permit PTW-2023-003 needs additional documentation.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "New Permit Assigned",
    description: "You have been assigned a new permit to review: PTW-2023-005.",
    time: "1 day ago",
    read: true,
  },
];

export const Notifications = () => {
  const [notificationCount, setNotificationCount] = useState(3);

  // Mock notifications data

  const markAsRead = (id: number) => {
    // In a real app, you would update the notification status in your backend
    console.log(`Marking notification ${id} as read`);
    setNotificationCount(Math.max(0, notificationCount - 1));
  };

  const markAllAsRead = () => {
    // In a real app, you would update all notifications as read in your backend
    console.log("Marking all notifications as read");
    setNotificationCount(0);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {notificationCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-80 p-0"
        align="end"
        side="bottom"
        sideOffset={5}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {notificationCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-0 ${
                  notification.read ? "" : "bg-muted/50"
                }`}
                onClick={() =>
                  !notification.read && markAsRead(notification.id)
                }
              >
                <div className="flex justify-between items-start gap-2">
                  <h5 className="font-medium text-sm">{notification.title}</h5>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.description}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
