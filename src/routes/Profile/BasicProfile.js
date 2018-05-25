import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Tabs, Button, Calendar, Steps, Icon, Form, Modal, Input, TimePicker, message, Popconfirm, Upload } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BasicProfile.less';
import StandardTable from 'components/StandardTable';
const { Description } = DescriptionList;
import { Link } from 'dva/router';
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Step } = Steps;

const CreateForm1 = Form.create()(props => {
  const { modalVisible1, form, handleAdd, handleModalVisible1 } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="実施記録基本情報"
      visible={modalVisible1}
      onOk={okHandle}
      onCancel={() => handleModalVisible1()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="実施者">
        {form.getFieldDecorator('user', {
          rules: [{ required: true, message: '実施者入力してください' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="開始実施">
        {form.getFieldDecorator('startTime', {
          rules: [{ required: true, message: '请输入' }],
        })(
          <TimePicker
            placeholder='実施時間(Start)'
            style={{ width: '100%' }}
          />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="実施終了">
        {form.getFieldDecorator('endTime', {
          rules: [{ required: true, message: '请输入' }],
        })(
          <TimePicker
            placeholder='実施時間(End)'
            style={{ width: '100%' }}
          />)}
    </FormItem>                         
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="プログラム">
        {form.getFieldDecorator('program', {
          rules: [{ required: true, message: '電話番号入力してください' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
export default class BasicProfile extends Component {

  handleModalVisible1 = flag => {
    this.setState({
      modalVisible1: !!flag,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchBasic',
    });
  }

  state = {
    modalVisible1: false,
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { profile, loading } = this.props;
    const { basicGoods, basicProgress } = profile;
    const { modalVisible1 } = this.state;
    let goodsData = [];
    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
        num,
        amount,
      });
    }
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    function getListData(value) {
      let listData;
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
          ]; break;
        case 10:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
            { type: 'error', content: 'This is error event.' },
          ]; break;
        case 15:
          listData = [
            { type: 'error', content: ' error event 1.' },
            { type: 'error', content: ' error event 2.' },
          ]; break;
        default:
      }
      return listData || [];
    }
    

    
    function getMonthData(value) {
      if (value.month() === 8) {
        return 1394;
      }
    }
    
    function monthCellRender(value) {
      const num = getMonthData(value);
      return num ? (
        <div className="notes-month">
          <section>{num}</section>
          <span>Backlog number</span>
        </div>
      ) : null;
    }

    const parentMethods1 = {
      handleModalVisible1: this.handleModalVisible1,
    };

    const onPrev = () => {
      dispatch(routerRedux.push('/dashboard/workplace'));
    };

    function confirm() {
      message.success('点击了确定');
    }
    
    function cancel() {
    }

    function confirm(data) {
      Modal.confirm({
        iconType: 'bars',
        title: '詳細情報',
        okText: '編集',
        cancelText: '削除',
        maskClosable: 'false',
        content: (
          <div>                
            <Card title="" style={{ marginBottom: 24 }} bordered={false}>
              {
                data.map(item => (
                  <li key={item.content}>
                    <Badge status={item.type} text={item.content}>
                    </Badge>
                  </li>
                ))
              }            
            </Card>  
          </div>
        ),
        onOk() {
        },
        onCancel() {
        },
      });
    }
    
    function dateCellRender(value) {
      const listData = getListData(value);
      return (
        <ul className="events">
          <a onClick={() => confirm(listData)} >
          {
            listData.map(item => (
              <li key={item.content}>
                <Badge status={item.type} text={item.content}>
                </Badge>
              </li>
            ))
          }
          </a>
        </ul>
      );
    }
    return (
      <PageHeaderLayout title="ユーザー詳細情報">
        <Card style={{ marginBottom: 24 }} title="ユーザー情報" bordered={false} >
          <DescriptionList size="large" title="ユーザー情報" style={{ marginBottom: 32 }}>
            <Description term="利用者氏名">曲丽丽</Description>
            <Description term="生年月日">1987-09-20</Description>
            <Description term="性別">女</Description>
            <Description term="電話番号">1234567893215</Description>
            <Description term="住所">东京都江戸川区江戸川（1～3丁目、4丁目1～14番）</Description>
          </DescriptionList>
        </Card>
        <Card bodyStyle={{ padding: 0 }} bordered={false} title="" >
         <Tabs>         
          {/*スケジュール*/}
          <TabPane tab="スケジュール" key="assessment">
            <Card title="" style={{ marginBottom: 24 }} bordered={false}>
              <Button type="primary" icon="plus" onClick={() => this.handleModalVisible1(true)} >新規</Button>
              <br/><br/>
                <Calendar
                  dateCellRender={dateCellRender}
                  monthCellRender={monthCellRender}
                  />
            </Card>      
        　</TabPane>
            {/*計画書*/}
            <TabPane tab="計画書" key="plan">
            <Card title="" style={{ marginBottom: 24 }} bordered={false}>
              <Link to="/form/advanced-form" >
                <Button type="primary" icon="plus">新規</Button>
              </Link>
              <br/><br/>
                <Steps direction="vertical" >
                  <Step title="2018-07-01" description='藤野和宏  第六次生成計画書。 -- 藤野和宏、冈本柊人' icon={<Link to="/profile/plan-show" ><Icon type="edit" /></Link>}/>
                  <Step title="2018-04-01" description='藤野和宏  第五次生成計画書。 -- 藤野和宏、冈本柊人' icon={<Link to="/dashboard/monitor" ><Icon type="edit" /></Link>}/>
                  <Step title="2018-01-01" description='藤野和宏  第四次生成計画書。 -- 藤野和宏、冈本柊人' icon={<Link to="/dashboard/monitor" ><Icon type="edit" /></Link>}/>
                  <Step title="2017-09-01" description='第三次生成計画書。 -- 藤野和宏、冈本柊人' icon={<Link to="/dashboard/monitor" ><Icon type="edit" /></Link>}/>                
                  <Step title="2017-06-01" description='第二次生成計画書。 -- 冈本柊人' icon={<Link to="/dashboard/monitor" ><Icon type="edit" /></Link>}/>
                  <Step title="2017-03-01" description='計画書が初めて作成する。 -- 藤野和宏、冈本柊人' icon={<Link to="/dashboard/monitor" ><Icon type="edit" /></Link>}/>
                </Steps>
            </Card>
            </TabPane>
            {/*画像*/}
            <TabPane tab="画像" key="record">
            <Card title="" style={{ marginBottom: 24 }} bordered={false}>
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Card>  
            </TabPane>
          </Tabs>
        </Card>
        <CreateForm1 {...parentMethods1} modalVisible1={modalVisible1} />
      </PageHeaderLayout>
    );
  }
}
