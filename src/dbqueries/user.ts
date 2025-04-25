import { TypedSupabaseClient } from "@/supabase/types";

export type UserType = {
  authid: string | null;
  created_at: string;
  email: string;
  firstname: string | null;
  id: string;
  lastname: string | null;
  password: string | null;
  role: string | null;
};

export type UserWithReporting = {
  user: UserType;
  reporting_to: UserType[];
};

export const getUserWithReporting = async (supabase: TypedSupabaseClient) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      return null;
    }

    const { data, error } = await supabase.rpc("get_user_with_reporting", {
      auth_id: authData.user.id,
    });

    if (error) {
      return null;
    }

    return data as UserWithReporting;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const getAllUsers = async (supabase: TypedSupabaseClient) => {
  try {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*");

    const { data: reports, error: reportsError } = await supabase
      .from("reporting")
      .select("*");

    if (usersError || reportsError || !users) {
      return [];
    }

    // Create quick lookup maps
    const userMap = new Map(users.map((user) => [user.id, user]));
    const reportingMap = new Map<string, string>();

    if (reports) {
      reports.forEach((report) => {
        if (report.userid && report.reportingid) {
          reportingMap.set(report.userid, report.reportingid);
        }
      });
    }

    // Build final result
    const result = users.map((user) => {
      const reportingToId = reportingMap.get(user.id);
      const reportingTo = reportingToId ? userMap.get(reportingToId) : null;

      return {
        ...user,
        reporting_to: reportingTo ? reportingTo : null,
      };
    });

    return result as UserType[];
  } catch (error) {
    console.log("error",error)
    return [];
  }
};

export type ReportingType = {
  userId: string;
  role: string | null;
  reportingTo: string | undefined; // If multiple, this can be string[] instead
};

