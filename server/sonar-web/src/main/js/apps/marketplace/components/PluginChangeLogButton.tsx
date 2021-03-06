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
import PluginChangeLog from './PluginChangeLog';
import { Release, Update } from '../../../api/plugins';
import BubblePopupHelper from '../../../components/common/BubblePopupHelper';
import { Button } from '../../../components/ui/buttons';

interface Props {
  release: Release;
  update: Update;
}

interface State {
  changelogOpen: boolean;
}

export default class PluginChangeLogButton extends React.PureComponent<Props, State> {
  state: State = { changelogOpen: false };

  toggleChangelog = (show?: boolean) => {
    if (show !== undefined) {
      this.setState({ changelogOpen: show });
    } else {
      this.setState(state => ({ changelogOpen: !state.changelogOpen }));
    }
  };

  handleClick = () => {
    this.toggleChangelog();
  };

  render() {
    return (
      <div className="display-inline-block little-spacer-left">
        <Button
          className="button-link js-changelog issue-rule icon-ellipsis-h"
          onClick={this.handleClick}
        />
        <BubblePopupHelper
          isOpen={this.state.changelogOpen}
          popup={<PluginChangeLog release={this.props.release} update={this.props.update} />}
          position="bottomright"
          togglePopup={this.toggleChangelog}
        />
      </div>
    );
  }
}
