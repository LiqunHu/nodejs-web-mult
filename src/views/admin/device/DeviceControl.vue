<template>
  <div>
    <!-- begin breadcrumb -->
    <ol class="breadcrumb pull-right">
      <li class="breadcrumb-item active">
        <a href="javascript:;">设备</a>
      </li>
    </ol>
    <!-- end breadcrumb -->
    <!-- begin page-header -->
    <h1 class="page-header">
      设备管理
      <small></small>
    </h1>
    <!-- end page-header -->
    <panel title="Panel title here">
      <template slot="beforeBody">
        <div class="panel-toolbar">
          <div class="form-inline">
            <div class="input-group m-r-10">
              <input type="text" placeholder="搜索mac、设备id" v-model="table.dataTable.search_text" class="form-control">
              <div class="input-group-append">
                <button type="button" class="btn btn-info" @click="getTableData(1)">
                  <i class="fa fa-search"></i>
                </button>
              </div>
            </div>
            <div class="form-group m-r-10">
              <button type="button" class="btn btn-info" @click="addDataModal">增加设备</button>
            </div>
          </div>
        </div>
      </template>
      <Table stripe ref="dataTable" :columns="table.dataTable.rows" :data="table.dataTable.data">
        <template slot-scope="{ row, index }" slot="vessel_id">
          <Select v-model="row.vessel_id" disabled>
            <Option v-for="item in pagePara.VesselINFO" :value="item.id" :key="item.id">{{ item.text }}</Option>
          </Select>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <a href="#" class="btn btn-info btn-icon btn-sm" @click="modifyDataModal(row)">
            <i class="fa fa-edit"></i>
          </a>
          <a href="#" class="btn btn-danger btn-icon btn-sm" @click="deleteData(row)">
            <i class="fa fa-times"></i>
          </a>
        </template>
      </Table>
      <Page class="m-t-10" :total="table.dataTable.total" :page-size="table.dataTable.limit" @on-change="getTableData"/>
    </panel>
    <Modal v-model="modal.dataModal" title="设备">
      <Form :model="workPara" :label-width="120" :rules="formRule.ruleDataModal" ref="formData">
        <FormItem label="设备名称" prop="device_name">
          <Input placeholder="设备名称" v-model="workPara.device_name"/>
        </FormItem>
        <FormItem label="设备mac地址" prop="device_mac">
          <Input placeholder="设备mac地址" v-model="workPara.device_mac" :disabled="action === 'modify'"/>
        </FormItem>
        <FormItem label="设备mac地址2" prop="device_mac2">
          <Input placeholder="设备mac地址2" v-model="workPara.device_mac2" :disabled="action === 'modify'"/>
        </FormItem>
        <FormItem label="设备固件版本" prop="device_hardware_version">
          <Input placeholder="设备固件版本" v-model="workPara.device_hardware_version"/>
        </FormItem>
        <FormItem label="设备软件版本" prop="device_software_version">
          <Input placeholder="设备软件版本" v-model="workPara.device_software_version"/>
        </FormItem>
        <FormItem label="设备类型" prop="device_type">
          <Select v-model="workPara.device_type">
            <Option v-for="item in pagePara.DEVICE_TYPE_INFO" :value="item.id" :key="item.id">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="设备状态" prop="device_state" v-show="action === 'modify'">
          <Select v-model="workPara.device_state">
            <Option v-for="item in pagePara.DEVICE_STATE_INFO" :value="item.id" :key="item.id">{{ item.text }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modal.dataModal=false">取消</Button>
        <Button type="primary" size="large" @click="submitData">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
const common = require('@/lib/common')
const apiUrl = '/v1/api/admin/device/DeviceControl/'

export default {
  name: 'DeviceControl',
  data: function() {
    return {
      modal: { dataModal: false },
      table: {
        dataTable: {
          rows: [
            {
              type: '序号',
              align: 'center',
              width: 60
            },
            {
              title: '设备编号',
              key: 'device_id'
            },
            {
              title: '设备名称',
              key: 'device_name'
            },
            {
              title: 'mac 地址',
              key: 'device_mac'
            },
            {
              title: 'mac 地址2',
              key: 'device_mac2'
            },
            {
              title: '硬件版本',
              key: 'device_hardware_version'
            },
            {
              title: '软件版本',
              key: 'device_software_version'
            },
            {
              title: '设备类型',
              key: 'device_type',
              render: common.selectRender(this, 'DEVICE_TYPE_INFO')
            },
            {
              title: '设备状态',
              key: 'device_state',
              render: common.selectRender(this, 'DEVICE_STATE_INFO')
            },
            {
              title: '私钥',
              key: 'device_private_key',
              render: common.tooltipRender()
            },
            {
              title: '公钥',
              key: 'device_public_key',
              render: common.tooltipRender()
            },
            {
              title: '末次ip',
              key: 'device_last_ip'
            },
            {
              title: '登陆时间',
              key: 'device_access_time'
            },
            {
              title: 'Action',
              slot: 'action'
            }
          ],
          data: [],
          limit: 10,
          offset: 0,
          total: 0,
          search_text: ''
        }
      },
      formRule: {
        ruleDataModal: {
          device_name: [{ required: true, trigger: 'change', message: '输入设备名称' }],
          device_mac: [{ required: true, trigger: 'change', message: '输入设备mac' }]
        }
      },
      pagePara: {},
      oldPara: {},
      workPara: {},
      action: ''
    }
  },
  mounted: function() {
    const initPage = async () => {
      try {
        let response = await this.$http.post(apiUrl + 'init', {})
        this.pagePara = JSON.parse(JSON.stringify(response.data.info))
        this.getTableData(1)
      } catch (error) {
        this.$commonact.fault(error)
      }
    }

    initPage()
  },
  methods: {
    getTableData: async function(index) {
      try {
        if (index) {
          this.table.dataTable.offset = (index - 1) * this.table.dataTable.limit
        }

        let response = await this.$http.post(apiUrl + 'search', {
          search_text: this.table.dataTable.search_text,
          offset: this.table.dataTable.offset,
          limit: this.table.dataTable.limit
        })
        let data = response.data.info
        this.table.dataTable.total = data.total
        this.table.dataTable.data = JSON.parse(JSON.stringify(data.rows))
      } catch (error) {
        this.$commonact.fault(error)
      }
    },
    addDataModal: async function() {
      this.workPara = {}
      this.action = 'add'
      this.$refs.formData.resetFields()
      this.modal.dataModal = true
    },
    modifyDataModal: async function(row) {
      let actrow = JSON.parse(JSON.stringify(row))
      delete actrow._index
      delete actrow._rowKey
      this.oldPara = JSON.parse(JSON.stringify(actrow))
      this.workPara = JSON.parse(JSON.stringify(actrow))
      this.action = 'modify'
      this.$refs.formData.resetFields()
      this.modal.dataModal = true
    },
    submitData: function() {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          try {
            if (this.action === 'add') {
              await this.$http.post(apiUrl + 'add', this.workPara)
              this.$Message.success('增加成功')
            } else if (this.action === 'modify') {
              await this.$http.post(apiUrl + 'modify', { old: this.oldPara, new: this.workPara })
              this.$Message.success('修改成功')
            }
            this.getTableData()
            this.modal.dataModal = false
          } catch (error) {
            this.$commonact.fault(error)
          }
        }
      })
    },
    deleteData: function(row) {
      this.$commonact.confirm('确认删除设备?', async () => {
        try {
          await this.$http.post(apiUrl + 'delete', { voyage_id: row.voyage_id })
          this.$Message.success('删除成功')
          this.getTableData()
        } catch (error) {
          this.$commonact.fault(error)
        }
      })
    }
  }
}
</script>