import React, { Component } from 'react'
import { Card, Table, Tag, Tooltip, message, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from "assets/data/user-list.data.json";

export class FarmList extends Component {

    state = {
        users: userData,
        userProfileVisible: false,
        selectedUser: null
    }

    deleteUser = userId => {
        this.setState({
            users: this.state.users.filter(item => item.id !== userId),
        })
        message.success({ content: `Deleted user ${userId}`, duration: 2 });
    }

    render() {
        const { users } = this.state;

        const tableColumns = [
            {
                title: 'User',
                dataIndex: 'name',
                render: (_, record) => (
                    <div className="d-flex">
                        <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
                    </div>
                ),
                sorter: {
                    compare: (a, b) => {
                        a = a.name.toLowerCase();
                        b = b.name.toLowerCase();
                        return a > b ? -1 : b > a ? 1 : 0;
                    },
                },
            },
            {
                title: 'Role',
                dataIndex: 'role',
                sorter: {
                    compare: (a, b) => a.role.length - b.role.length,
                },
            },
            {
                title: 'Last online',
                dataIndex: 'lastOnline',
                render: date => (
                    <span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>
                ),
                sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix()
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: status => (
                    <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>{status}</Tag>
                ),
                sorter: {
                    compare: (a, b) => a.status.length - b.status.length,
                },
            },
            {
                title: '',
                dataIndex: 'actions',
                render: (_, elm) => (
                    <div className="text-right d-flex justify-content-end">
                        <Tooltip title="View">
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Button danger icon={<DeleteOutlined />} onClick={() => { this.deleteUser(elm.id) }} size="small" />
                        </Tooltip>
                    </div>
                )
            }
        ];
        return (
            <Card bodyStyle={{ 'padding': '0px' }}>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={users} rowKey='id' />
                </div>
            </Card>
        )
    }
}

export default FarmList
