
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" class="filter-item" icon="el-icon-refresh" v-permission="'system_permission_refresh'" @click="handlerRefresh">{{$t('table.refresh')}}</el-button>
        <el-button type="primary" class="filter-item" icon="el-icon-circle-plus" style="margin-left: 10px;" v-permission="'system_permission_add'" @click="handlerAdd">{{$t('table.add')}}</el-button>
        <el-button type="success" class="filter-item" icon="el-icon-edit" style="margin-left: 10px;" v-permission="'system_permission_edit'" @click="handlerUpdate">{{$t('table.edit')}}</el-button>
        <el-button type="danger" class="filter-item" icon="el-icon-delete" style="margin-left: 10px;" v-permission="'system_permission_delete'" @click="handleDelete">{{$t('table.delete')}}</el-button>
      </el-button-group>
    </div>
    <el-row>
      <el-col :span="8" style='margin-top:15px;'>
        <el-tree ref="permissionTree"
          class="filter-tree"
          node-key="id"
          highlight-current
          lazy
          :load="loadChild"
          :default-expanded-keys="defaultExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @node-click="getNodeData">
        </el-tree>
      </el-col>
      <el-col :span="16" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form" :rules="formRules">
            <el-form-item v-if="formStatus === 'update'">
              <el-button @click="onCancel" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
              <el-button type="primary" @click="update" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus === 'create'">
              <el-button @click="onCancel" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
              <el-button type="primary" @click="create" icon="el-icon-circle-check">{{$t('table.create')}}</el-button>
            </el-form-item>

            <el-row>
              <el-col :span="12">
                <el-form-item label="父级节点" prop="pName">
                  <el-input v-model="parent.name" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属应用" prop="appName">
                  <el-select class="filter-item" v-model="form.appName"  :disabled="this.formUpdate?this.formUpdate:this.parent.level !== 0"  placeholder="请选择权限所属的应用，不能为空" value="">
                    <el-option v-for="item in appOptions" :key="item" :label="item" :value="item"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="权限名称" prop="name">
                  <el-input v-model="form.name" :disabled="formUpdate"  placeholder="请输入权限名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="权限标识" prop="code">
                  <el-input v-model="form.code" :disabled="formUpdate" placeholder="请输入权限标识,必须唯一"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="资源路径" prop="url">
              <el-input v-model="form.url" :disabled="formUpdate" placeholder="请输入资源路径"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="16">
                <el-form-item label="匹配路径" prop="path" placeholder="设置权限对应的HTTP请求路径表达式">
                  <el-input v-model="form.path" :disabled="formUpdate"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="请求方法" prop="method">
                  <el-select class="filter-item" v-model="form.method" :disabled="formUpdate" placeholder="请选择请求的方法" value="">
                    <el-option v-for="item in methodOptions" :key="item.value" :label="item.value" :value="item.value"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="类型" prop="type">
                  <el-select class="filter-item" v-model="form.type"  :disabled="formUpdate"  placeholder="请选择类型" value="">
                    <el-option v-for="item in typeOptions" :key="item.name" :label="item.value" :value="item.name" :disabled="item.status === 1"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="图标" prop="icon">
                  <el-input v-model="form.icon" :disabled="formUpdate" placeholder="请选择图标，只对菜单类型有效"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="排序" prop="sort">
                  <el-input v-model="form.sort" :disabled="formUpdate" placeholder="请输入排序"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="status">
              <el-switch :disabled="formUpdate"
                v-model="form.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
                active-value=0
                inactive-value=1>
              </el-switch>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { listChildPermissions, getPermission, postPermission, deletePermission, putPermission } from '@/api/permission'
  import { loadServiceNames } from '@/api/application'
  export default {
    name: 'system_permission',
    data() {
      return {
        parent: {},
        list: null,
        total: null,
        formUpdate: true,
        appNameUpdate: true,
        formAdd: true,
        formStatus: '',
        showElement: false,
        typeOptions: [],
        methodOptions: [],
        appOptions: [],
        listQuery: {
          name: undefined
        },
        treeData: [],
        defaultExpandedKeys: [1],
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf'
        },
        labelPosition: 'right',
        form: {},
        currentId: -1,
        formRules: {
          url: [
            { pattern: /^[A-Za-z0-9/:.@?=& \\-]+$/, message: '资源路径只支持大小写字母 数字 & / : . @ - ? =' }
          ],
          path: [
            { pattern: /^[A-Za-z0-9/?*. \\-]+$/, message: '匹配路径只支持大小写字母 数字 / . * - ?' }
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
            }
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
            { pattern: /^[A-Za-z0-9_]+$/, message: '编码只支持大小写字母 数字 _' }
          ]
        }
      }
    },
    created() {
      this.asyncLoadDictionaryByCode(13, (data) => {
        this.typeOptions = data
      })
      this.asyncLoadDictionaryByCode(12, (data) => {
        this.methodOptions = data
      })
      loadServiceNames().then(response => {
        this.appOptions = response.data
      }).catch(reason => {
        this.$notify({
          title: '加载应用服务列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
      this.resetForm()
    },
    methods: {
      loadChild(node, resolve) {
        let pId = 0
        if (node.level !== 0) {
          pId = node.data.id
        }
        listChildPermissions(pId).then(response => {
          if (pId === 0) {
            this.defaultExpandedKeys[0] = response.data[0].id
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
        const pNode = this.$refs.permissionTree.getNode(data.pId)
        if (pNode) {
          this.parent = pNode.data
        } else {
          this.parent = data
          this.formStatus = ''
          this.formUpdate = true
        }
      },
      handlerUpdate() {
        const pNode = this.$refs.permissionTree.getNode(this.form.pId)
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
      handlerRefresh() {
        this.$message({
          message: '该功能还未实现，敬请期待!'
        })
      },
      handlerAdd() {
        if (!this.form.id) {
          this.$message({
            message: '请选择一个父节点再新增子节点'
          })
          return
        }
        if (this.form.type === 0) {
          this.$message({
            message: '按钮下不能再新增子节点'
          })
          return
        }
        this.parent = this.form
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
        putPermission(this.form).then(response => {
          const cNode = this.$refs.permissionTree.getNode(this.form.id)
          if (cNode) {
            cNode.data = response.data
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
        postPermission(this.form).then(response => {
          const pNode = this.$refs.permissionTree.getNode(this.form.pId)
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
      appNameDisabled() {
        return this.formUpdate || this.parent.level === 0
      },
      resetForm() {
        let code = this.parent.code || ''
        code = code.substr(-1) === '_' ? code : code + '_'
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
        this.form = {
          code: code,
          name: undefined,
          id: undefined,
          pId: this.currentId,
          url: '',
          sort: sort,
          type: type,
          status: '0',
          icon: '',
          level: this.parent.level ? this.parent.level + 1 : 0,
          method: 'POST',
          appName: this.parent.appName
        }
      }
    }
  }
</script>

