import { SchemaLoginForm } from "@/schema/auth";
import * as z from "zod";

export type TypeLoginForm = z.infer<typeof SchemaLoginForm>;
