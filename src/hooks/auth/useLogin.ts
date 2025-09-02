import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  sendPasswordResetCode,
  resetPasswordWithCode,
  sendConfirmationCode,
  confirmEmailWithCode,
  // login,
} from "@/lib/auth/api";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import { cookieNameAccessToken, cookieNameUserId } from "@/utils/constant";
import { getCookie, setCookie } from "@/utils/cookies";
import { login } from "@/lib/auth/apis";
import { ApiError } from "@/types/api";

export const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { zsSetEmployeeId } = useZuStandEmployeeStore();

  return useMutation({
    mutationFn: login,
    onSuccess: async (result) => {
      if (result.isOk()) {
        const { access_token, user_id } = result.value;

        let token = await getCookie(cookieNameAccessToken);

        if (!token) {
          // when no access token is founed

          // set cookie manually. bc cookie might have failed to set, if not available
          await setCookie(cookieNameAccessToken, access_token);
          await setCookie(cookieNameUserId, user_id);

          token = await getCookie(cookieNameAccessToken);

          if (!token) {
            throw new Error("Invalid session information, please try again");
          }
        }

        zsSetEmployeeId(user_id);

        // Invalidate the session query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["session"] });
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to login, Please try again");
        // toast.error(result.error.detail);
      }
    },
    onError: (error: Error) => {
      const errorDetails = JSON.parse(error.message) as ApiError;
      toast.error(errorDetails.detail || "Login failed");
    },
  });
};

export const useSendPasswordResetCodeMutation = () => {
  return useMutation({
    mutationFn: sendPasswordResetCode,
    onSuccess: (result) => {
      if (result.isOk()) {
        toast.success("Password reset code sent! Please check your email.");
        // In development, show the code for testing
        if (result.value.code) {
          console.log("Development reset code:", result.value.code);
        }
      } else {
        toast.error(result.error.detail);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset code");
    },
  });
};

export const useResetPasswordMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPasswordWithCode,
    onSuccess: (result) => {
      if (result.isOk()) {
        toast.success(
          "Password reset successfully! Please log in with your new password.",
        );
        router.push("/login");
      } else {
        toast.error(result.error.detail);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
};

export const useSendConfirmationCodeMutation = () => {
  return useMutation({
    mutationFn: sendConfirmationCode,
    onSuccess: (result) => {
      if (result.isOk()) {
        toast.success("Confirmation code sent! Please check your email.");
        // In development, show the code for testing
        if (result.value.code) {
          console.log("Development confirmation code:", result.value.code);
        }
      } else {
        toast.error(result.error.detail);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send confirmation code");
    },
  });
};

export const useConfirmEmailMutation = () => {
  return useMutation({
    mutationFn: confirmEmailWithCode,
    onSuccess: (result) => {
      if (result.isOk()) {
        toast.success("Email confirmed successfully!");
      } else {
        toast.error(result.error.detail);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to confirm email");
    },
  });
};
