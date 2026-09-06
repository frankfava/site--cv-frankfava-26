/**
 * Catalog of every role dossier.
 *
 * Each role module exports both halves of itself - the `entry` that gives it a
 * page and the `definition` that gives it content - so a role is registered by
 * one name here and cannot be half-added.
 */

import type { Role } from "@/lib/roles";
import { assembleRole } from "@/lib/roles";

import * as aiEnablementLead from "@/data/roles/ai-enablement-lead";
import * as engineeringManager from "@/data/roles/engineering-manager";
import * as solutionsArchitect from "@/data/roles/solutions-architect";
import * as forwardDeployedEngineer from "@/data/roles/forward-deployed-engineer";
import * as seniorEngineer from "@/data/roles/senior-engineer";
import * as technicalEvangelist from "@/data/roles/technical-evangelist";

export const ROLES: Role[] = [aiEnablementLead, engineeringManager, solutionsArchitect, forwardDeployedEngineer, seniorEngineer, technicalEvangelist].map(assembleRole);
