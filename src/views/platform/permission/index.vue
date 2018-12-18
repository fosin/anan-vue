<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button round v-waves type="primary" class="filter-item" icon="el-icon-refresh" v-permission="'84'" @click="handlerRefresh">{{$t('table.refresh')}}</el-button>
        <el-button round v-waves type="primary" class="filter-item" icon="el-icon-circle-plus" style="margin-left: 5px;" v-permission="'8'" @click="handlerAdd">{{$t('table.add')}}</el-button>
        <el-button round v-waves type="success" class="filter-item" icon="el-icon-edit" style="margin-left: 5px;" v-permission="'9'" @click="handlerUpdate">{{$t('table.edit')}}</el-button>
        <el-button round v-waves type="danger" class="filter-item" icon="el-icon-delete" style="margin-left: 5px;" v-permission="'10'" @click="handleDelete">{{$t('table.delete')}}</el-button>
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
            <el-form-item v-if="this.formStatus === 'update'">
              <el-button round @click="onCancel" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
              <el-button round v-waves type="primary" @click="update" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
            </el-form-item>
            <el-form-item v-if="this.formStatus === 'create'">
              <el-button round @click="onCancel" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
              <el-button round v-waves type="primary" @click="create" icon="el-icon-circle-check">{{$t('table.create')}}</el-button>
            </el-form-item>

            <el-row>
              <el-col :span="7">
                <el-form-item label="父级节点" prop="pName">
                  <el-tag>{{parent.name}}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="层级" prop="level">
                  <el-tag>{{form.level}}</el-tag>
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

            <el-form-item label="权限路径" prop="path" >
              <el-input v-model="form.path" :disabled="formUpdate" placeholder="设置权限对应的HTTP请求路径，ANT风格表达式，如果要设置权限该选项必填"></el-input>
            </el-form-item>

            <el-row>
              <el-col :span="20">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="请求方法" prop="methodArray">
                      <el-select v-model="form.methodArray" :disabled="formUpdate" placeholder="支持多选，不选则为适配所有方法" multiple>
                        <el-option v-for="item in methodOptions" :key="item.scode" :label="item.value" :value="item.scode" >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="类型" prop="type">
                      <el-select class="filter-item" v-model="form.type" :disabled="formUpdate"  placeholder="请选择类型" >
                        <el-option v-for="item in typeOptions" :key="item.name" :label="item.value" :value="item.name" :disabled="item.status === 1"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="排序" prop="sort">
                      <el-input v-model="form.sort" :disabled="formUpdate" placeholder="请输入排序"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="4">
                <svg-icon @click.native="handleSelectAvatar" :icon-class="form.icon" style="width: 80px; height: 80px; border-radius: 50%; margin-left: 20px; margin-top: 15px; background: #fff; color: #40c9c6;"></svg-icon>
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
    <IconsSelect ref="iconsSelect"> </IconsSelect>
  </div>
</template>

<script>
  import { listChildPermissions, getPermission, postPermission, deletePermission, putPermission } from './permission'
  import { loadServiceNames } from '@/api/application'
  import IconsSelect from '@/components/IconsSelect/index'

  export default {
    name: 'development_permission',
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
    components: {
      IconsSelect
    },
    mounted() {
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
        let pId = 0
        if (node.level !== 0) {
          pId = node.data.id
        }
        listChildPermissions(pId).then(response => {
          if (pId === 0) {
            this.defaultExpandedKeys[0] = response.data[0].id
          }
          const permissions = response.data
          if (permissions && permissions.length > 0) {
            for (let i = 0; i < permissions.length; i++) {
              permissions[i].vname = this.getVname(permissions[i])
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
      getVname(permission) {
        if (!this.typeOptions || this.typeOptions.length < 1) {
          return permission.name + '-' + permission.id
        }
        return permission.name + '    -    ' + this.typeOptions[permission.type].value + '-' + permission.id
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
      handlerUpdate() {
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
      handlerRefresh() {
        this.$message({
          message: '该功能还未实现，敬请期待!'
        })
      },
      handlerAdd() {
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
        putPermission(this.form).then(response => {
          const cNode = this.$refs.permissionTree.getNode(this.form.id)
          if (cNode) {
            response.data.vname = this.getVname(response.data)
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
        this.form.method = this.form.methodArray.join(',')
        postPermission(this.form).then(response => {
          const pNode = this.$refs.permissionTree.getNode(this.form.pid)
          response.data.vname = this.getVname(response.data)
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
        let icon = 'permission'
        switch (type) {
          // 按钮
          case 0:
            icon = 'button'
            break
          // 组件菜单
          case 1:
            icon = 'menu'
            break
          // 直接链接菜单
          case 2:
            icon = 'link'
            break
          // 目录菜单
          case 3:
            icon = 'directory'
            break
          // 间接链接菜单
          case 4:
            icon = 'link'
            break
          // 服务
          case 5:
            icon = 'service'
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
          appName: this.parent.appName
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
