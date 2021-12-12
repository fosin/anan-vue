<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button v-waves v-permission="'84'" round type="primary" class="filter-item" icon="el-icon-refresh" @click="handleRefresh()">
          {{ $t('table.refresh') }}
        </el-button>
        <el-button v-waves v-permission="'8'" round type="primary" class="filter-item" icon="el-icon-circle-plus" style="margin-left: 5px;" @click="handleAdd()">
          {{ $t('table.add') }}
        </el-button>
        <el-button v-waves v-permission="'9'" round type="success" class="filter-item" icon="el-icon-edit" style="margin-left: 5px;" @click="handleUpdate()">
          {{ $t('table.edit') }}
        </el-button>
        <el-button v-waves v-permission="'10'" round type="danger" class="filter-item" icon="el-icon-delete" style="margin-left: 5px;" @click="handleDelete()">
          {{ $t('table.delete') }}
        </el-button>
      </el-button-group>
    </div>
    <el-row>
      <el-col :span="8" style="margin-top:15px;">
        <el-tree
          v-if="hackReset"
          ref="permissionTree"
          :load="loadChild"
          :default-expanded-keys="defaultExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          class="filter-tree"
          node-key="id"
          highlight-current
          lazy
          @node-click="getNodeData"
        />
      </el-col>
      <el-col :span="16" style="margin-top:15px;">
        <el-card class="box-card">
          <el-form ref="grantForm" :label-position="labelPosition" :model="form" :rules="formRules" label-width="100px">
            <el-form-item v-if="formStatus === 'update'">
              <el-button v-waves round icon="el-icon-circle-close" @click="onCancel">
                {{ $t('table.cancel') }}
              </el-button>
              <el-button v-waves round type="primary" icon="el-icon-circle-check" @click="update">
                {{ $t('table.update') }}
              </el-button>
            </el-form-item>
            <el-form-item v-if="formStatus === 'create'">
              <el-button v-waves round icon="el-icon-circle-close" @click="onCancel">
                {{ $t('table.cancel') }}
              </el-button>
              <el-button v-waves round type="primary" icon="el-icon-circle-check" @click="create">
                {{ $t('table.create') }}
              </el-button>
            </el-form-item>

            <el-row>
              <el-col :span="7">
                <el-form-item :label="$t('anan_permission.pid.label')" prop="pName">
                  <el-tag>{{ parent.name }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :label="$t('anan_permission.level.label')" prop="level">
                  <el-tag>{{ form.level }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('anan_permission.serviceId.label')" prop="serviceId">
                  <el-select v-model="form.serviceId" :disabled="formUpdate?formUpdate:parent.level !== 0" :placeholder="$t('anan_permission.serviceId.placeholder')" class="filter-item" value="">
                    <el-option v-for="item in validServices" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('anan_permission.name.label')" prop="name">
                  <el-input v-model="form.name" :disabled="formUpdate" :placeholder="$t('anan_permission.name.placeholder')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('anan_permission.code.label')" prop="code">
                  <el-input v-model="form.code" :disabled="formUpdate" :placeholder="$t('anan_permission.code.placeholder')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('anan_permission.url.label')" prop="url">
              <el-input v-model="form.url" :disabled="formUpdate" :placeholder="$t('anan_permission.url.placeholder')" />
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('anan_permission.path.label')" prop="path">
                  <el-input v-model="form.path" :disabled="formUpdate" :placeholder="$t('anan_permission.path.placeholder')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('anan_permission.routePath.label')" prop="routePath">
                  <el-input v-model="form.routePath" :disabled="formUpdate" :placeholder="$t('anan_permission.routePath.placeholder')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('anan_permission.method.label')" prop="methodArray">
                      <el-select v-model="form.methodArray" :disabled="formUpdate" :placeholder="$t('anan_permission.method.placeholder')" multiple>
                        <el-option v-for="item in methodOptions" :key="item.scode" :label="item.value" :value="item.scode" :disabled="item.status === 1" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="$t('anan_permission.type.label')" prop="type">
                      <el-select v-model="form.type" :disabled="formUpdate" :placeholder="$t('anan_permission.type.placeholder')" class="filter-item">
                        <el-option v-for="item in typeOptions" :key="item.name" :label="item.value" :value="item.name" :disabled="item.status === 1" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item :label="$t('anan_permission.sort.label')" prop="sort">
                      <el-input v-model="form.sort" :disabled="formUpdate" :placeholder="$t('anan_permission.sort.placeholder')" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="4">
                <svg-icon :icon-class="form.icon" style="width: 80px; height: 80px; border-radius: 50%; margin-left: 20px; margin-top: 15px; background: #fff; color: #40c9c6;" @click.native="handleSelectAvatar" />
              </el-col>
            </el-row>
            <el-form-item :label="$t('anan_permission.status.label')" prop="status">
              <el-switch
                v-model="form.status"
                :disabled="formUpdate"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <IconsSelect ref="iconsSelect" />
  </div>
</template>

<script>
import {
  listChildPermissions,
  getPermission,
  postPermission,
  deletePermission,
  putPermission, getPermissionVname
} from './permission'
import { getServiceByStatus } from '@/views/platform/service/service'
import IconsSelect from '@/components/IconsSelect/index'

export default {
  name: 'DevelopmentPermission',
  components: {
    IconsSelect
  },
  data() {
    return {
      parent: {},
      list: null,
      total: null,
      formUpdate: true,
      serviceIdUpdate: true,
      hackReset: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: [],
      methodOptions: [],
      validServices: [],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultExpandedKeys: [1],
      defaultProps: {
        children: 'children',
        label: 'vname',
        isLeaf: 'leaf'
      },
      labelPosition: 'right',
      form: {
        icon: 'permission',
        methodArray: []
      },
      currentId: -1,
      formRules: {
        url: [
          { pattern: /^[A-Za-z0-9/:.@#?=& \\-]+$/, message: '资源路径只支持大小写字母 数字 & / : . @ - ? = #' }
        ],
        path: [
          { pattern: /^[A-Za-z0-9/?*. \\-]+$/, message: '匹配路径只支持大小写字母 数字 / . * - ?' }
        ],
        routePath: [
          { pattern: /^[A-Za-z0-9/:?*. \\-]+$/, message: '匹配路径只支持大小写字母 数字 : / . * - ?' }
        ],
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          },
          { pattern: /^[^`~!@#$^&*()=|{}'\\":;,\[\].<>/?！￥…（）—【】‘；：”“。，、？%+_·-]{1,64}$/, message: '名称不能包含特殊字符,长度不超过64位' }
        ],
        code: [
          {
            required: true,
            message: '编码不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          },
          { pattern: /^[A-Z][a-zA-Z0-9]{1,64}$/, message: '权限编码只能大写字母开始，大小写字母、数字组合而成,长度不超过64位' }
        ]
      }
    }
  },
  mounted() {
    this.loadDictionaryById(13).then(res => {
      this.typeOptions = res.details
    })
    this.loadDictionaryById(12).then(res => {
      this.methodOptions = res.details
    })
    getServiceByStatus().then(response => {
      this.validServices = response.data
    }).catch(reason => {
      this.$notify({
        title: '加载服务列表失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    this.$refs.iconsSelect.init(this.setAvatar)
    this.resetForm()
  },
  methods: {
    handleSelectAvatar() {
      if (!this.formUpdate) {
        this.$refs.iconsSelect.show()
      }
    },
    setAvatar(icon) {
      this.form.icon = icon
    },
    getFileName(pathFile) {
      let name = pathFile
      if (pathFile) {
        const i = pathFile.lastIndexOf('/')
        if (i > 0) {
          const fullName = pathFile.substr(i + 1)
          const j = fullName.lastIndexOf('.')
          if (j > 0) {
            name = fullName.substr(0, j)
          }
        }
      }
      return name
    },
    loadChild(node, resolve) {
      let pid = 0
      if (node.level !== 0) {
        pid = node.data.id
      }
      listChildPermissions(pid).then(response => {
        if (pid === 0) {
          this.defaultExpandedKeys[0] = response.data[0].id
        }
        const permissions = response.data
        if (permissions && permissions.length > 0) {
          for (let i = 0; i < permissions.length; i++) {
            permissions[i].vname = getPermissionVname(this.validServices, this.typeOptions, permissions[i])
          }
        }
        return resolve(response.data || [])
      }).catch(reason => {
        this.$notify({
          title: '加载子节点失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getNodeData(data) {
      if (data.id === this.currentId) {
        return
      }

      if (!this.formUpdate) {
        this.formStatus = 'update'
      }
      getPermission(data.id).then(response => {
        this.form = response.data
        this.form.status = this.form.status + ''
        this.form.methodArray = []
        if (this.form.method) {
          this.form.methodArray = this.form.method.split(',')
        }
        if (!this.form.icon) {
          this.form.icon = ''
        }
      }).catch(reason => {
        this.$notify({
          title: '获取权限失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
      this.currentId = data.id
      this.showElement = true
      const pNode = this.$refs.permissionTree.getNode(data.pid)
      if (pNode) {
        this.parent = pNode.data
      } else {
        this.parent = data
        this.formStatus = ''
        this.formUpdate = true
      }
    },
    handleUpdate() {
      const pNode = this.$refs.permissionTree.getNode(this.form.pid)
      if (!pNode) {
        this.$message({
          message: '根节点不能修改'
        })
        return
      }
      if (this.form.id) {
        this.formUpdate = false
        this.formStatus = 'update'
      }
    },
    handleRefresh() {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    handleAdd() {
      this.parent = this.form
      if (!this.parent.id) {
        this.$message({
          message: '请选择一个父节点再新增子节点'
        })
        return
      }
      if (this.parent.type === 0) {
        this.$message({
          message: '按钮下不能再新增子节点'
        })
        return
      }
      this.resetForm()
      this.formUpdate = false
      this.formStatus = 'create'
    },
    handleDelete() {
      if (!this.form || !this.form.id) {
        this.$message({
          message: '请先选择一个要删除的节点!'
        })
        return
      }
      const cNode = this.$refs.permissionTree.getNode(this.form.id)
      if (cNode && cNode.childNodes && cNode.childNodes.length > 0) {
        this.$message({
          message: '该节点还存在子节点不能直接删除'
        })
        return
      }
      this.$confirm('此操作将永久删除节点[ ' + this.form.name + ' ], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePermission(this.currentId).then(() => {
          this.$refs.permissionTree.remove(this.currentId)
          this.resetForm()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '删除权限失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(reason => {
      })
    },
    update() {
      this.form.method = this.form.methodArray.join(',')
      putPermission(this.form).then(() => {
        const cNode = this.$refs.permissionTree.getNode(this.form.id)
        if (cNode) {
          cNode.data.vname = getPermissionVname(this.validServices, this.typeOptions, this.form)
        }
        this.$notify({
          title: '成功',
          message: '更新成功',
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
    create() {
      this.form.method = this.form.methodArray.join(',')
      postPermission(this.form).then(response => {
        const pNode = this.$refs.permissionTree.getNode(this.form.pid)
        response.data.vname = getPermissionVname(this.validServices, this.typeOptions, response.data)
        this.$refs.permissionTree.append(response.data, pNode)
        // TODO 以下代码启用后可以解决tree控件bug(会导致原有子节点丢失问题)
        pNode.data.children = null
        this.resetForm()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }).catch(reason => {
        this.$notify({
          title: '创建权限失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    onCancel() {
      this.formUpdate = true
      this.formStatus = ''
    },
    resetForm() {
      let code = this.parent.code || ''
      // code = code.substr(-1) === '_' ? code : code + '_'
      let sort
      let type = 1
      if (this.$refs && this.$refs.permissionTree) {
        const pNode = this.$refs.permissionTree.getNode(this.parent.id || 0)
        if (pNode) {
          sort = pNode.childNodes.length + 1
          if (pNode.level === 1) {
            code = ''
          }
          if (sort > 1) {
            type = pNode.childNodes[0].data.type
          }
        }
      }
      let icon = 'permission'
      switch (type) {
        // 按钮
        case 0:
          icon = 'button'
          break
          // 组件菜单
        case 1:
          icon = 'form'
          break
          // 直接链接菜单
        case 2:
          icon = 'link'
          break
          // 目录菜单
        case 3:
          icon = 'list'
          break
          // 间接链接菜单
        case 4:
          icon = 'link'
          break
          // 服务
        case 5:
          icon = 'service'
          break
          // 子组件
        case 6:
          icon = 'component'
          break
          // 外部链接菜单
        case 7:
          icon = 'external-link'
          break
      }
      this.form = {
        code: code,
        name: undefined,
        id: undefined,
        pid: this.currentId,
        url: '',
        sort: sort,
        type: type,
        status: '0',
        icon: icon,
        level: this.parent.level + 1,
        method: undefined,
        methodArray: [],
        serviceId: this.parent.serviceId
      }
    }
  }
}
</script>

<style scoped>
  .el-select {
  width: 100%;
}
</style>
