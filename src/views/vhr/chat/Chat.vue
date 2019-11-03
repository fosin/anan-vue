<template>
  <div>
    <el-tabs v-model="activeName" style="margin-top: 10px" @tab-click="handleClick">
      <el-tab-pane label="系统通知" name="notification">
        <nf />
      </el-tab-pane>
      <el-tab-pane label="好友聊天" name="chat">
        <fc />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import FriendChat from './FriendChat'
import Notification from './Notification'
export default {
  components: {
    'fc': FriendChat,
    'nf': Notification
  },
  data() {
    return {
      activeName: 'notification'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
