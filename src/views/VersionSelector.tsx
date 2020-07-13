import React from 'react';
import BaseHamburger from '../components/BaseHamburger';
import BaseHeader from '../components/BaseHeader';
import styles from './VersionSelector.module.css';
import add from '../assets/images/add.svg';

type VersionSelectorProps = {};

export default class VersionSelector extends React.Component<VersionSelectorProps> {
  constructor(props: VersionSelectorProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <BaseHamburger />
        <nav className="pure-menu">
          <BaseHeader />
          <p>Let's get started!</p>
          <ul className="pure-menu-list">
            {/*<li class="pure-menu-item pure-menu-link menu-new" @click="newVersion">
              <img src={add} alt="New" /> New
            </li>*/}
          </ul>
          <h3>Saved</h3>
          <ul className="pure-menu-list menu-bottom">
            {/*<li
              class="pure-menu-item pure-menu-link"
              v-for="version in versions"
              :key="version.id"
              @click="loadVersion(version)"
            >{{ version.name }} Created On {{ version.createdAtDate().toLocaleString() }}</li>
            */}
          </ul>
        </nav>
        <main>
          <div className={styles.ribbon}>
            <a href="https://github.com/carsonreinke/student-selected-seating-generator-react">
              <img
                width="149"
                height="149"
                src="https://github.blog/wp-content/uploads/2008/12/forkme_right_gray_6d6d6d.png?resize=149%2C149"
                alt="Fork me on GitHub"
              />
            </a>
          </div>

          <h2>Welcome</h2>
          <p>This a simple tool to help teachers arrange students in a classroom based on their own preferences for each other. Students will be automatically selected for a particular desk based on proximity of their preferences.</p>
          <p>
            A note on <b>privacy</b>, this tool has no tracking/analytics and all data saved is on your local web browser.
        </p>

          <p className={styles.bottom}>
            Built by <a href="https://reinke.co/">Carson Reinke</a>
          </p>
        </main>
      </div>
    );
  }
}
