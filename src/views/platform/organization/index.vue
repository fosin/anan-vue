<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button v-waves v-permission="'86'" round type="primary" class="filter-item" icon="el-icon-refresh" @click="handlerRefresh">{{ $t('table.refresh') }}</el-button>
        <el-button v-waves v-permission="'4'" round type="primary" class="filter-item" icon="el-icon-circle-plus" style="margin-left: 5px;" @click="handlerAdd">{{ $t('table.add') }}</el-button>
        <el-button v-waves v-permission="'5'" round type="success" class="filter-item" icon="el-icon-edit" style="margin-left: 5px;" @click="handlerUpdate">{{ $t('table.edit') }}</el-button>
        <el-button v-waves v-permission="'6'" round type="danger" class="filter-item" icon="el-icon-delete" style="margin-left: 5px;" @click="handleDelete">{{ $t('table.delete') }}</el-button>
      </el-button-group>
    </div>
    <el-row>
      <el-col :span="8" style="margin-top:15px;">
        <el-tree
          v-if="hackReset"
          ref="organizTree"
          :load="loadChild"
          :default-expanded-keys="defaultExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          class="filter-tree"
          node-key="id"
          highlight-current
          lazy
          @node-click="getNodeData"/>
      </el-col>
      <el-col :span="16" style="margin-top:15px;">
        <el-card class="box-card">
          <el-form ref="form" :label-position="labelPosition" :rules="rules" :model="form" label-width="120px">
            <el-form-item v-if="formStatus === 'update'">
              <el-button v-waves round icon="el-icon-circle-close" @click="onCancel">{{ $t('table.cancel') }}</el-button>
              <el-button v-waves round type="primary" icon="el-icon-circle-check" @click="update">{{ $t('table.update') }}</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus === 'create'">
              <el-button v-waves round icon="el-icon-circle-close" @click="onCancel">{{ $t('table.cancel') }}</el-button>
              <el-button v-waves round type="primary" icon="el-icon-circle-check" @click="create">{{ $t('table.create') }}</el-button>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('anan_organization.topId.label')" prop="topId">
                  <el-tag>{{ getOrganizName(form.topId) }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('anan_organization.pid.label')" prop="pid">
                  <el-tag>{{ parent.code + ' - ' + parent.name }}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('anan_organization.code.label')" prop="code">
              <el-input v-model="form.code" :disabled="formUpdate" :placeholder="$t('anan_organization.code.placeholder')"/>
            </el-form-item>
            <el-form-item :label="$t('anan_organization.name.label')" prop="name">
              <el-input v-model="form.name" :disabled="formUpdate" :placeholder="$t('anan_organization.name.placeholder')"/>
            </el-form-item>
            <el-form-item :label="$t('anan_organization.fullname.label')" prop="fullname">
              <el-input v-model="form.fullname" :disabled="formUpdate" :placeholder="$t('anan_organization.fullname.placeholder')"/>
            </el-form-item>
            <el-form-item :label="$t('anan_organization.address.label')" prop="address">
              <el-input v-model="form.address" :disabled="formUpdate" :placeholder="$t('anan_organization.address.placeholder')"/>
            </el-form-item>
            <el-form-item :label="$t('anan_organization.telphone.label')" prop="telphone">
              <el-input v-model="form.telphone" :disabled="formUpdate" :placeholder="$t('anan_organization.telphone.placeholder')"/>
            </el-form-item>
            <el-form-item :label="$t('anan_organization.status.label')" prop="status">
              <el-switch
                :disabled="formUpdate"
                v-model="form.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"/>
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
  name: 'SystemOrganiz',
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
      hackReset: true,
      formStatus: '',
      listQuery: {
        name: undefined
      },
      topId: -1,
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
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.resetForm()
  },
  methods: {
    loadChild(node, resolve) {
      if (node.level === 0) {
        const organizId = this.userInfo.organizId
        if (organizId === 0) {
          listOrganizChild(organizId).then(response => {
            this.defaultExpandedKeys[0] = response.data[0].id
            return resolve(response.data || [])
          }).catch(reason => {
            this.$notify({
              title: '加载子节点失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        } else {
          getOrganiz(organizId).then((response2) => {
            const organizs = []
            organizs.push(response2.data)
            this.defaultExpandedKeys[0] = organizId
            return resolve(organizs || [])
          }).catch(reason => {
            this.$notify({
              title: '加载子节点失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        }
      } else {
        listOrganizChild(node.data.id).then(response => {
          return resolve(response.data || [])
        }).catch(reason => {
          this.$notify({
            title: '加载子节点失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }
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
    handlerRefresh() {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
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

