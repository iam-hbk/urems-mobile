import { schemaChangePasswordForm, schemaLoginForm } from "@/schema/auth";
import * as z from "zod";

export type TypeLoginForm = z.infer<typeof schemaLoginForm>;
export type TypeChangePasswordForm = z.infer<typeof schemaChangePasswordForm>;
