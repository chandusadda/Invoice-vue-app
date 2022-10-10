<template>
  <div class="sidebar">
    <div class="logo-main-div">
      <div class="logo-inner-div">
        <img alt="Vue logo" class="logo" src="@/assets/images/logo.svg" />
      </div>
    </div>

    <div class="sun-div">
      <img alt="sun icon" class="sun-icon" src="@/assets/images/icon-sun.svg" />
    </div>
    <div class="avatar-div">
      <img alt="avatar" class="avatar" src="@/assets/images/image-avatar.jpg" />
    </div>
  </div>
</template>


<style scoped>
    .sidebar {
      line-height: 1.5;
      min-height: 100vh;
      width: 6%;
      float: left;
      /* padding: 1rem; */
      background-color: var(--color-background-sidebar);
      border-bottom-right-radius: 1rem;
      position: fixed;
      top: 0;
    }
    .avatar-div {
      position: absolute;
      bottom: 0px;
      padding: 1rem;
      border-top: 0.5px solid #8883b0;
      width: 100%;
    }
    .sun-div {
      position: absolute;
      bottom: 8rem;
      left: 2rem;
    }
    .avatar {
      width: 38px;
      border-radius: 50%;
      margin-left: 0.5rem;
    }
    
    .logo-main-div {
      background-color: #7c5dfa;
      border-top-right-radius: 1rem;
      width: 100%;
      height: 6rem;
      border-bottom-right-radius: 1rem;
    }
    
    .logo-inner-div {
      background-color: #9277ff;
      border-top-left-radius: 1rem;
      width: 100%;
      height: 3rem;
      border-bottom-right-radius: 1rem;
      position: absolute;
      bottom: 0px;
    }
    
    .logo {
      display: block;
      margin: -1rem auto 2rem;
      width: 38px;
    }
    
    nav {
      width: 100%;
      font-size: 12px;
      text-align: center;
      margin-top: 2rem;
    }
    
    nav a.router-link-exact-active {
      color: var(--color-text);
    }
    
    nav a.router-link-exact-active:hover {
      background-color: transparent;
    }
    
    nav a {
      display: inline-block;
      padding: 0 1rem;
      border-left: 1px solid var(--color-border);
    }
    
    nav a:first-of-type {
      border: 0;
    }
    
    @media (min-width: 1024px) {
      nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;
    
        padding: 1rem 0;
        margin-top: 1rem;
      }
    }
    @media (max-width: 1200px) {
    
      .sun-div {
      left: 1rem;
    }
    .avatar {
      margin-left: 0rem;
    }
    
    }
    
    </style>