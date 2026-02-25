<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <router-link to="/" class="btn btn-primary">
          Go Back Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  color: #FF6B6B;
  line-height: 1;
  margin-bottom: 20px;
  animation: fadeInDown 0.5s ease;
}

.error-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
  animation: fadeInUp 0.5s ease 0.2s both;
}

.error-message {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
  animation: fadeInUp 0.5s ease 0.3s both;
}

.btn {
  display: inline-block;
  padding: 12px 30px;
  background: #FF6B6B;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s;
  animation: fadeInUp 0.5s ease 0.4s both;
}

.btn:hover {
  background: #FF5252;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark Mode */
.dark-mode .error-title {
  color: #F5F9FF;
}

.dark-mode .error-message {
  color: #B0C4DE;
}

.dark-mode .btn {
  background: #00D4FF;
  color: #0B1E33;
}

.dark-mode .btn:hover {
  background: #80EAFF;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
}
</style>