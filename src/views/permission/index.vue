
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" v-if="permission_btn_post" icon="plus" @click="handlerAdd">添加</el-button>
        <el-button type="primary" v-if="permission_btn_put" icon="Update" @click="handlerUpdate">编辑</el-button>
        <el-button type="primary" v-if="permission_btn_delete" icon="delete" @click="handleDelete">删除</el-button>
      </el-button-group>
    </div>
    <!--:data="treeData"-->
    <el-row>
      <el-col :span="8" style='margin-top:15px;'>
        <el-tree ref="permissionTree"
          class="filter-tree"
          node-key="id"
          highlight-current
          lazy
          :load="loadChild"
          :default-expanded-keys="aExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @node-click="getNodeData"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
        </el-tree>
      </el-col>
      <el-col :span="16" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
            <el-form-item v-if="formStatus === 'update'">
              <el-button type="primary" @click="update">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus === 'create'">
              <el-button type="primary" @click="create">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item label="父级节点" prop="pName">
              <el-input v-model="parent.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="父级节点" prop="pId" hidden="hidden">
              <el-input v-model="form.pId" :disabled="true" placeholder="请输入父级节点"></el-input>
            </el-form-item>
            <el-form-item label="节点ID" prop="id" hidden="hidden">
              <el-input v-model="form.id" :disabled="true" placeholder="节点ID自动生成,无需输入"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="name">
              <el-input v-model="form.name" :disabled="formUpdate"  placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="code">
              <el-input v-model="form.code" :disabled="formUpdate" placeholder="请输入权限标识"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" :disabled="formUpdate" placeholder="请输入图标"></el-input>
            </el-form-item>
            <el-form-item label="资源路径" prop="url">
              <el-input v-model="form.url" :disabled="formUpdate" placeholder="请输入资源路径"></el-input>
            </el-form-item>
            <el-form-item label="请求方法" prop="method">
              <el-select class="filter-item" v-model="form.method"  :disabled="formUpdate"  placeholder="请输入资源请求类型">
                <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select class="filter-item" v-model="form.type"  :disabled="formUpdate"  placeholder="请选择类型">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="form.sort" :disabled="formUpdate" placeholder="请输入排序"></el-input>
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
           <!--
            <el-form-item label="层级" prop="level">
              <el-input v-model="form.level" :disabled="true" placeholder="自动生成，无需手动填入"></el-input>
            </el-form-item>
            <el-form-item label="前端组件"   prop="component">
              <el-input v-model="form.component" :disabled="formUpdate" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="前端地址"   prop="component">
              <el-input v-model="form.path" :disabled="formUpdate" placeholder="iframe嵌套地址"></el-input>
            </el-form-item>-->
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchChild, getObj, postObj, deleteObj, putObj } from '@/api/permission'
  import { mapGetters } from 'vuex'
  export default {
    name: 'permission',
    data() {
      return {
        parent: {},
        list: null,
        total: null,
        formUpdate: true,
        formAdd: true,
        formStatus: '',
        showElement: false,
        typeOptions: [{
          value: 0,
          label: '按钮'
        }, {
          value: 1,
          label: '菜单'
        }],
        methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
        listQuery: {
          name: undefined
        },
        treeData: [],
        oExpandedKey: {
          // key (from tree id) : expandedOrNot boolean
        },
        oTreeNodeChildren: {
          // id1 : [children] (from tree node id1)
          // id2 : [children] (from tree node id2)
        },
        aExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf'
        },
        labelPosition: 'right',
        form: {},
        currentId: -1,
        permission_btn_post: false,
        permission_btn_put: false,
        permission_btn_delete: false
      }
    },
    created() {
      this.resetForm()
      this.permission_btn_post = this.permissions['platform/permission/post']
      this.permission_btn_put = this.permissions['platform/permission/put']
      this.permission_btn_delete = this.permissions['platform/permission/delete']
    },
    computed: {
      ...mapGetters([
        // 'elements',
        'permissions'
      ])
    },
    methods: {
      loadChild(node, resolve) {
        let pId = 0
        if (node.level !== 0) {
          pId = node.data.id
        }
        fetchChild(pId).then(response => {
          return resolve(response.data.data.children || [])
        })
      },
      filterNode(value, data) {
        // console.log(value);
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },

      nodeExpand(data) {
        const aChildren = data.children
        if (aChildren && aChildren.length > 0) {
          this.oExpandedKey[data.id] = true
          this.oTreeNodeChildren[data.id] = aChildren
        }
        this.setExpandedKeys()
      },
      nodeCollapse(data) {
        this.oExpandedKey[data.id] = false
        // 如果有子节点
        this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
          this.oExpandedKey[oNode.id] = false
        })
        this.setExpandedKeys()
      },
      setExpandedKeys() {
        const oTemp = this.oExpandedKey
        this.aExpandedKeys = []
        for (const sKey in oTemp) {
          if (oTemp[sKey]) {
            this.aExpandedKeys.push(parseInt(sKey))
          }
        }
      },
      treeRecursion(aChildren, fnCallback) {
        if (aChildren) {
          for (let i = 0; i < aChildren.length; ++i) {
            const oNode = aChildren[i]
            fnCallback && fnCallback(oNode)
            this.treeRecursion(oNode.children, fnCallback)
          }
        }
      },

      getNodeData(data) {
        if (data.id === this.currentId) {
          return
        }

        if (!this.formUpdate) {
          this.formStatus = 'update'
        }
        getObj(data.id).then(response => {
          this.form = response.data.data
          this.form.status = this.form.status + ''
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
          this.$notify({
            title: '失败',
            message: '根节点不能修改',
            type: 'warning',
            duration: 2000
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
          this.$notify({
            title: '失败',
            message: '请选择一个父节点再新增子节点',
            type: 'warning',
            duration: 2000
          })
          return
        }
        if (this.form.type === 0) {
          this.$notify({
            title: '失败',
            message: '按钮下不能再新增子节点',
            type: 'warning',
            duration: 2000
          })
          return
        }
        this.parent = this.form
        const cNode = this.$refs.permissionTree.getNode(this.form.id)
        this.resetForm()
        this.form.level = cNode.data.level + 1
        this.formUpdate = false
        this.formStatus = 'create'
      },
      handleDelete() {
        const cNode = this.$refs.permissionTree.getNode(this.form.id)
        if (cNode && cNode.childNodes && cNode.childNodes.length > 0) {
          this.$notify({
            title: '失败',
            message: '该节点还存在子节点不能直接删除',
            type: 'warning',
            duration: 2000
          })
          return
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteObj(this.currentId).then(() => {
            this.$refs.permissionTree.remove(this.currentId)
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      update() {
        putObj(this.form).then(response => {
          const cNode = this.$refs.permissionTree.getNode(this.form.id)
          if (cNode) {
            cNode.data = response.data.data
          }
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      create() {
        postObj(this.form).then(response => {
          // this.$refs.permissionTree.append(response.data.data, this.form.pId)
          // debugger
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      onCancel() {
        this.formUpdate = true
        this.formStatus = ''
      },
      resetForm() {
        this.form = {
          code: undefined,
          name: undefined,
          id: undefined,
          pId: this.currentId,
          url: undefined,
          icon: undefined,
          sort: undefined,
          type: undefined,
          method: undefined,
          status: '0',
          level: undefined
        }
      }
    }
  }
</script>

