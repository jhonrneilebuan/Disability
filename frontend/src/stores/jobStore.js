import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API_URL = import.meta.env.NODE_ENV === "development" ? "https://disability-careers.onrender.com/api" : "http://localhost:5000/api"; 


axios.defaults.withCredentials = true;

export const jobStore = create((set, get) => ({
  jobDetails: null,
  jobPreferences: null,
  isjobPreferencesLoading: false,
  jobPosts: [],
  jobposted: [],
  applications: [],
  employerApplicants: [],
  totalApplicantCount: [],
  savedJobs: [],
  shortlistedApplicants: [],
  completeInteview: [],
  interviewScheduledApplicants: [],
  CompleteInterviewApplicants: [],
  totalPending: 0,
  totalDataOfApplicants: null,
  totalShortlist: 0,
  totalInterview: 0,
  totalHired: 0,
  totalApplicants: 0,
  totalJobs: 0,
  isLoading: false,
  isTotalLoading: false,
  isChartLoading: false,
  interviewLoading: false,
  isApplicationLoading: false,
  error: null,
  message: null,
  isError: null,
  jobpostError: null,
  isjobLoading: null,

  getJobPreferences: async () => {
    set({ isjobPreferencesLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/applications/`);
      set({ jobPreferences: response.data, isjobPreferencesLoading: false });
    } catch (error) {
      console.error("Error fetching job preferences:", error);
      set({
        error:
          error.response?.data?.message || "Error fetching job preferences",
        isjobPreferencesLoading: false,
      });
    }
  },

  updateJobPreferences: async (preferences) => {
    set({ isLoading: true, error: null });

    try {
      preferences.expectedSalary = {
        minSalary: Number(preferences.expectedSalary.minSalary),
        maxSalary: Number(preferences.expectedSalary.maxSalary),
      };

      if (
        !Array.isArray(preferences.jobCategories) ||
        preferences.jobCategories.length > 3
      ) {
        throw new Error("You must select up to 3 job categories.");
      }

      if (
        !Array.isArray(preferences.jobTypes) ||
        preferences.jobTypes.length > 3
      ) {
        throw new Error("You must select up to 3 job types.");
      }

      if (!preferences.jobQualifications) {
        throw new Error("Job qualifications are required.");
      }

      const response = await axios.put(`${API_URL}/applications/`, preferences);

      set({ jobPreferences: response.data, isLoading: false });
      toast.success("Job preferences updated successfully");
    } catch (error) {
      console.error("Error updating job preferences:", error);
      set({
        error:
          error.response?.data?.message || "Error updating job preferences",
        isLoading: false,
      });
    }
  },

  getTotalApplicant: async () => {
    set({ isTotalLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/applications/total-applicant`
      );
      set({
        totalDataOfApplicants: response.data,
        isTotalLoading: false,
      });
    } catch (error) {
      console.error("Error fetching total applicants:", error);
      set({
        error:
          error.response?.data?.message || "Error fetching total applicants",
        isTotalLoading: false,
      });
    }
  },

  getJobApplicantsCount: async () => {
    set({ isChartLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/applications/applicant-count`
      );
      set({
        totalApplicantCount: response.data,
        isChartLoading: false,
      });
    } catch (error) {
      console.error("Error fetching job applicants count:", error);
      set({
        error:
          error.response?.data?.message ||
          "Error fetching job applicants count",
        isChartLoading: false,
      });
    }
  },

  getJobPosts: async () => {
    set({ isjobLoading: true, isError: null });
    try {
      const response = await axios.get(`${API_URL}/jobs/`);
      set({
        jobPosts: response.data,
        isjobLoading: false,
      });
    } catch (error) {
      console.error("Error fetching job posts:", error);
      set({
        isError: error.response?.data?.message || "Error fetching job posts",
        isjobLoading: false,
      });
      throw error;
    }
  },

  getAllJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs/all`);
      set({
        jobPosts: response.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching job posts:", error);
      set({
        error: error.response?.data?.message || "Error fetching job posts",
        isLoading: false,
      });
      throw error;
    }
  },

  getJobById: async (jobId) => {
    set({ isLoading: true, jobpostError: null });
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`);
      set({
        jobDetails: response.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching job posts:", error);
      set({
        jobpostError:
          error.response?.data?.message || "Error fetching job posts",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteJobPost: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/jobs/${jobId}`);
      set({
        jobPosts: get().jobPosts.filter((job) => job._id !== jobId),
        isLoading: false,
      });
      toast.success(
        response.data.message || "Job has been deleted successfully"
      );
    } catch (error) {
      console.error("Error deleting job post:", error);
      set({
        error: error.response?.data?.message || "Error deleting job post",
        isLoading: false,
      });
      throw error;
    }
  },

  getApplicationsByApplicant: async () => {
    set({ isApplicationLoading: true, isError: null });
    try {
      const response = await axios.get(
        `${API_URL}/applications/my-applications`
      );
      set({
        applications: response.data,
        isApplicationLoading: false,
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      set({
        isError: error.response?.data?.message || "Error fetching applications",
        isApplicationLoading: false,
      });
      throw error;
    }
  },

  getEmployerJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs/post-job`);
      set({ jobposted: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching job posts for employer:", error);
      set({
        error: error.response?.data?.message || "Error fetching job posts",
        isLoading: false,
      });
      throw error;
    }
  },

  getTotalApplications: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/applications/total-applications`
      );
      const totalApplicants = response.data.totalApplicants || 0;
      set({
        totalApplicants: totalApplicants,
        applications: response.data.applications,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching total applications:", error);
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  getTotalJobs: async () => {
    set({ isTotalLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/jobs/total-job`);
      const totalJobs = response.data.totalJobs || 0;
      set({
        totalJobs,
        isTotalLoading: false,
      });
    } catch (error) {
      console.error("Error fetching total jobs:", error);
      set({ error: error.response?.data?.message, isTotalLoading: false });
    }
  },

  getTotalPending: async () => {
    set({ isTotalLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/applications/total-pending`);
      const totalPending = response.data.totalPending || 0;
      set({
        totalPending,
        isTotalLoading: false,
      });
    } catch (error) {
      console.error("Error fetching total pending:", error);
      set({ error: error.response?.data?.message, isTotalLoading: false });
    }
  },

  getTotalShortlist: async () => {
    set({ isTotalLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/applications/total-shortlist`
      );
      const totalShortlist = response.data.totalShortlist || 0;
      set({
        totalShortlist,
        isTotalLoading: false,
      });
    } catch (error) {
      console.error("Error fetching total shortlist:", error);
      set({ error: error.response?.data?.message, isTotalLoading: false });
    }
  },

  getTotalInterview: async () => {
    set({ isTotalLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/applications/total-interview`
      );
      const totalInterview = response.data.TotalInterview || 0;
      set({
        totalInterview,
        isTotalLoading: false,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching total interview:", error);
      set({ error: error.response?.data?.message, isTotalLoading: false });
    }
  },

  getTotalHired: async () => {
    set({ isTotalLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/applications/total-hired`);
      const totalHired = response.data.totalHired || 0;
      set({ totalHired, isTotalLoading: false });
    } catch (error) {
      console.error("Error in fetching total hired", error);
      set({ error: error.response?.data?.message, isTotalLoading: false });
    }
  },

  getEmployerApplicants: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/applications/applicants`);
      console.log("Applicants fetched:", response.data);
      set({
        employerApplicants: response.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
      set({
        error: error.response?.data?.message || "Error fetching applicants",
        isLoading: false,
      });
    }
  },

  withdrawApplication: async (applicationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${API_URL}/applications/withdraw-application/${applicationId}`
      );
      set({
        applications: get().applications.filter(
          (app) => app._id !== applicationId
        ),
        isLoading: false,
      });
      toast.success(
        response.data.message || "Application withdrawn successfully."
      );
    } catch (error) {
      console.error("Error withdrawing application:", error);

      set({
        error:
          error.response?.data?.message || "Error withdrawing application.",
        isLoading: false,
      });
      throw error;
    }
  },

  getSavedJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/savedJobs/saved`);
      console.log(response.data);
      set({ savedJobs: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  saveJob: async (jobId) => {
    try {
      const response = await axios.post(
        `${API_URL}/savedJobs/save`,
        { jobId },
        { withCredentials: true }
      );

      toast.success(response.data.message);

      get().getSavedJobs();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  },

  unsaveJob: async (savedJobId) => {
    try {
      const savedJobs = get().savedJobs;

      console.log("Saved Jobs:", savedJobs);
      console.log("Looking for Job ID:", savedJobId);

      const job = savedJobs.find((job) => job._id === savedJobId);

      if (!job) {
        console.error("Job not found in saved jobs.");
        return;
      }

      const jobId = job.jobId?._id || job.jobId;

      console.log("Extracted Job ID:", jobId);

      if (!jobId) {
        console.error("Job ID is missing.");
        return;
      }

      const response = await axios.delete(`${API_URL}/savedJobs/unsave`, {
        data: { jobId },
      });

      console.log(response.data.message);

      set((state) => ({
        savedJobs: state.savedJobs.filter((job) => job._id !== savedJobId),
      }));
    } catch (error) {
      console.error("Error removing saved job:", error.message);
      alert("Failed to remove job from saved list. Please try again.");
    }
  },

  shortlistApplication: async (applicationId) => {
    if (!applicationId) {
      console.error("Application ID is missing");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/applications/${applicationId}/shortlist`
      );

      set((state) => ({
        employerApplicants: state.employerApplicants.map((applicant) =>
          applicant._id === applicationId
            ? { ...applicant, status: "Shortlisted" }
            : applicant
        ),
        isLoading: false,
      }));

      toast.success(
        response.data.message || "Application shortlisted successfully."
      );
    } catch (error) {
      console.error("Error shortlisting application:", error);
      set({
        error:
          error.response?.data?.message || "Error shortlisting application",
        isLoading: false,
      });
      throw error;
    }
  },

  rejectApplication: async (applicationId) => {
    if (!applicationId) {
      console.error("Application ID is missing");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/applications/${applicationId}/reject`
      );

      set((state) => ({
        employerApplicants: state.employerApplicants.map((applicant) =>
          applicant._id === applicationId
            ? { ...applicant, status: "Rejected" }
            : applicant
        ),
        isLoading: false,
      }));

      toast.success(
        response.data.message || "Application rejected successfully."
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
      set({
        error: error.response?.data?.message || "Error rejecting application",
        isLoading: false,
      });
      throw error;
    }
  },

  CompleteInterviewApplication: async (applicationId) => {
    if (!applicationId) {
      console.error("Application ID is missing");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/applications/${applicationId}/complete`
      );

      set((state) => ({
        employerApplicants: state.employerApplicants.map((applicant) =>
          applicant._id === applicationId
            ? { ...applicant, status: "Interview Completed" }
            : applicant
        ),
        isLoading: false,
      }));

      toast.success(
        response.data.message || "Interview completed successfully."
      );
    } catch (error) {
      console.error("Error completing interview:", error);
      set({
        error: error.response?.data?.message || "Error completing interview",
        isLoading: false,
      });
      throw error;
    }
  },

  hiredApplication: async (applicationId) => {
    if (!applicationId) {
      console.error("Application ID is missing");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/applications/${applicationId}/hired`
      );

      set((state) => ({
        employerApplicants: state.employerApplicants.map((applicant) =>
          applicant._id === applicationId
            ? { ...applicant, status: "Hired" }
            : applicant
        ),
        isLoading: false,
      }));

      toast.success(response.data.message || "Application hired successfully.");
    } catch (error) {
      console.error("Error hiring application:", error);
      set({
        error: error.response?.data?.message || "Error hiring application",
        isLoading: false,
      });
      throw error;
    }
  },

  confirmApplication: async (applicationId) => {
    if (!applicationId) {
      console.error("Application ID is missing");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/applications/${applicationId}/confirm-interview`
      );

      set((state) => ({
        employerApplicants: state.employerApplicants.map((applicant) =>
          applicant._id === applicationId
            ? {
                ...applicant,
                interview: { ...applicant.interview, status: "Confirmed" },
              }
            : applicant
        ),
        isLoading: false,
      }));

      toast.success(
        response.data.message || "Interview confirmed successfully."
      );
    } catch (error) {
      console.error(
        "Error confirming application:",
        error.response?.data || error.message
      );

      console.error("Error confirming application:", error);
      set({
        error: error.response?.data?.message || "Error confirming application",
        isLoading: false,
      });
      throw error;
    }
  },

  declineApplication: async (applicationId) => {
    if (!applicationId) {
      console.error("Application ID is missing");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/applications/${applicationId}/decline-interview`
      );

      set((state) => ({
        employerApplicants: state.employerApplicants.map((applicant) =>
          applicant._id === applicationId
            ? {
                ...applicant,
                interview: { ...applicant.interview, status: "Declined" },
              }
            : applicant
        ),
        isLoading: false,
      }));

      toast.success(
        response.data.message || "Interview declined successfully."
      );
    } catch (error) {
      console.error("Error declining application:", error);
      set({
        error: error.response?.data?.message || "Error declining application",
        isLoading: false,
      });
      throw error;
    }
  },

  applyJobs: async ({
    jobId,
    coverLetter,
    accessibilityNeeds,
    resume,
    additionalFiles,
  }) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("coverLetter", coverLetter);
      formData.append("accessibilityNeeds", accessibilityNeeds);

      if (resume) {
        formData.append("resume", resume);
      }

      if (additionalFiles && additionalFiles.length > 0) {
        additionalFiles.forEach((file) => {
          formData.append("additionalFiles", file);
        });
      }

      const response = await axios.post(
        `${API_URL}/applications/apply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        response.data.message || "Application submitted successfully."
      );
      set({
        message: response.data.message || "Application submitted successfully.",
        isLoading: false,
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw new Error("You have already applied for this job.");
      } else {
        console.error("Error applying for job:", error);
        console.error(
          "Error applying for job:",
          JSON.stringify(error, null, 2)
        );
        set({
          error: error.response?.data?.error || "Error applying for job",
          isLoading: false,
        });
        throw error;
      }
    }
  },

  createJob: async ({
    companyName,
    applicationDeadline,
    jobTitle,
    jobDescription,
    jobCategory,
    locations,
    preferredLanguages,
    jobQualifications,
    jobType,
    jobShift,
    jobLevel,
    applyWithLink,
    jobSkills,
    expectedSalary,
    jobAttachment,
    preferredDisabilities,
  }) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();

      formData.append("companyName", companyName);
      formData.append("applicationDeadline", applicationDeadline);
      formData.append("jobTitle", jobTitle);
      formData.append("jobDescription", jobDescription);
      formData.append("jobCategory", jobCategory);

      if (preferredLanguages && preferredLanguages.length > 0) {
        formData.append(
          "preferredLanguages",
          JSON.stringify(preferredLanguages)
        );
      } else {
        formData.append("preferredLanguages", JSON.stringify(["Any"]));
      }

      formData.append("jobQualifications", jobQualifications);
      formData.append("jobType", jobType);
      formData.append("jobShift", jobShift);
      formData.append("jobLevel", jobLevel);
      formData.append("applyWithLink", applyWithLink);

      if (preferredDisabilities && preferredDisabilities.length > 0) {
        formData.append(
          "preferredDisabilities",
          JSON.stringify(preferredDisabilities)
        );
      } else {
        formData.append("preferredDisabilities", JSON.stringify([]));
      }

      if (locations) {
        formData.append("locations", JSON.stringify(locations));
      }
      if (jobSkills) {
        formData.append("jobSkills", JSON.stringify(jobSkills));
      }
      if (expectedSalary) {
        formData.append("expectedSalary", JSON.stringify(expectedSalary));
      }
      if (jobAttachment) {
        formData.append("jobAttachment", jobAttachment);
      }

      const response = await axios.post(`${API_URL}/jobs/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "Job created successfully.");
      set({
        message: response.data.message || "Job created successfully.",
        isLoading: false,
      });
    } catch (error) {
      console.error("Error creating job:", error);
      set({
        error: error.response?.data?.message || "Error creating job",
        isLoading: false,
      });

      throw error;
    }
  },

  getCompleteInterview: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`
        ${API_URL}/applications/applicants/CompleteInterview
      `);
      console.log("Applicants fetched:", response.data);
      set({
        completeInteview: response.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
      set({
        error: error.response?.data?.message || "Error fetching applicants",
        isLoading: false,
      });
    }
  },

  getShortlistedApplicant: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`
        ${API_URL}/applications/shortlist
      `);
      console.log("Applicants fetched:", response.data);
      set({
        shortlistedApplicants: response.data.shortlistedApplicants,
        isLoading: false,
      });
      console.log("State updated with applicants:", response.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      set({
        error: error.response?.data?.message || "Error fetching applicants",
        isLoading: false,
      });
    }
  },

  scheduleInterview: async (applicationId, interviewDetails) => {
    set({ interviewLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/applications/applications/${applicationId}/schedule-interview`,
        interviewDetails
      );

      toast.success("Interview successfully scheduled.");
      set({ message: response.data.message, interviewLoading: false });
    } catch (error) {
      console.error("Error scheduling interview:", error);

      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while scheduling the interview.";
      set({
        error: errorMessage,
        interviewLoading: false,
      });
    }
  },

  getscheduledInterviewStatus: async () => {
    set({ isLoading: true, isError: null });

    try {
      const response = await axios.get(
        `${API_URL}/applications/scheduled-interview`
      );

      set({
        scheduledInterviewApplicants:
          response.data.interviewScheduledApplicants || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
      set({
        isError: error.response?.data?.message || "Error fetching applicants",
        isLoading: false,
      });
    }
  },

  getCompleteInterviewStatus: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/applications/complete-interview`
      );

      set({
        CompleteInterview: response.data.interviewScheduledApplicants || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
      set({
        error: error.response?.data?.message || "Error fetching applicants",
        isLoading: false,
      });
    }
  },

  updateJob: async (jobId, updatedData) => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();

      Object.keys(updatedData).forEach((key) => {
        if (key === "jobAttachment" && updatedData[key]) {
          formData.append("jobAttachment", updatedData[key]);
        } else {
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(
        `${API_URL}/jobs/update/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      set((state) => ({
        jobPosts: state.jobPosts.map((job) =>
          job._id === jobId ? { ...job, ...response.data.job } : job
        ),
        isLoading: false,
      }));

      toast.success(response.data.message || "Job updated successfully.");
      return response.data;
    } catch (error) {
      console.error("Error updating job:", error);
      set({
        error: error.response?.data?.message || "Error updating job",
        isLoading: false,
      });
      throw error;
    }
  },
}));
