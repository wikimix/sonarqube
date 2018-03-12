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
import * as React from 'react';
import StatusIndicator from './StatusIndicator';
import Level from '../ui/Level';
import BugIcon from '../icons-components/BugIcon';
import CodeSmellIcon from '../icons-components/CodeSmellIcon';
import VulnerabilityIcon from '../icons-components/VulnerabilityIcon';
import { BranchLike } from '../../app/types';
import { isShortLivingBranch, isPullRequest, isLongLivingBranch } from '../../helpers/branches';
import './BranchStatus.css';

interface Props {
  branchLike: BranchLike;
  concise?: boolean;
}

export default function BranchStatus({ branchLike, concise = false }: Props) {
  if (isShortLivingBranch(branchLike) || isPullRequest(branchLike)) {
    if (!branchLike.status) {
      return null;
    }

    const totalIssues =
      branchLike.status.bugs + branchLike.status.vulnerabilities + branchLike.status.codeSmells;

    const indicatorColor = totalIssues > 0 ? 'red' : 'green';

    return concise ? (
      <ul className="branch-status">
        <li>{totalIssues}</li>
        <li className="spacer-left">
          <StatusIndicator color={indicatorColor} size="small" />
        </li>
      </ul>
    ) : (
      <ul className="branch-status">
        <li className="spacer-right">
          <StatusIndicator color={indicatorColor} size="small" />
        </li>
        <li className="spacer-left">
          {branchLike.status.bugs}
          <BugIcon />
        </li>
        <li className="spacer-left">
          {branchLike.status.vulnerabilities}
          <VulnerabilityIcon />
        </li>
        <li className="spacer-left">
          {branchLike.status.codeSmells}
          <CodeSmellIcon />
        </li>
      </ul>
    );
  } else if (isLongLivingBranch(branchLike)) {
    if (!branchLike.status) {
      return null;
    }

    return <Level level={branchLike.status.qualityGateStatus} small={true} />;
  } else {
    return null;
  }
}
