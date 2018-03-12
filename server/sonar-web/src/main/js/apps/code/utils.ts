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
import { without } from 'lodash';
import {
  addComponent,
  getComponent as getComponentFromBucket,
  addComponentChildren,
  getComponentChildren,
  addComponentBreadcrumbs,
  getComponentBreadcrumbs
} from './bucket';
import { Breadcrumb, Component } from './types';
import { getChildren, getComponent, getBreadcrumbs } from '../../api/components';
import { BranchLike } from '../../app/types';
import { getBranchLikeQuery } from '../../helpers/branches';

const METRICS = [
  'ncloc',
  'code_smells',
  'bugs',
  'vulnerabilities',
  'coverage',
  'duplicated_lines_density',
  'alert_status'
];

const PORTFOLIO_METRICS = [
  'releasability_rating',
  'alert_status',
  'reliability_rating',
  'security_rating',
  'sqale_rating',
  'ncloc'
];

const PAGE_SIZE = 100;

function requestChildren(
  componentKey: string,
  metrics: string[],
  page: number,
  branchLike?: BranchLike
): Promise<Component[]> {
  return getChildren(componentKey, metrics, {
    p: page,
    ps: PAGE_SIZE,
    ...getBranchLikeQuery(branchLike)
  }).then(r => {
    if (r.paging.total > r.paging.pageSize * r.paging.pageIndex) {
      return requestChildren(componentKey, metrics, page + 1, branchLike).then(moreComponents => {
        return [...r.components, ...moreComponents];
      });
    }
    return r.components;
  });
}

function requestAllChildren(
  componentKey: string,
  metrics: string[],
  branchLike?: BranchLike
): Promise<Component[]> {
  return requestChildren(componentKey, metrics, 1, branchLike);
}

interface Children {
  components: Component[];
  page: number;
  total: number;
}

interface ExpandRootDirFunc {
  (children: Children): Promise<Children>;
}

function expandRootDir(metrics: string[], branchLike?: BranchLike): ExpandRootDirFunc {
  return function({ components, total, ...other }) {
    const rootDir = components.find(
      (component: Component) => component.qualifier === 'DIR' && component.name === '/'
    );
    if (rootDir) {
      return requestAllChildren(rootDir.key, metrics, branchLike).then(rootDirComponents => {
        const nextComponents = without([...rootDirComponents, ...components], rootDir);
        const nextTotal = total + rootDirComponents.length - /* root dir */ 1;
        return { components: nextComponents, total: nextTotal, ...other };
      });
    } else {
      return Promise.resolve({ components, total, ...other });
    }
  };
}

function prepareChildren(r: any): Children {
  return {
    components: r.components,
    total: r.paging.total,
    page: r.paging.pageIndex
  };
}

function skipRootDir(breadcrumbs: Component[]) {
  return breadcrumbs.filter(component => {
    return !(component.qualifier === 'DIR' && component.name === '/');
  });
}

function storeChildrenBase(children: Component[]) {
  children.forEach(addComponent);
}

function storeChildrenBreadcrumbs(parentComponentKey: string, children: Breadcrumb[]) {
  const parentBreadcrumbs = getComponentBreadcrumbs(parentComponentKey);
  if (parentBreadcrumbs) {
    children.forEach(child => {
      const breadcrumbs = [...parentBreadcrumbs, child];
      addComponentBreadcrumbs(child.key, breadcrumbs);
    });
  }
}

function getMetrics(isPortfolio: boolean) {
  return isPortfolio ? PORTFOLIO_METRICS : METRICS;
}

function retrieveComponentBase(
  componentKey: string,
  isPortfolio: boolean,
  branchLike?: BranchLike
) {
  const existing = getComponentFromBucket(componentKey);
  if (existing) {
    return Promise.resolve(existing);
  }

  const metrics = getMetrics(isPortfolio);

  return getComponent({
    componentKey,
    metricKeys: metrics.join(),
    ...getBranchLikeQuery(branchLike)
  }).then(component => {
    addComponent(component);
    return component;
  });
}

export function retrieveComponentChildren(
  componentKey: string,
  isPortfolio: boolean,
  branchLike?: BranchLike
): Promise<{ components: Component[]; page: number; total: number }> {
  const existing = getComponentChildren(componentKey);
  if (existing) {
    return Promise.resolve({
      components: existing.children,
      total: existing.total,
      page: existing.page
    });
  }

  const metrics = getMetrics(isPortfolio);

  return getChildren(componentKey, metrics, {
    ps: PAGE_SIZE,
    s: 'qualifier,name',
    ...getBranchLikeQuery(branchLike)
  })
    .then(prepareChildren)
    .then(expandRootDir(metrics, branchLike))
    .then(r => {
      addComponentChildren(componentKey, r.components, r.total, r.page);
      storeChildrenBase(r.components);
      storeChildrenBreadcrumbs(componentKey, r.components);
      return r;
    });
}

function retrieveComponentBreadcrumbs(
  component: string,
  branchLike?: BranchLike
): Promise<Breadcrumb[]> {
  const existing = getComponentBreadcrumbs(component);
  if (existing) {
    return Promise.resolve(existing);
  }

  return getBreadcrumbs({ component, ...getBranchLikeQuery(branchLike) })
    .then(skipRootDir)
    .then(breadcrumbs => {
      addComponentBreadcrumbs(component, breadcrumbs);
      return breadcrumbs;
    });
}

export function retrieveComponent(
  componentKey: string,
  isPortfolio: boolean,
  branchLike?: BranchLike
): Promise<{
  breadcrumbs: Component[];
  component: Component;
  components: Component[];
  page: number;
  total: number;
}> {
  return Promise.all([
    retrieveComponentBase(componentKey, isPortfolio, branchLike),
    retrieveComponentChildren(componentKey, isPortfolio, branchLike),
    retrieveComponentBreadcrumbs(componentKey, branchLike)
  ]).then(r => {
    return {
      component: r[0],
      components: r[1].components,
      total: r[1].total,
      page: r[1].page,
      breadcrumbs: r[2]
    };
  });
}

export function loadMoreChildren(
  componentKey: string,
  page: number,
  isPortfolio: boolean,
  branchLike?: BranchLike
): Promise<Children> {
  const metrics = getMetrics(isPortfolio);

  return getChildren(componentKey, metrics, {
    ps: PAGE_SIZE,
    p: page,
    ...getBranchLikeQuery(branchLike)
  })
    .then(prepareChildren)
    .then(expandRootDir(metrics, branchLike))
    .then(r => {
      addComponentChildren(componentKey, r.components, r.total, r.page);
      storeChildrenBase(r.components);
      storeChildrenBreadcrumbs(componentKey, r.components);
      return r;
    });
}
