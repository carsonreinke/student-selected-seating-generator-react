import React, { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectVersions } from '../app/rootSlice';
import { newVersion, loadVersion } from '../app/roomSlice';
import Header from '../components/Header';
import styles from './VersionSelector.module.css';
import add from '../assets/images/add.svg';
import { Room } from '../models/room';

interface VersionSelectorProps {
  menu: ReactNode;
  redirect: (path: string) => void;
}

const VersionSelector = ({
  menu,
  redirect
}: VersionSelectorProps) => {
  const dispatch = useDispatch();
  const versions = useSelector(selectVersions);

  const onNewVersion = async () => {
    await dispatch(newVersion());
    redirect('/desks');
  };
  const onLoadVersion = async (version: Room) => {
    await dispatch(loadVersion(version));
    redirect('/desks');
  };

  return (
    <div className="view-version-selector">
      {menu}
      <nav className="pure-menu">
        <Header />
        <p>Let's get started!</p>
        <ul className="pure-menu-list">
          <li className="pure-menu-item pure-menu-link menu-new" onClick={onNewVersion}>
            <img src={add} alt="New" /> New
          </li>
        </ul>
        <h3>Saved</h3>
        <ul className="pure-menu-list menu-bottom">
          {versions.map(version => {
            return (
              <li className="pure-menu-item pure-menu-link" key={version.id} onClick={() => { onLoadVersion(version) }}>
                {version.name} Created on {new Date(version.createdAt).toLocaleString()}
              </li>
            );
          })}
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
};
export default VersionSelector;
