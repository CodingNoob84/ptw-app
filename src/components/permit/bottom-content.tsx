"use client";
import {
    InvolvedUser,
    StatusHistoryItem,
    updateRequestStatus,
} from "@/dbqueries/project";
import { createClient } from "@/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    CheckCircle,
    ClipboardList,
    Clock,
    Edit,
    MessageSquare,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export const BottomContent = ({
  permitId,
  userId,
  statusHistory,
  allusers,
}: {
  permitId: string | undefined;
  userId: string;
  statusHistory: StatusHistoryItem[] | undefined;
  allusers: InvolvedUser[] | undefined;
}) => {
  const queryClient = useQueryClient();
  const [reviewComments, setReviewComments] = useState("");
  const supabase = createClient();

  const userStatusData =
    statusHistory &&
    statusHistory
      .filter((item) => item.user_id === userId)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];
  console.log("userstatus", statusHistory);
  const getUserByRole = (role: "applicant" | "safetyaccessor" | "manager") => {
    return allusers && allusers.find((u) => u.role == role);
  };

  const getLastStageStatus =
    statusHistory &&
    statusHistory.reduce((latest, item) =>
      item.stage > latest.stage ? item : latest
    ).status_msg;

  const myRole = allusers?.find((u) => u.id == userId)?.role;
  console.log("myRole", myRole);

  const handleSubmit = async (
    status: "reject" | "approve",
    role: "sa" | "manager" | "",
    stage: number
  ) => {
    try {
      if (!permitId) {
        toast.error("Permit ID is missing");
        return;
      }

      if (status === "approve") {
        if (role === "sa") {
          const getManager = getUserByRole("manager");
          if (!getManager?.id) {
            toast.error("Manager not found");
            return;
          }

          const result = await updateRequestStatus(
            permitId,
            userId,
            getManager.id,
            "approved",
            "sa_approved",
            stage,
            reviewComments || "SA Approved",
            supabase
          );

          if (result.success) {
            queryClient.invalidateQueries({ queryKey: ["permit", permitId] });
            queryClient.invalidateQueries({ queryKey: ["allpermits", userId] });
            toast.success("Permit approved and forwarded to manager");
          } else {
            toast.error(result.error || "Failed to update status");
          }
        } else if (role === "manager") {
          const result = await updateRequestStatus(
            permitId,
            userId,
            userId, // No next stage after manager approval
            "approved",
            "manager_approved",
            stage,
            reviewComments || "Manager Approved",
            supabase
          );

          if (result.success) {
            queryClient.invalidateQueries({ queryKey: ["permit", permitId] });
            toast.success("Permit approved by manager");
          } else {
            toast.error(result.error || "Failed to update status");
          }
        }
      } else {
        if (role === "sa") {
          const getApplicant = getUserByRole("applicant");
          if (!getApplicant?.id) {
            toast.error("Applicant not found");
            return;
          }

          const result = await updateRequestStatus(
            permitId,
            userId,
            getApplicant.id,
            "rejected",
            "sa_rejected",
            stage,
            reviewComments || "SA Rejected",
            supabase
          );

          if (result.success) {
            queryClient.invalidateQueries({ queryKey: ["permit", permitId] });
            toast.success("Permit rejected and returned to applicant");
          } else {
            toast.error(result.error || "Failed to update status");
          }
        } else if (role === "manager") {
          const getApplicant = getUserByRole("applicant");
          if (!getApplicant?.id) {
            toast.error("Applicant not found");
            return;
          }

          const result = await updateRequestStatus(
            permitId,
            userId,
            getApplicant.id,
            "rejected",
            "manager_rejected",
            stage,
            reviewComments || "Manager Rejected",
            supabase
          );

          if (result.success) {
            queryClient.invalidateQueries({ queryKey: ["permit", permitId] });
            toast.success("Permit rejected and returned to applicant");
          } else {
            toast.error(result.error || "Failed to update status");
          }
        }
      }
    } catch (error) {
      console.error("Error updating permit status:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* sa_pending */}
      {getLastStageStatus === "sa_pending" && myRole === "applicant" && (
        <StatusBanner
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          title="Waiting for Engineer Approval"
          description="Your permit is currently being reviewed by the site engineer."
          color="amber"
        />
      )}

      {getLastStageStatus === "sa_pending" && myRole === "safetyaccessor" && (
        <ReviewSection
          onApprove={() =>
            handleSubmit("approve", "sa", userStatusData?.stage || 0)
          }
          onReject={() =>
            handleSubmit("reject", "sa", userStatusData?.stage || 0)
          }
          comments={reviewComments}
          setComments={setReviewComments}
        />
      )}

      {getLastStageStatus === "sa_pending" && myRole === "manager" && (
        <StatusBanner
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          title="Waiting for Engineer Approval"
          description="The permit is currently being reviewed by the site engineer."
          color="amber"
        />
      )}

      {/* manager_pending */}
      {getLastStageStatus === "manager_pending" && myRole === "applicant" && (
        <StatusBanner
          icon={<Clock className="h-6 w-6 text-blue-500" />}
          title="Waiting for Manager Approval"
          description="The engineer has approved and your permit is now with the manager for final review."
          color="blue"
        />
      )}

      {getLastStageStatus === "manager_pending" &&
        myRole === "safetyaccessor" && (
          <StatusBanner
            icon={<CheckCircle className="h-6 w-6 text-emerald-500" />}
            title="Engineer Approved - Waiting for Manager Approval"
            description="You have approved this permit and it's now with the manager for final review."
            color="emerald"
          />
        )}

      {getLastStageStatus === "manager_pending" && myRole === "manager" && (
        <ReviewSection
          onApprove={() =>
            handleSubmit("approve", "manager", userStatusData?.stage || 0)
          }
          onReject={() =>
            handleSubmit("reject", "manager", userStatusData?.stage || 0)
          }
          comments={reviewComments}
          setComments={setReviewComments}
        />
      )}

      {/* manager_approved */}
      {getLastStageStatus === "manager_approved" && (
        <StatusBanner
          icon={<CheckCircle className="h-6 w-6 text-emerald-500" />}
          title="Permit Approved"
          description={
            myRole === "manager"
              ? "You have approved this permit."
              : "The manager has approved this permit."
          }
          color="emerald"
        />
      )}

      {/* manager_rejected */}
      {getLastStageStatus === "manager_rejected" && (
        <StatusBanner
          icon={<XCircle className="h-6 w-6 text-red-500" />}
          title="Permit Rejected by Manager"
          description={
            myRole === "manager"
              ? "You have rejected this permit."
              : "The manager has rejected this permit."
          }
          color="red"
        />
      )}

      {/* sa_rejected */}
      {getLastStageStatus === "applicant_pending" && myRole != "applicant" && (
        <StatusBanner
          icon={<XCircle className="h-6 w-6 text-red-500" />}
          title="Permit Rejected by Safety Accessor"
          description={
            myRole === "safetyaccessor"
              ? "You have rejected this permit."
              : "The Safety Accessor has rejected this permit."
          }
          color="red"
        />
      )}

      {getLastStageStatus === "applicant_pending" && myRole === "applicant" && (
        <div className="space-y-4">
          <StatusBanner
            icon={<AlertCircle className="h-6 w-6 text-amber-500" />}
            title="Corrections Required"
            description="Your permit application requires modifications before it can be processed further."
            color="amber"
          />

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex flex-col gap-2 items-start">
              <div className="flex flex-row gap-2 ">
                <ClipboardList className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-medium text-amber-800">
                  Review Feedback
                </h3>
              </div>
              <div className="ml-3">
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    {userStatusData?.comments ||
                      "No specific feedback provided."}
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                //onClick={() => router.push(`/permits/edit/${permitId}`)}
                className="w-full bg-amber-600 hover:bg-amber-700"
                asChild
              >
                <Link href={`/dashboard/edit/${permitId}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Permit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatusBannerProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "amber" | "emerald" | "blue" | "red";
}

const StatusBanner: React.FC<StatusBannerProps> = ({
  icon,
  title,
  description,
  color,
}) => {
  const colorClasses = {
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div
      className={`flex items-start p-4 rounded-md border mb-4 ${colorClasses[color]}`}
    >
      <div className="mr-4 mt-0.5">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

interface ReviewSectionProps {
  onApprove: () => void;
  onReject: () => void;
  comments: string;
  setComments: (value: string) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  onApprove,
  onReject,
  comments,
  setComments,
}) => (
  <>
    <div className="mt-8 space-y-4">
      <h3 className="flex items-center text-lg font-medium">
        <MessageSquare className="mr-2 h-5 w-5" /> Your Review
      </h3>
      <Textarea
        placeholder="Add your comments, observations, or requirements..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        rows={4}
      />
    </div>
    <div className="flex justify-center sm:justify-end gap-4 mt-4">
      <Button
        variant="outline"
        className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
        onClick={onReject}
      >
        <XCircle className="mr-2 h-4 w-4" /> Decline
      </Button>
      <Button
        className="bg-emerald-600 hover:bg-emerald-700"
        onClick={onApprove}
      >
        <CheckCircle className="mr-2 h-4 w-4" /> Approve
      </Button>
    </div>
  </>
);
