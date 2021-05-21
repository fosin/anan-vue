<template>
  <div>
    <data-table
      ref="paperRateCount"
      :options="options"
      :list-query="listQuery"
    >
      <template slot="filter-content">
        <el-date-picker
          v-model="listQuery.params.beginCreateTime"
          style="width: 150px;margin-left: 5px;"
          class="filter-item"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="考试开始时间"
        />
        <el-date-picker
          v-model="listQuery.params.endCreateTime"
          style="width: 150px;margin-left: 5px;"
          class="filter-item"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="考试结束时间"
        />
      </template>
      <template slot="data-columns">
        <el-table-column
          label="考试名称"
          prop="title"
          align="center"
          width="250px"
        />
        <el-table-column
          label="考试人数"
          align="center"
          prop="userCount"
          width="170px"
        />
        <el-table-column
          label="通过人数"
          prop="userPassCount"
          align="center"
        />
        <el-table-column
          label="人数通过率"
          prop="userPassRate"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="warning"
              disable-transitions
            >{{ scope.row.userPassRate }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="总人次"
          prop="paperCount"
          align="center"
        />
        <el-table-column
          label="通过人次"
          prop="paperPassCount"
          align="center"
        />
        <el-table-column
          label="人次通过率"
          prop="paperPassRate"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="warning"
              disable-transitions
            >{{ scope.row.paperPassRate }}%
            </el-tag>
          </template>
        </el-table-column>
      </template>
    </data-table>
  </div>
</template>

<script>

import DataTable from '@/views/exam/components/DataTable'

export default {
  name: 'ExamQueryPaperRate',
  components: { DataTable },
  data() {
    return {
      // 试题列表
      listQuery: {
        current: 1,
        size: 10,
        params: {
          title: '',
          beginCreateTime: null,
          endCreateTime: null
          // relaRules:  [{
          //   'propertity': 'beginCreateTime',
          //   'operator': 'greaterThanOrEqualTo'
          // },
          // {
          //   'propertity': 'endCreateTime',
          //   'operator': 'lessThanOrEqualTo'
          // }]
        },
        sort: {
          sortOrder: 'ASC',
          sortName: 'title'
        },
        search: {
          column: 'title',
          input: '',
          placeholder: '搜索考试名称'
        }
      },
      options: {
        // 可批量操作
        multi: false,
        // 列表请求URL
        listUrl: 'gateway/exam/api/paper/paper/rateCount'
      },
      openTypes: []
    }
  },
  methods: {
  }
}
</script>
