<template>

  <data-table
    ref="pagingTable"
    :options="options"
    :list-query="listQuery"
  >
    <template slot="data-columns">
      <el-table-column
        label="题库名称"
      >
        <template slot-scope="data">
          <router-link :to="{ name: 'ExamManagementRepoUpdate', params:{id: data.row.id}}">
            {{ data.row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="题库编号"
        prop="code"
        align="center"
      />
      <el-table-column
        label="单选题数量"
        prop="radioCount"
        align="center"
      />
      <el-table-column
        label="多选题数量"
        prop="multiCount"
        align="center"
      />
      <el-table-column
        label="判断题数量"
        prop="judgeCount"
        align="center"
      />
      <el-table-column
        label="简答题数量"
        prop="saqCount"
        align="center"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
      />
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/views/exam/components/DataTable'

export default {
  name: 'ExamManagementRepo',
  components: { DataTable },
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        params: {
          title: ''
        },
        search: {
          column: 'title',
          input: '',
          placeholder: '搜索题库名称'
        }
      },
      options: {
        // 可批量操作
        multi: true,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: this.$t('table.delete')
          }
        ],
        // 列表请求URL
        listUrl: 'gateway/exam/api/repo/paging',
        // 删除请求URL
        deleteUrl: 'gateway/exam/api/repo/delete',
        // 启用禁用
        stateUrl: '/qu/repo/state',
        // 添加数据路由
        addRoute: 'ExamManagementRepoAdd'
      }
    }
  },
  methods: {

  }
}
</script>
