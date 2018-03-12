/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];

export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

// Type ordered alphabetically to prevent merge conflicts

export interface AppState {
  adminPages?: Extension[];
  authenticationError?: boolean;
  authorizationError?: boolean;
  canAdmin?: boolean;
  globalPages?: Extension[];
  organizationsEnabled?: boolean;
  qualifiers: string[];
}

export interface Branch {
  analysisDate?: string;
  isMain: boolean;
  name: string;
}

export type BranchLike = Branch | PullRequest;

export type BranchParameters = { branch?: string } | { pullRequest?: string };

export enum BranchType {
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export interface Breadcrumb {
  key: string;
  name: string;
  qualifier: string;
}

export interface Component extends LightComponent {
  analysisDate?: string;
  breadcrumbs: Breadcrumb[];
  configuration?: ComponentConfiguration;
  description?: string;
  extensions?: Extension[];
  isFavorite?: boolean;
  name: string;
  path?: string;
  refKey?: string;
  qualityProfiles?: { key: string; language: string; name: string }[];
  qualityGate?: { isDefault?: boolean; key: string; name: string };
  tags?: string[];
  version?: string;
  visibility?: string;
}

interface ComponentConfiguration {
  canApplyPermissionTemplate?: boolean;
  extensions?: Extension[];
  showBackgroundTasks?: boolean;
  showLinks?: boolean;
  showManualMeasures?: boolean;
  showQualityGates?: boolean;
  showQualityProfiles?: boolean;
  showPermissions?: boolean;
  showSettings?: boolean;
  showUpdateKey?: boolean;
}

export interface CoveredFile {
  key: string;
  longName: string;
  coveredLines: number;
}

export interface CurrentUser {
  isLoggedIn: boolean;
  showOnboardingTutorial?: boolean;
}

export interface CustomMeasure {
  createdAt?: string;
  description?: string;
  id: string;
  metric: {
    key: string;
    name: string;
    domain?: string;
    type: string;
  };
  projectKey: string;
  pending?: boolean;
  user: {
    active?: boolean;
    email?: string;
    login: string;
    name: string;
  };
  value: string;
  updatedAt?: string;
}

export interface Duplication {
  blocks: DuplicationBlock[];
}

export interface DuplicationBlock {
  _ref: string;
  from: number;
  size: number;
}

export interface DuplicatedFile {
  key: string;
  name: string;
  project: string;
  projectName: string;
  subProject?: string;
  subProjectName?: string;
}

export interface Extension {
  key: string;
  name: string;
}

export interface FacetValue {
  count: number;
  val: string;
}

export interface FlowLocation {
  msg: string;
  textRange: TextRange;
}

export interface Group {
  default?: boolean;
  description?: string;
  id: number;
  membersCount: number;
  name: string;
}

export type HomePage =
  | { type: HomePageType.Application; component: string }
  | { type: HomePageType.Issues }
  | { type: HomePageType.MyIssues }
  | { type: HomePageType.MyProjects }
  | { type: HomePageType.Organization; organization: string }
  | { type: HomePageType.Portfolio; component: string }
  | { type: HomePageType.Portfolios }
  | { type: HomePageType.Project; branch: string | undefined; component: string }
  | { type: HomePageType.Projects };

export enum HomePageType {
  Application = 'APPLICATION',
  Issues = 'ISSUES',
  MyIssues = 'MY_ISSUES',
  MyProjects = 'MY_PROJECTS',
  Organization = 'ORGANIZATION',
  Portfolio = 'PORTFOLIO',
  Portfolios = 'PORTFOLIOS',
  Project = 'PROJECT',
  Projects = 'PROJECTS'
}

export interface IdentityProvider {
  backgroundColor: string;
  helpMessage?: string;
  iconPath: string;
  key: string;
  name: string;
}

export function isLoggedIn(user: CurrentUser): user is LoggedInUser {
  return user.isLoggedIn;
}

export function isSameHomePage(a: HomePage, b: HomePage) {
  return (
    a.type === b.type &&
    (a as any).branch === (b as any).branch &&
    (a as any).component === (b as any).component &&
    (a as any).organization === (b as any).organization
  );
}

export interface Issue {
  actions?: string[];
  assignee?: string;
  assigneeActive?: string;
  assigneeAvatar?: string;
  assigneeLogin?: string;
  assigneeName?: string;
  author?: string;
  comments?: IssueComment[];
  component: string;
  componentLongName: string;
  componentQualifier: string;
  componentUuid: string;
  creationDate: string;
  effort?: string;
  key: string;
  flows: FlowLocation[][];
  line?: number;
  message: string;
  organization: string;
  project: string;
  projectName: string;
  projectOrganization: string;
  projectUuid: string;
  resolution?: string;
  rule: string;
  ruleName: string;
  secondaryLocations: FlowLocation[];
  severity: string;
  status: string;
  subProject?: string;
  subProjectName?: string;
  subProjectUuid?: string;
  tags?: string[];
  textRange?: TextRange;
  transitions?: string[];
  type: string;
}

export interface IssueComment {
  author?: string;
  authorActive?: boolean;
  authorAvatar?: string;
  authorLogin?: string;
  authorName?: string;
  createdAt: string;
  htmlText: string;
  key: string;
  markdown: string;
  updatable: boolean;
}

export interface LightComponent {
  key: string;
  organization: string;
  qualifier: string;
}

export interface LinearIssueLocation {
  from: number;
  index?: number;
  line: number;
  startLine?: number;
  to: number;
}

export interface LoggedInUser extends CurrentUser {
  avatar?: string;
  email?: string;
  homepage?: HomePage;
  isLoggedIn: true;
  login: string;
  name: string;
}

export interface LongLivingBranch extends Branch {
  isMain: false;
  status?: { qualityGateStatus: string };
  type: BranchType.LONG;
}

export interface MainBranch extends Branch {
  isMain: true;
}

export interface Metric {
  custom?: boolean;
  decimalScale?: number;
  description?: string;
  direction?: number;
  domain?: string;
  hidden?: boolean;
  id: string;
  key: string;
  name: string;
  qualitative?: boolean;
  type: string;
}

export interface Organization {
  adminPages?: { key: string; name: string }[];
  avatar?: string;
  canAdmin?: boolean;
  canDelete?: boolean;
  canProvisionProjects?: boolean;
  canUpdateProjectsVisibilityToPrivate?: boolean;
  description?: string;
  isAdmin?: boolean;
  isDefault?: boolean;
  key: string;
  name: string;
  pages?: { key: string; name: string }[];
  projectVisibility: Visibility;
  url?: string;
}

export interface Paging {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export interface PermissionTemplate {
  defaultFor: string[];
  id: string;
  name: string;
  description?: string;
  projectKeyPattern?: string;
  createdAt: string;
  updatedAt?: string;
  permissions: Array<{
    key: string;
    usersCount: number;
    groupsCount: number;
    withProjectCreator?: boolean;
  }>;
}

export interface ProjectLink {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface PullRequest {
  analysisDate?: string;
  base: string;
  branch: string;
  key: string;
  isOrphan?: true;
  status?: {
    bugs: number;
    codeSmells: number;
    vulnerabilities: number;
  };
  title: string;
  url?: string;
}

export interface Rule {
  isTemplate?: boolean;
  key: string;
  lang: string;
  langName: string;
  name: string;
  params?: RuleParameter[];
  severity: string;
  status: string;
  sysTags?: string[];
  tags?: string[];
  type: string;
}

export interface RuleActivation {
  createdAt: string;
  inherit: RuleInheritance;
  params: { key: string; value: string }[];
  qProfile: string;
  severity: string;
}

export interface RuleDetails extends Rule {
  createdAt: string;
  debtOverloaded?: boolean;
  debtRemFnCoeff?: string;
  debtRemFnOffset?: string;
  debtRemFnType?: string;
  defaultDebtRemFnOffset?: string;
  defaultDebtRemFnType?: string;
  defaultRemFnBaseEffort?: string;
  defaultRemFnType?: string;
  effortToFixDescription?: string;
  htmlDesc?: string;
  htmlNote?: string;
  internalKey?: string;
  mdDesc?: string;
  mdNote?: string;
  remFnBaseEffort?: string;
  remFnOverloaded?: boolean;
  remFnType?: string;
  repo: string;
  scope?: RuleScope;
  templateKey?: string;
}

export enum RuleInheritance {
  NotInherited = 'NONE',
  Inherited = 'INHERITED',
  Overridden = 'OVERRIDES'
}

export interface RuleParameter {
  // TODO is this extra really returned?
  extra?: string;
  defaultValue?: string;
  htmlDesc?: string;
  key: string;
  type: string;
}

export enum RuleScope {
  Main = 'MAIN',
  Test = 'TEST',
  All = 'ALL'
}

export interface ShortLivingBranch extends Branch {
  isMain: false;
  isOrphan?: true;
  mergeBranch: string;
  status?: {
    bugs: number;
    codeSmells: number;
    vulnerabilities: number;
  };
  type: BranchType.SHORT;
}

export interface SourceLine {
  code?: string;
  conditions?: number;
  coverageStatus?: string;
  coveredConditions?: number;
  duplicated?: boolean;
  line: number;
  lineHits?: number;
  scmAuthor?: string;
  scmDate?: string;
  scmRevision?: string;
}

export interface SourceViewerFile {
  canMarkAsFavorite?: boolean;
  fav?: boolean;
  key: string;
  leakPeriodDate?: string;
  measures: {
    coverage?: string;
    duplicationDensity?: string;
    issues?: string;
    lines?: string;
    tests?: string;
  };
  path: string;
  project: string;
  projectName: string;
  q: string;
  subProject?: string;
  subProjectName?: string;
  uuid: string;
}

export interface TestCase {
  coveredLines: number;
  durationInMs: number;
  fileId: string;
  fileKey: string;
  fileName: string;
  id: string;
  message?: string;
  name: string;
  stacktrace?: string;
  status: string;
}

export interface TextRange {
  startLine: number;
  startOffset: number;
  endLine: number;
  endOffset: number;
}

export interface User {
  active: boolean;
  avatar?: string;
  email?: string;
  externalIdentity?: string;
  externalProvider?: string;
  groups?: string[];
  local: boolean;
  login: string;
  name: string;
  scmAccounts?: string[];
  tokensCount?: number;
}

export enum Visibility {
  Public = 'public',
  Private = 'private'
}

export interface Webhook {
  key: string;
  latestDelivery?: WebhookDelivery;
  name: string;
  url: string;
}

export interface WebhookDelivery {
  at: string;
  durationMs: number;
  httpStatus?: number;
  id: string;
  success: boolean;
}
