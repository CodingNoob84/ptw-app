import { TypedSupabaseClient } from "@/supabase/types";

export const getUsers = async (supabase: TypedSupabaseClient) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .neq("role", "admin");

  if (error) {
    console.error("Error fetching projects:", error.message);
    throw new Error("Failed to fetch projects");
  }

  return data;
};

export const getAllProjects = async (supabase: TypedSupabaseClient) => {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Error fetching projects:", error.message);
    throw new Error("Failed to fetch projects");
  }

  return data;
};

export type ProjectDetails = {
  project: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
  towers: Array<{
    id: string;
    project_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  }>;
  categories: Array<{
    category: {
      id: string;
      project_id: string;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    };
    subcategories: Array<{
      id: string;
      category_id: string;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    }>;
  }>;
  floors: Array<{
    floor: {
      id: string;
      tower_id: string;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    };
    units: Array<{
      id: string;
      floor_id: string;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    }>;
  }>;
};

export const getProjectbyId = async (
  projectId: string,
  supabase: TypedSupabaseClient
): Promise<ProjectDetails | null> => {
  try {
    const { data, error } = await supabase.rpc("get_project_details", {
      p_project_id: projectId,
    });

    if (error) {
      console.error("Error fetching project details:", error);
      return null;
    }

    return data as ProjectDetails;
  } catch (error) {
    console.error("Error in getProjectbyId:", error);
    return null;
  }
};

export type PermitSubmissionData = {
  projectId: string;
  towerId: string;
  floorId: string;
  unitId: string;
  categoryId: string;
  subcategoryId: string;
  comments: string;
  createdBy: string;
  assignedTo: string;
  sa_id: string;
  manager_id: string;
  images?: { file: File; preview: string }[];
};

export type RequestStatus = {
  id: string;
  permit_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  comments: string | null;
  created_at: string;
  updated_at: string;
};

export const submitPermitData = async (
  data: PermitSubmissionData,
  supabase: TypedSupabaseClient
) => {
  try {
    // 1. Create the permit
    const { data: permit, error: permitError } = await supabase
      .from("permits")
      .insert({
        project_id: data.projectId,
        tower_id: data.towerId,
        floor_id: data.floorId,
        unit_id: data.unitId,
        category_id: data.categoryId,
        subcategory_id: data.subcategoryId,
        status: "sa_pending",
        status_msg: "Safety Accessor Review Required",
        comments: data.comments,
        assigned_to: data.assignedTo,
        created_by: data.createdBy,
        sa_id: data.sa_id,
        manager_id: data.manager_id,
      })
      .select()
      .single();

    if (permitError) {
      throw permitError;
    }

    // 2. Create initial request status for the assigned person
    const { error: statusError } = await supabase
      .from("request_status")
      .insert([
        {
          permit_id: permit.id,
          user_id: data.createdBy,
          status: "requested",
          comments: "Permit Request Submitted",
          status_msg: "applicant_requested",
          stage: 1,
        },
        {
          permit_id: permit.id,
          user_id: data.assignedTo,
          status: "pending",
          comments: "Safety Accessor Review Required",
          status_msg: "sa_pending",
          stage: 2,
        },
      ]);

    if (statusError) {
      throw statusError;
    }

    return {
      success: true,
      data: permit,
    };
  } catch (error) {
    console.error("Error submitting permit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Function to get request status history for a permit

// Base type for a single permit
export type PermitType = {
  permit_id: string;
  project_id: string;
  project_name: string;
  tower_id: string;
  tower_name: string;
  floor_id: string;
  floor_number: number;
  unit_id: string;
  unit_number: string;
  category_id: string;
  category_name: string;
  subcategory_id: string;
  subcategory_name: string;
  assigned_to: string;
  permit_comments: string | null;
  created_by: string;
  created_by_name: string;
  created_by_email: string;
  created_at: string;
  updated_at: string;

  sa_id: string;
  sa_name: string;
  sa_email: string;

  manager_id: string;
  manager_name: string;
  manager_email: string;

  // Current status info
  current_status_id: string;
  current_status:
    | "requested"
    | "pending"
    | "approved"
    | "rejected"
    | "resubmit"; // assuming enum
  status_comments: string | null;
  status_updated_at: string;
  current_sender_id: string;
  current_receiver_id: string;
  action_required: boolean;
  action_due_date: string | null;
};

// Type for workflow history entries
export type StatusHistoryType = {
  from_status: "pending" | "approved" | "rejected";
  to_status: "pending" | "approved" | "rejected";
  comments: string | null;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    email: string;
    role: string;
  };
  receiver: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    email: string;
    role: string;
  };
};

// Permit + History combined type
export type PermitWithHistory = PermitType & {
  status_history: StatusHistoryType[];
};

// List of permits with history
export type ListOfPermits = PermitWithHistory[];

// types.ts
export interface UserPermit {
  permit_id: string; // UUID as string
  unit_name: string;
  user_role:
    | "applicant"
    | "safety_accessor"
    | "manager"
    | "assigned"
    | "unknown";
  floor_name: number; // Assuming floor_name is a number
  tower_name: string;
  last_updated: string; // ISO date string
  project_name: string;
  category_name: string;
  status: string;
  status_msg: string;
  subcategory_name: string;
  created_by_fullname: string;
}

export interface StatusHistory {
  stage: number;
  status: string;
  comments: string;
  status_msg: string;
  updated_at: string;
  updated_by: string;
  updated_by_role: string;
}

export interface Permit {
  permit_id: string;
  unit_name: string;
  user_role: string;
  created_at: string;
  floor_name: number;
  tower_name: string;
  project_name: string;
  category_name: string;
  current_status: string;
  status_history: StatusHistory[];
  subcategory_name: string;
  created_by_fullname: string;
}

export const getUserPermits = async (
  userId: string,
  supabase: TypedSupabaseClient
): Promise<Permit[]> => {
  try {
    const { data, error } = await supabase.rpc(
      "get_user_permits_with_status_history",
      {
        p_userid: userId,
      }
    );

    if (error) {
      throw error;
    }

    return data as unknown as Permit[];
  } catch (error) {
    console.error("Error fetching user permits:", error);
    return [];
  }
};

export const getPermitById = async (
  permitId: string,
  userId: string,
  supabase: TypedSupabaseClient
): Promise<PermitWithHistory | null> => {
  try {
    const { data, error } = await supabase.rpc("get_permit_by_id", {
      p_permit_id: permitId,
      p_user_id: userId,
    });

    if (error) {
      throw error;
    }

    return data[0] as PermitWithHistory;
  } catch (error) {
    console.error("Error fetching user permits:", error);
    return null;
  }
};

///---------------------->

// types.ts
export interface PermitDetails {
  id: string;
  project_id: string | null;
  project_name: string | null;
  tower_id: string | null;
  tower_name: string | null;
  floor_id: string | null;
  floor_name: string | null;
  unit_id: string | null;
  unit_name: string | null;
  category_id: string | null;
  category_name: string | null;
  subcategory_id: string | null;
  subcategory_name: string | null;
  assigned_to: string | null;
  comments: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  sa_id: string | null;
  manager_id: string | null;
  status_msg: string | null;
  issa_completed: boolean | null;
  ismanager_completed: boolean | null;
}

export interface StatusHistoryItem {
  id: string;
  status: string;
  status_msg: string;
  stage: number;
  user_id: string;
  user_name: string;
  comments: string | null;
  updated_at: string;
}

export interface InvolvedUser {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  role: string | null;
  fullname: string;
}

export interface PermitDetailsResponse {
  permit: PermitDetails;
  statushistory: StatusHistoryItem[];
  users: InvolvedUser[];
}

export const getPermitDetails = async (
  permitId: string,
  supabase: TypedSupabaseClient
): Promise<PermitDetailsResponse | null> => {
  try {
    const { data, error } = await supabase
      .rpc("get_permit_details", {
        p_permitid: permitId,
      })
      .single();

    if (error) {
      console.error("Error fetching permit details:", error);
      return null;
    }

    return data as unknown as PermitDetailsResponse;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const updateRequestStatus = async (
  permitId: string,
  myUserId: string,
  assignedTo: string,
  status: string,
  status_msg: string,
  stage: number,
  comments: string,
  supabase: TypedSupabaseClient
) => {
  try {
    // 1. Update the current status record
    const { error: updateError } = await supabase
      .from("request_status")
      .update({
        status,
        status_msg,
        comments,
        updated_at: new Date().toISOString(),
      })
      .eq("permit_id", permitId)
      .eq("stage", stage);

    if (updateError) {
      throw updateError;
    }

    if (status_msg != "manager_approved") {
      let next_status_msg = "",
        next_comments = "";
      if (status_msg === "sa_approved") {
        next_status_msg = "manager_pending";
        next_comments = "Manager Review Required";
      } else if (status_msg === "sa_rejected") {
        next_status_msg = "applicant_pending";
        next_comments = "Applicant Resubmit Required";
      } else if (status_msg === "manager_rejected") {
        next_status_msg = "applicant_pending";
        next_comments = "Applicant Resubmit Required";
      }
      // 2. Create new status record for the next stage
      const { error: insertError } = await supabase
        .from("request_status")
        .insert({
          permit_id: permitId,
          user_id: assignedTo,
          status: "pending",
          status_msg: next_status_msg,
          comments: next_comments,
          stage: stage + 1,
        });

      if (insertError) {
        throw insertError;
      }
    }

    // 3. Update permit status
    const { error: permitError } = await supabase
      .from("permits")
      .update({
        status: status_msg,
        status_msg: comments,
        issa_completed: status === "approved",
        ismanager_completed:
          status === "approved" && status_msg === "manager_approved",
      })
      .eq("id", permitId);

    if (permitError) {
      throw permitError;
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating request status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
