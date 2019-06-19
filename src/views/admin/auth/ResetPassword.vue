<template>
  <div>
    <!-- begin breadcrumb -->
    <ol class="breadcrumb pull-right">
      <li class="breadcrumb-item active">
        <a href="javascript:;">权限管理</a>
      </li>
    </ol>
    <!-- end breadcrumb -->
    <!-- begin page-header -->
    <h1 class="page-header">
      重置用户密码
      <small></small>
    </h1>
    <!-- end page-header -->
    <panel title="维护">
      <template slot="beforeBody">
        <div class="panel-toolbar">
          <div class="form-inline">
            <div class="input-group m-r-10">
              <input type="text" placeholder="搜索用户名、姓名、电话" v-model="search_text" class="form-control">
              <div class="input-group-append">
                <button type="button" class="btn btn-info" @click="getUserData()">
                  <i class="fa fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- begin table -->
      <div class="table-responsive">
        <table class="table table-profile">
          <thead>
            <tr>
              <th></th>
              <th>
                <h4>{{user.user_username}}</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="highlight">
              <td class="field">姓名</td>
              <td>
                <a href="javascript:;">{{user.user_name}}</a>
              </td>
            </tr>
            <tr class="divider">
              <td colspan="2"></td>
            </tr>
            <tr>
              <td class="field">手机</td>
              <td>
                <i class="fa fa-mobile fa-lg m-r-5"></i>
                {{user.user_phone}}
              </td>
            </tr>
            <tr class="divider">
              <td colspan="2"></td>
            </tr>
            <tr class="highlight">
              <td class="field">Email</td>
              <td>{{user.user_email}}</td>
            </tr>
            <tr class="divider">
              <td colspan="2"></td>
            </tr>
            <tr>
              <td class="field">省</td>
              <td>{{user.user_province}}</td>
            </tr>
            <tr>
              <td class="field">市/县</td>
              <td>{{user.user_city}}</td>
            </tr>
            <tr>
              <td class="field">区</td>
              <td>{{user.user_district}}</td>
            </tr>
            <tr>
              <td class="field">地址</td>
              <td>{{user.user_address}}</td>
            </tr>
            <tr>
              <td class="field">备注</td>
              <td>{{user.user_remark}}</td>
            </tr>
            <tr class="divider">
              <td colspan="2"></td>
            </tr>
            <tr class="highlight">
              <td class="field">&nbsp;</td>
              <td class="p-t-10 p-b-10">
                <button type="submit" class="btn btn-primary width-150" @click="resetPassword()">重置密码</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- end table -->
    </panel>
  </div>
</template>
<script>
const apiUrl = '/v1/api/admin/auth/ResetPassword/'

export default {
  name: 'ResetPassword',
  data() {
    return {
      search_text: '',
      user: {}
    }
  },
  mounted: function() {},
  methods: {
    getUserData: async function() {
      try {
        let response = await this.$http.post(apiUrl + 'search', {
          search_text: this.search_text
        })
        this.user = JSON.parse(JSON.stringify(response.data.info))
      } catch (error) {
        this.$commonact.fault(error)
      }
    },
    resetPassword: async function() {
      this.$commonact.confirm('重置该用户密码?', async () => {
        try {
          await this.$http.post(apiUrl + 'reset', {
            user_id: this.user.user_id,
            version: this.user.version,
            updated_at: this.user.updated_at
          })
          this.user = {}
          this.$Message.success('修改密码成功')
        } catch (error) {
          this.$commonact.fault(error)
        }
      })
    }
  }
}
</script>