<template>
  <div class="dashboard-container">
    <component :is="ananCurrentRole" />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      ananCurrentRole: 'adminDashboard'
    }
  },
  computed: {
    // ...mapGetters([
    //   'roles'
    // ])
  },
  mounted() {
    // if (!this.roles.includes('admin')) {
    //   this.ananCurrentRole = 'editorDashboard'
    // }
  }
}
</script>
