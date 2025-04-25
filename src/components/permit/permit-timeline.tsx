import {
  StatusHistoryItem
} from "@/dbqueries/project";
import { format } from "date-fns";
import { Calendar, CheckCircle, Clock, RotateCcw, XCircle } from "lucide-react";

export function PermitTimeline({
  statushistory,
}: {
  statushistory: StatusHistoryItem[];
}) {
  const getStatusIcon = (status: string) => {
    if (status === "requested")
      return <RotateCcw className="h-5 w-5 text-blue-500" />;
    if (status === "rejected")
      return <XCircle className="h-5 w-5 text-red-500" />;
    if (status.includes("approved"))
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status.includes("pending"))
      return <Clock className="h-5 w-5 text-amber-500" />;
    return <Calendar className="h-5 w-5 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "requested")
      return "border-blue-500 bg-blue-50 text-blue-700";
    if (status === "rejected") return "border-red-500 bg-red-50 text-red-700";
    if (status.includes("approved"))
      return "border-green-500 bg-green-50 text-green-700";
    if (status.includes("pending"))
      return "border-amber-500 bg-amber-50 text-amber-700";
    return "border-gray-300 bg-gray-50 text-gray-700";
  };

  const getStatusText = (status: string) => {
    if (status === "requested") return "Applicant Requested";
    if (status === "sa_rejected") return "Safety Accessor Rejected";
    if (status === "manager_rejected") return "Manager Rejected";
    if (status === "sa_approved") return "Safety Accessor Approved";
    if (status === "manager_approved") return "Manager Approved";
    if (status === "sa_pending") return "Safety Accessor Review Pending";
    if (status === "manager_pending") return "Manager Review Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  };

  return (
    <div className="relative space-y-0">
      {statushistory.map((item, index) => (
        <div key={index} className="flex gap-4 pb-8 last:pb-0 relative">
          {/* Vertical line */}
          {index < statushistory.length - 1 && (
            <div className="absolute left-[18px] top-[28px] bottom-0 w-0.5 bg-gray-300"></div>
          )}

          {/* Status icon */}
          <div
            className={`flex-none mt-0.5 h-9 w-9 rounded-full border-2 flex items-center justify-center ${getStatusColor(
              item.status ?? ""
            )}`}
          >
            {getStatusIcon(item.status ?? "")}
          </div>

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="font-medium">
                {getStatusText(item.status ?? "")}
              </h4>
              <span className="text-sm text-muted-foreground">
                by {item.user_name}
              </span>
            </div>
            <time className="block text-sm text-muted-foreground mb-2">
              {format(item.updated_at, "PPpp")}
            </time>
            {item.comments && <p className="text-sm">{item.comments}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
