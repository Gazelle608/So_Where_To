<template>
  <header class="app-header-authentication">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">So Where To</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link to="/login" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a href="#" class="nav-link" @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppHeaderAuthentication',
  computed: {
    ...mapGetters('auth', [
      'isAuthenticated'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'logout'
    ])
  }
}
</script>

<style scoped>
.app-header-authentication {
  background-color: #FFFFFF;
  padding: 10px;
  border-bottom: 1px solid #CCCCCC;
}

.navbar-brand {
  font-weight: 700;
  color: #333333;
}

.navbar-nav {
  display: flex;
  justify-content: flex-end;
}

.nav-link {
  color: #333333;
  font-weight: 700;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #FF6B6B;
  transform: scale(1.1);
}

.nav-link:focus {
  outline: none;
  box-shadow: none;
}

.nav-link:focus:hover {
  color: #FF6B6B;
  transform: scale(1.1);
}
</style>