import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UserService from 'services/UserService';
import { useSelector, useDispatch } from 'react-redux';
import { setUsers } from 'store/slices/userSlice';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const ProductList = () => {
    
}

export default ProductList
