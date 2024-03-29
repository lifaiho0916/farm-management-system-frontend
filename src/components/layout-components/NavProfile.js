import React from 'react';
import { Dropdown, Avatar, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { signOutSuccess } from 'store/slices/authSlice';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import styled from '@emotion/styled';
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER, FONT_SIZES } from 'constants/ThemeConstant'

const Icon = styled.div(() => ({
    fontSize: FONT_SIZES.LG
}))

const Profile = styled.div(() => ({
    display: 'flex',
    alignItems: 'center'
}))

const UserInfo = styled('div')`
	padding-left: ${SPACER[2]};

	@media ${MEDIA_QUERIES.MOBILE} {
		display: none
	}
`

const Name = styled.div(() => ({
    fontWeight: FONT_WEIGHT.SEMIBOLD
}))

const Title = styled.span(() => ({
    opacity: 0.8
}))

const MenuItem = (props) => (
	<Flex as="a" href={props.path} alignItems="center" gap={SPACER[2]}>
		<Icon>{props.icon}</Icon>
		<span>{props.label}</span>
	</Flex>
)

const MenuItemSignOut = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        notification.info({ message: 'See you again!' })
        navigate('/auth/login')
    }

    return (
        <div onClick={handleSignOut}>
            <Flex alignItems="center" gap={SPACER[3]}>
                <Icon>
                    <LogoutOutlined />
                </Icon>
                <span>{props.label}</span>
            </Flex>
        </div>
    )
}

const items = [
    {
		key: 'Account Setting',
		label: <MenuItem path="/app/setting" label="Account Setting" icon={<SettingOutlined />} />,
	},
    {
        key: 'Sign Out',
        label: <MenuItemSignOut label="Sign Out" />,
    }
]

export const NavProfile = ({ mode }) => {
    const { user } = useSelector((state) => state.auth)

    return (
        <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
            <NavItem mode={mode}>
                <Profile>
                    <Avatar icon={<UserOutlined />} />
                    <UserInfo className="profile-text">
                        <Name>{user ? user.name : ''}</Name>
                        <Title>{user ? user.username : ''}</Title>
                    </UserInfo>
                </Profile>
            </NavItem>
        </Dropdown>
    );
}

export default NavProfile
