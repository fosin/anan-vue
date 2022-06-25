<template>
  <el-dialog :title="title" :visible.sync="dialogPermissionVisible" width="550px" @close="close">
    <el-input
      v-model="filterPermissionText"
      placeholder="输入关键字进行过滤"
    />
    <el-tree
      v-if="hackReset"
      ref="permissionTree"
      :default-checked-keys="checkedKeys"
      :load="loadChildPermissions"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :default-expanded-keys="[1]"
      class="filter-tree"
      node-key="id"
      highlight-current
      show-checkbox
      lazy
      :check-strictly="!checkStrictly"
    />
    <div slot="footer" class="dialog-footer">
      <div style="float: left">
        <el-checkbox v-model="checkStrictly">级联选择</el-checkbox>
      </div>
      <el-button round icon="el-icon-circle-close" @click="cancel()">
        {{ $t('table.cancel') }}
      </el-button>
      <el-button v-if="hasPermission(permissionId)" round type="primary" icon="el-icon-circle-check" @click="updatePermession(form.id)">
        {{ $t('table.update') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPermissionVname } from '@/views/platform/permission/permission'
import { getServiceByStatus } from '@/views/platform/service/service'
import { mapGetters } from 'vuex'

export default {
  name: 'GrantPermission',
  data() {
    return {
      checkStrictly: false,
      parent: {},
      form: {},
      title: '分配权限',
      expandKeys: [],
      checkedKeys: [],
      typeOptions: [],
      validServices: [],
      dialogPermissionVisible: false,
      hackReset: false,
      permissionId: '-1',
      defaultProps: {
        children: 'children',
        label: 'vname',
        isLeaf: 'leaf',
        disabled: 'disabled'
      },
      filterPermissionText: ''
    }
  },
  computed: {
    ...mapGetters(['ananPermissions'])
  },
  watch: {
    filterPermissionText(val) {
      this.$refs.permissionTree.filter(val)
    }
  },
  created() {
    this.loadDictionaryById(13).then(res => {
      this.typeOptions = res.details
    })
    getServiceByStatus().then(res => {
      this.validServices = res.data.data
    })
  },
  methods: {
    hasPermission(permissionId) {
      if (permissionId && typeof (permissionId) === 'string') {
        const hasPermission = this.ananPermissions[permissionId] || false
        if (!hasPermission) {
          return false
        }
      } else {
        throw new Error(`need permission! Like "'1'"`)
      }
      return true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    updatePermession(id) {
      // 得到当前已展开项目中被选中的权限
      const checkedPermissions = this.$refs.permissionTree.getCheckedKeys().sort() // 当前选中的权限集合
      const halfCheckedPermissions = this.$refs.permissionTree.getHalfCheckedKeys().sort() // 当前半选中的权限集合
      const beforePermissions = this.checkedKeys.sort() // 当前角色已拥有的所有权限集合
      const expandPermissions = this.expandKeys.sort() // 树中已展开的权限集合

      // 求并集，得到的所有实际被选中的权限 checkedPermissions + halfCheckedPermissions
      const allCheckedPermissions = checkedPermissions.concat(halfCheckedPermissions.filter(function(v) {
        return checkedPermissions.indexOf(v) === -1
      })).sort()

      // 求差集
      const differencePermissions = beforePermissions.filter(function(v) {
        return expandPermissions.indexOf(v) === -1
      })

      // 求并集
      const unionPermissions = differencePermissions.concat(allCheckedPermissions.filter(function(v) {
        return differencePermissions.indexOf(v) === -1
      })).sort()

      // 如果没有修改过数据则直接返回
      if (unionPermissions.toString() === beforePermissions.toString()) {
        this.dialogPermissionVisible = false
        return
      }
      this.parent.updatePermession(id, unionPermissions).then(() => {
        this.dialogPermissionVisible = false
        this.$notify({
          title: '成功',
          message: '更新权限成功!',
          type: 'success',
          duration: 2000
        })
      }).catch(reason => {
        this.$notify({
          title: '更新权限失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    getCheckedKeys(permissions) {
      const checkedKeys = []
      if (!permissions || permissions.length < 1) {
        return checkedKeys
      }
      for (let i = 0; i < permissions.length; i++) {
        checkedKeys.push(permissions[i].permissionId)
      }
      return checkedKeys
    },
    initData(parent, form, objectPermissions, permissionId, hackReset) {
      this.parent = parent
      this.form = form
      this.permissionId = permissionId
      this.checkedKeys = this.getCheckedKeys(objectPermissions)
      if (this.$refs && this.$refs.permissionTree) {
        this.$refs.permissionTree.setCheckedKeys(this.checkedKeys)
      }
      this.dialogPermissionVisible = true
      if (hackReset) {
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
      } else {
        this.hackReset = true
      }
      this.title = '分配权限' + ' -> ' + form.name
    },
    cancel() {
      this.dialogPermissionVisible = false
    },
    loadChildPermissions(node, resolve) {
      let pid = 0
      if (node.level !== 0) {
        pid = node.data.id
      }
      this.parent.listChildPermissions(pid).then(response => {
        const childPermissions = response.data.data || []
        // 记录所有被展开过的节点ID，用于保存时比较数据
        for (let i = 0; i < childPermissions.length; i++) {
          const permission = childPermissions[i]
          this.expandKeys.push(permission.id)
          // childPermissions[i].disabled = pid === 0
          permission.vname = getPermissionVname(this.validServices, this.typeOptions, permission)
          childPermissions[i] = permission
        }
        return resolve(childPermissions)
      }).catch(reason => {
        this.$notify({
          title: '加载子节点失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    close() {
      this.parent = {}
      this.form = {}
      this.checkedKeys = []
      this.title = ''
      this.expandKeys = []
      this.dialogPermissionVisible = false
      // debugger
      // this.$refs.permissionTree.remove()
    }
  }
}
</script>

<style scoped>

</style>
