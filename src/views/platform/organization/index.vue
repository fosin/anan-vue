
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button round v-waves type="primary" class="filter-item" icon="el-icon-circle-plus" v-permission="'4'" @click="handlerAdd">{{$t('table.add')}}</el-button>
        <el-button round v-waves type="success" class="filter-item" icon="el-icon-edit" style="margin-left: 5px;" v-permission="'5'" @click="handlerUpdate">{{$t('table.edit')}}</el-button>
        <el-button round v-waves type="danger" class="filter-item" icon="el-icon-delete" style="margin-left: 5px;" v-permission="'6'" @click="handleDelete">{{$t('table.delete')}}</el-button>
      </el-button-group>
    </div>
    <el-row>
      <el-col :span="8" style='margin-top:15px;'>
        <el-tree ref="organizTree"
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
          <el-form :label-position="labelPosition" :rules="rules" label-width="120px" :model="form" ref="form">
            <el-form-item v-if="this.formStatus === 'update'">
              <el-button round @click="onCancel" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
              <el-button round v-waves type="primary" @click="update" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
            </el-form-item>
            <el-form-item v-if="this.formStatus === 'create'">
              <el-button round @click="onCancel" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
              <el-button round v-waves type="primary" @click="create" icon="el-icon-circle-check">{{$t('table.create')}}</el-button>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="顶级机构" prop="topId">
                  <el-tag>{{getOrganizName(form.topId)}}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="父机构信息" prop="pid">
                  <el-tag>{{parent.code + ' - ' + parent.name}}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="机构编码" prop="code">
              <el-input v-model="form.code" :disabled="formUpdate" placeholder="请输入机构编码,机构编码必须以上级节点为前缀"></el-input>
            </el-form-item>
            <el-form-item label="机构简称" prop="name">
              <el-input v-model="form.name" :disabled="formUpdate"  placeholder="请输入机构简称"></el-input>
            </el-form-item>
            <el-form-item label="机构全称" prop="fullname">
              <el-input v-model="form.fullname" :disabled="formUpdate"  placeholder="请输入机构全称"></el-input>
            </el-form-item>
            <el-form-item label="机构地址" prop="address">
              <el-input v-model="form.address" :disabled="formUpdate" placeholder="请输入机构地址"></el-input>
            </el-form-item>
            <el-form-item label="机构电话" prop="phone">
              <el-input v-model="form.phone" :disabled="formUpdate" placeholder="请输入机构电话"></el-input>
            </el-form-item>
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
  import { listOrganizChild, getOrganiz, postOrganiz, deleteOrganiz, putOrganiz } from './organization'
  import { mapGetters } from 'vuex'
  export default {
    name: 'system_organiz',
    computed: {
      ...mapGetters(['userInfo'])
    },
    data() {
      const validateCode = (rule, value, callback) => {
        if (value.substring(0, this.parent.code.length) !== this.parent.code) {
          callback(new Error('机构编码必须以父机构编码为前缀!'))
        }
        if (value === this.parent.code) {
          callback(new Error('机构编码不能和父机构编码相同!'))
        }
        callback()
      }
      return {
        parent: { code: '', name: '' },
        list: null,
        total: null,
        formUpdate: true,
        formStatus: '',
        listQuery: {
          name: undefined
        },
        rules: {
          name: [
            {
              required: true,
              message: '机构名称不能为空',
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
              message: '机构编码不能为空',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 64,
              message: '长度在 1 到 64 个字符',
              trigger: 'blur'
            },
            { validator: validateCode, trigger: 'blur' }
          ],
          topId: [
            {
              required: true,
              message: '顶级机构编码不能为空',
              trigger: 'blur'
            }
          ],
          pid: [
            {
              required: true,
              message: '父机构不能为空',
              trigger: 'blur'
            }
          ]
        },
        treeData: [],
        defaultExpandedKeys: [1],
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf'
        },
        labelPosition: 'right',
        form: {}
      }
    },
    created() {
      // getOrganiz(this.userInfo.organizId).then(response => {
      //   this.topId = response.data.topId
      // }).catch(reason => {
      //   this.$notify({
      //     title: '查询当前用户的机构信息失败',
      //     message: reason.message,
      //     type: 'error',
      //     duration: 5000
      //   })
      // })
      this.resetForm()
    },
    methods: {
      loadChild(node, resolve) {
        let pid = this.userInfo.organizId
        if (node.level !== 0) {
          pid = node.data.id
        }
        listOrganizChild(pid).then(response => {
          if (pid === 0) {
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
        return data.label.indexOf(value) !== -1
      },
      getOrganizData(id) {
        let pNode
        if (this.$refs && this.$refs.organizTree) {
          pNode = this.$refs.organizTree.getNode(id)
        }
        return pNode ? pNode.data : { id: id, name: id }
      },
      getOrganizName(id) {
        return this.getOrganizData(id).name
      },
      getNodeData(data) {
        if (data.id === this.form.id) {
          return
        }

        if (!this.formUpdate) {
          this.formStatus = 'update'
        }
        getOrganiz(data.id).then(response => {
          this.form = response.data
          this.form.status = this.form.status + ''
        }).catch(reason => {
          this.$notify({
            title: '获取机构失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
        const pNode = this.$refs.organizTree.getNode(data.pid)
        if (pNode) {
          this.parent = pNode.data
        } else {
          this.parent = data
          this.formStatus = ''
          this.formUpdate = true
        }
      },
      handlerUpdate() {
        const pNode = this.$refs.organizTree.getNode(this.form.pid)
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
        const cNode = this.$refs.organizTree.getNode(this.form.id)
        if (cNode && cNode.childNodes && cNode.childNodes.length > 0) {
          this.$message({
            message: '该节点还存在子节点不能直接删除!'
          })
          return
        }
        this.$confirm('此操作将永久删除机构[ ' + this.form.name + ' ], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOrganiz(this.form.id).then(() => {
            this.$refs.organizTree.remove(this.form.id)
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
              title: '删除机构失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        }).catch(reason => {
        })
      },
      update() {
        putOrganiz(this.form).then(response => {
          const cNode = this.$refs.organizTree.getNode(this.form.id)
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
            title: '更新机构失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      },
      create() {
        this.$refs.form.validate(valid => {
          if (valid) {
            postOrganiz(this.form).then(response => {
              const pNode = this.$refs.organizTree.getNode(this.form.pid)
              this.$refs.organizTree.append(response.data, pNode)
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
                title: '创建机构失败',
                message: reason.message,
                type: 'error',
                duration: 5000
              })
            })
          } else {
            return false
          }
        })
      },
      onCancel() {
        this.formUpdate = true
        this.formStatus = ''
      },
      resetForm() {
        this.form = {
          address: undefined,
          code: this.parent.code,
          phone: undefined,
          name: this.parent.name,
          fullname: this.parent.fullname,
          id: undefined,
          splitId: undefined,
          pid: this.parent.id,
          topId: this.form.topId,
          status: '0',
          level: (this.parent && this.parent.level ? this.parent.level : 0) + 1
        }
      }
    }
  }
</script>

