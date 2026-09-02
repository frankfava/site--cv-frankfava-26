/**
 * Catalog of every role dossier.
 *
 * Each role module exports both halves of itself - the `entry` that gives it a
 * page and the `definition` that gives it content - so a role is registered by
 * one name here and cannot be half-added.
 */

import type { Role } from "@/lib/roles";
import { assembleRole } from "@/lib/roles";

import * as engineeringManager from "@/blueprints/roles/engineering-manager";
import * as solutionsArchitect from "@/blueprints/roles/solutions-architect";
import * as forwardDeployedEngineer from "@/blueprints/roles/forward-deployed-engineer";
import * as seniorEngineer from "@/blueprints/roles/senior-engineer";
import * as technicalEvangelist from "@/blueprints/roles/technical-evangelist";

export const ROLES: Role[] = [engineeringManager, solutionsArchitect, forwardDeployedEngineer, seniorEngineer, technicalEvangelist].map(assembleRole);
