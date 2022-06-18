<template>
  <div>
    <data-table
      ref="paperRateCount"
      :options="options"
      :list-query="listQuery"
    >
      <template slot="filter-content">
        <el-date-picker
          v-model="listQuery.pageModule.params.beginCreateTime"
          style="width: 150px;margin-left: 5px;"
          class="filter-item"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="考试开始时间"
        />
        <el-date-picker
          v-model="listQuery.pageModule.params.endCreateTime"
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
        />
        <el-table-column
          label="考试人数"
          align="center"
          prop="userCount"
          width="140px"
        />
        <el-table-column
          label="通过人数"
          prop="userPassCount"
          align="center"
          width="140px"
        />
        <el-table-column
          label="人数通过率"
          prop="userPassRate"
          align="center"
          width="140px"
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
          width="140px"
        />
        <el-table-column
          label="通过人次"
          prop="paperPassCount"
          align="center"
          width="140px"
        />
        <el-table-column
          label="人次通过率"
          prop="paperPassRate"
          align="center"
          width="140px"
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

import DataTable from '@/components/DataTable'

export default {
  name: 'ExamQueryPaperRate',
  components: { DataTable },
  data() {
    return {
      // 试题列表
      listQuery: {
        listUrl: 'gateway/exam/api/paper/paper/rateCount',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          input: null,
          cols: ['title'],
          placeholder: '搜索试题名称'
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            title: null,
            beginCreateTime: null,
            endCreateTime: null,
            queryRule: {
              logiOperator: 'and',
              relaRules: [
                {
                  'propertity': 'title',
                  'operator': 'like'
                },
                {
                  'propertity': 'beginCreateTime',
                  'operator': 'ge'
                },
                {
                  'propertity': 'endCreateTime',
                  'operator': 'le'
                }]
            },
            sortRules: [{
              sortName: 'title',
              sortOrder: 'ASC'
            }
            ]
          }
        }
      },
      options: {
        // 可批量操作
        multi: false,
        // 批量操作列表
        multiActions: [],
        addAction: {
          enable: false,
          route: '',
          permissionId: '0'
        },
        tableRowClass: {
          column: 'state',
          data: [
            {
              key: 1,
              value: 'info-row'
            }
          ]
        }
      },
      openTypes: []
    }
  },
  methods: {
  }
}
</script>
