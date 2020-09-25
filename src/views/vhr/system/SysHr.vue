<template>
  <div v-loading="fullloading" style="margin-top: 10px">
    <div style="margin-bottom: 10px;display: flex;justify-content: center;align-items: center">
      <el-input
        v-model="keywords"
        placeholder="默认展示部分用户，可以通过用户名搜索更多用户..."
        prefix-icon="el-icon-search"
        size="small"
        style="width: 400px;margin-right: 10px"
      />
      <el-button size="small" type="primary" icon="el-icon-search" @click="searchClick">
        搜索
      </el-button>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
      <el-card
        v-for="(item,index) in hrs"
        :key="item.id"
        v-loading="cardLoading[index]"
        style="width: 350px;margin-bottom: 20px"
      >
        <div slot="header" class="clearfix">
          <span>{{ item.name }}</span>
          <el-button
            type="text"
            style="color: #f6061b;margin: 0;float: right; padding: 3px 0;width: 15px;height:15px"
            icon="el-icon-delete"
            @click="deleteHr(item.id)"
          />
        </div>
        <div>
          <div style="width: 100%;display: flex;justify-content: center">
            <img :src="item.userface" alt="item.name" style="width: 70px;height: 70px;border-radius: 70px">
          </div>
          <div style="margin-top: 20px">
            <div><span class="user-info">用户名:{{ item.name }}</span></div>
            <div><span class="user-info">手机号码:{{ item.phone }}</span></div>
            <div><span class="user-info">电话号码:{{ item.telephone }}</span></div>
            <div><span class="user-info">地址:{{ item.address }}</span></div>
            <div class="user-info" style="display: flex;align-items: center;margin-bottom: 3px">
              用户状态:
              <el-switch
                :key="item.id"
                v-model="item.enabled"
                style="display: inline;margin-left: 5px"
                active-color="#13ce66"
                inactive-color="#aaaaaa"
                active-text="启用"
                inactive-text="禁用"
                @change="switchChange(item.enabled,item.id,index)"
              />
            </div>
            <div class="user-info">
              用户角色:
              <el-tag
                v-for="role in item.roles"
                :key="role.id"
                type="success"
                size="mini"
                style="margin-right: 5px"
                :disable-transitions="false"
              >
                {{ role.nameZh }}
              </el-tag>
              <el-popover
                :key="item.id"
                v-loading="eploading[index]"
                placement="right"
                title="角色列表"
                width="200"
                trigger="click"
                @hide="updateHrRoles(item.id,index)"
              >
                <el-select v-model="selRoles" multiple placeholder="请选择角色">
                  <el-option
                    v-for="ar in allRoles"
                    :key="ar.id"
                    :label="ar.nameZh"
                    :value="ar.id"
                  />
                </el-select>
                <el-button
                  slot="reference"
                  type="text"
                  icon="el-icon-more"
                  style="color: #09c0f6;padding-top: 0"
                  :disabled="moreBtnState"
                  @click="loadSelRoles(item.roles,index)"
                />
                <!--                <i class="el-icon-more" style="color: #09c0f6;cursor: pointer" slot="reference"
                   @click="loadSelRoles(item.roles,index)" disabled="true"></i>-->
              </el-popover>
            </div>
            <div><span class="user-info">备注:{{ item.remark }}</span></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keywords: '',
      fullloading: false,
      hrs: [],
      cardLoading: [],
      eploading: [],
      allRoles: [],
      moreBtnState: false,
      selRoles: [],
      selRolesBak: []
    }
  },
  mounted: function() {
    this.initCards()
    this.loadAllRoles()
  },
  methods: {
    searchClick() {
      this.initCards()
      this.loadAllRoles()
    },
    updateHrRoles(hrId, index) {
      this.moreBtnState = false

      if (this.selRolesBak.length === this.selRoles.length) {
        for (let i = 0; i < this.selRoles.length; i++) {
          for (let j = 0; j < this.selRolesBak.length; j++) {
            if (this.selRoles[i] === this.selRolesBak[j]) {
              this.selRolesBak.splice(j, 1)
              break
            }
          }
        }
        if (this.selRolesBak.length === 0) {
          return
        }
      }
      this.eploading.splice(index, 1, true)
      this.putRequest('gateway/vhr/system/hr/roles', {
        hrId: hrId,
        rids: this.selRoles
      }).then(resp => {
        this.eploading.splice(index, 1, false)
        if (resp && resp.status === 200) {
          const data = resp.data

          if (data.status === 200) {
            this.refreshHr(hrId, index)
          }
        }
      })
    },
    refreshHr(hrId, index) {
      this.cardLoading.splice(index, 1, true)
      this.putRequest('gateway/vhr/system/hr/id/' + hrId).then(resp => {
        this.cardLoading.splice(index, 1, false)
        this.hrs.splice(index, 1, resp.data)
      })
    },
    loadSelRoles(hrRoles, index) {
      this.moreBtnState = true
      this.selRoles = []
      this.selRolesBak = []
      hrRoles.forEach(role => {
        this.selRoles.push(role.id)
        this.selRolesBak.push(role.id)
      })
    },
    loadAllRoles() {
      this.getRequest('gateway/vhr/system/hr/roles').then(resp => {
        this.fullloading = false
        if (resp && resp.status === 200) {
          this.allRoles = resp.data
        }
      })
    },
    switchChange(newValue, hrId, index) {
      this.cardLoading.splice(index, 1, true)
      this.putRequest('gateway/vhr/system/hr/', {
        enabled: newValue,
        id: hrId
      }).then(resp => {
        this.cardLoading.splice(index, 1, false)
        if (resp && resp.status === 200) {
          const data = resp.data

          if (data.status === 'error') {
            this.refreshHr(hrId, index)
          }
        } else {
          this.refreshHr(hrId, index)
        }
      })
    },
    initCards() {
      this.fullloading = true

      let searchWords
      if (this.keywords === '') {
        searchWords = 'all'
      } else {
        searchWords = this.keywords
      }
      this.getRequest('gateway/vhr/system/hr/' + searchWords).then(resp => {
        if (resp && resp.status === 200) {
          this.hrs = resp.data
          const length = resp.data.length
          this.cardLoading = Array.apply(null, Array(length)).map(function(item, i) {
            return false
          })
          this.eploading = Array.apply(null, Array(length)).map(function(item, i) {
            return false
          })
        }
      })
    },
    deleteHr(hrId) {
      this.fullloading = true
      this.deleteRequest('gateway/vhr/system/hr/' + hrId).then(resp => {
        this.fullloading = false
        if (resp && resp.status === 200) {
          const data = resp.data

          if (data.status === 'success') {
            this.initCards()
            this.loadAllRoles()
          }
        }
      })
    }
  }
}
</script>
<style>
  .user-info {
    font-size: 12px;
    color: #09c0f6;
  }
</style>
