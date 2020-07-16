import React, { MouseEvent } from 'react';
import styles from './Hamburger.module.css';

interface BurgerProps {
  expanded: boolean,
  toggle: () => void
}

const Hamburger = ({
  expanded,
  toggle
}: BurgerProps) => {
  const onToggle = (event: MouseEvent) => {
    event.preventDefault();
    toggle();
  }

  let classes = styles.hamburger;
  if(expanded) {
    classes += ' ' + styles.expanded;
  }

  return (
    <a className={classes} onClick={onToggle}>
      <span></span>
    </a>
  );
};
export default Hamburger;

// export default class BaseHamburger extends Component {
//   toggle(event: MouseEvent) {
//     event.preventDefault();

//     store.dispatch(toggle());
//   }

//   render() {
//     const expanded = useSelector((state: RootState) => {
//       return state.app.expanded;
//     });

//     return (
//       <a className={expanded ? 'expanded': ''}{styles.hamburger} onClick={this.toggle}>
//         <span></span>
//       </a>
//     );
//   }
// }

/*
<template>
  <a class="hamburger" @click="toggle">
    <span></span>
  </a>
</template>

<script>
export default {
  methods: {
    toggle: event => {
      const element = document.getElementById("app");

      if (element.classList.contains("expanded")) {
        element.classList.remove("expanded");
      } else {
        element.classList.add("expanded");
      }
    }
  }
};
</script>

*/
