import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import CategoryService from 'services/CategoryService';
import { useSelector, useDispatch } from 'react-redux';
import { setCategories } from 'store/slices/categorySlice';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const CategoryList = () => {
    const { user } = useSelector(state => state.auth)
    const { categories } = useSelector(state => state.category)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null)

    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const AddBtnClick = () => {
        setSelectedCategory(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedCategory(categories.filter(category => category.id === id)[0])
        setIsModalOpen(true);
        setMode(false);
    }

    const DeleteBtnClick = (id) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete?',
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const res = await CategoryService.deleteCategory(id);
                        if (res) {
                            message.success({ content: 'Category deleted successfully', duration: 2.5 });
                            const filtered = categories.filter((category) => category.id !== id);
                            dispatch(setCategories(filtered));
                            resolve();
                        } else {
                            reject();
                        }
                    } catch (error) {
                        console.log('Oops errors!');
                        reject();
                    }
                });
            },
        });
    }

    const AddCategory = async (values) => {
        setIsLoading(true)
        const res = await CategoryService.createCategory(values);
        if (res) {
            message.success({ content: "Category created successfully", duration: 2.5 });
            dispatch(setCategories([...categories, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditCategory = async (values) => {
        setIsLoading(true)
        const res = await CategoryService.updateCategory(selectedCategory.id, values);
        if (res) {
            message.success({ content: "Category updated successfully", duration: 2.5 });
            const updatedCategories = categories.map((category) => {
                if (category.id === selectedCategory.id) return res;
                else return category
            })
            dispatch(setCategories(updatedCategories))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const getCategories = async () => {
        dispatch(setCategories([]))
        const res = await CategoryService.getAllCategory()
        if (res) {
            dispatch(setCategories(res))
        }
    }


    useEffect(() => {
        if (user) {
            getCategories()
        }
    }, [user])

    const tableColumns = [
        {
            title: 'No',
            render: (_, elm, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'Category',
            dataIndex: 'description',
            render: description => (
                <span>{description}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.description.toLowerCase();
                    b = b.description.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-right d-flex justify-content-end">
                    <Tooltip title="Edit">
                        <Button className="mr-2" icon={<EditOutlined />} onClick={() => EditBtnClick(elm.id)} size="small" />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button icon={<DeleteOutlined />} onClick={() => DeleteBtnClick(elm.id)} size="small" />
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <>
            <Card bodyStyle={{ 'padding': '10px' }}>
                <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                    Add Category
                </Button>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={categories} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Category' : 'Edit Category'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddCategory : EditCategory}
                    >
                        <Form.Item
                            label="Category"
                            name="description"
                            rules={[{ required: true, message: 'Please input category' }]}
                            initialValue={selectedCategory?.description}
                        >
                            <Input defaultValue={selectedCategory?.description} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </>
    )
    
}

export default CategoryList