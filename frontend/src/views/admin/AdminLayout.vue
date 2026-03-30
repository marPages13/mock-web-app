<template>
  <div class="admin-layout">
    <nav class="admin-nav">
      <div class="admin-nav__inner">
        <span class="admin-nav__label">Admin</span>
        <RouterLink to="/admin/messages" class="admin-nav__link">Messages</RouterLink>
        <RouterLink to="/admin/users" class="admin-nav__link">Users</RouterLink>
        <RouterLink to="/" class="admin-nav__link admin-nav__link--back">Back to feed</RouterLink>
      </div>
    </nav>
    <div class="admin-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.admin-nav {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.admin-nav__inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  height: 44px;
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.admin-nav__label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.admin-nav__link {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}
.admin-nav__link:hover,
.admin-nav__link.router-link-active {
  color: var(--color-accent);
  text-decoration: none;
}

.admin-nav__link--back {
  margin-left: auto;
}

.admin-content {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}
</style>
