import React, { useEffect, useState } from 'react'
import { Card, Table, Tag, Tooltip, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from "assets/data/user-list.data.json";
import UserService from 'services/UserService';
import { useSelector, useDispatch } from 'react-redux';
import { setUsers } from 'store/slices/userSlice';

const UserList = () => {
    const { user } = useSelector(state => state.auth)
    const { users } = useSelector(state => state.user)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useDispatch()

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // state = {

    //     selectedUser: null
    // }

    // const deleteUser = (userId) => {
    //     this.setState({
    //         users: this.state.users.filter(item => item.id !== userId),
    //     })
    //     message.success({ content: `Deleted user ${userId}`, duration: 2 });
    // }

    const getUsers = async () => {
        const res = await UserService.getUsersByAdmin(user.id)
        if (res) {
            dispatch(setUsers(res))
        }
    }

    console.log(users)

    useEffect(() => {
        if (user) {
            getUsers()
        }
    }, [user])

    // const tableColumns = [
    //     {
    //         title: 'User',
    //         dataIndex: 'name',
    //         render: (_, record) => (
    //             <div className="d-flex">
    //                 <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
    //             </div>
    //         ),
    //         sorter: {
    //             compare: (a, b) => {
    //                 a = a.name.toLowerCase();
    //                 b = b.name.toLowerCase();
    //                 return a > b ? -1 : b > a ? 1 : 0;
    //             },
    //         },
    //     },
    //     {
    //         title: 'Role',
    //         dataIndex: 'role',
    //         sorter: {
    //             compare: (a, b) => a.role.length - b.role.length,
    //         },
    //     },
    //     {
    //         title: 'Last online',
    //         dataIndex: 'lastOnline',
    //         render: date => (
    //             <span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>
    //         ),
    //         sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix()
    //     },
    //     {
    //         title: 'Status',
    //         dataIndex: 'status',
    //         render: status => (
    //             <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>{status}</Tag>
    //         ),
    //         sorter: {
    //             compare: (a, b) => a.status.length - b.status.length,
    //         },
    //     },
    //     {
    //         title: '',
    //         dataIndex: 'actions',
    //         render: (_, elm) => (
    //             <div className="text-right d-flex justify-content-end">
    //                 <Tooltip title="View">
    //                     <Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => { /*this.showUserProfile(elm)*/ }} size="small" />
    //                 </Tooltip>
    //                 <Tooltip title="Delete">
    //                     <Button danger icon={<DeleteOutlined />} onClick={() => { /*this.deleteUser(elm.id)*/ }} size="small" />
    //                 </Tooltip>
    //             </div>
    //         )
    //     }
    // ];
    return (
        <>
            <Button type="primary" onClick={showModal}>
                Add User
            </Button>
            <Card bodyStyle={{ 'padding': '0px' }}>
                <div className="table-responsive">
                    {/* <Table columns={tableColumns} dataSource={users} rowKey='id' /> */}
                </div>
            </Card>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    )
}

export default UserList
