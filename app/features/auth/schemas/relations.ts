import { member } from "@/features/run/schemas/tables";
import { relations } from "drizzle-orm";
import { user } from "./tables";

export const userRelations = relations(user, ({many}) => ({
  member: many(member)
}))
