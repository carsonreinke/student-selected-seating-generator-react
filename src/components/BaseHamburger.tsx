import React from 'react';

export default function BaseHamburger() {
  return (
    <a className="hamburger">
      <span></span>
    </a>
  )
}

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