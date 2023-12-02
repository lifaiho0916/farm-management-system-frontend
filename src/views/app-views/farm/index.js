import React, { useEffect } from 'react'
import { Card } from 'antd';
import FarmService from 'services/FarmService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm } from 'store/slices/farmSlice';

const FarmList = () => {
    const { user } = useSelector(state => state.auth)
    const { farm } = useSelector(state => state.farm)

    const dispatch = useDispatch()

    const getFarm = async () => {
        dispatch(setFarm(null))
        const res = await FarmService.getFarmByUser()
        if (res) {
            dispatch(setFarm(res))
        }
    }

    useEffect(() => {
        if (user) {
            getFarm()
        }
    }, [user])

    console.log(farm)

    return (
        <>
            {farm ?
                <Card title="User Farm" style = {{ width: 300, marginBottom: 30 }}>
                    <h5>Description</h5>
                    <p className="mb-3">{farm.description}</p>
                    <h5>Address</h5>
                    <p className="mb-3">{farm.address}</p>
                    <h5>City/Town</h5>
                    <p className="mb-3">{farm.city}</p>
                    <h5>State</h5>
                    <p className="mb-3">{farm.state}</p>
                    <h5>Zipcode</h5>
                    <p className="mb-3">{farm.zipcode}</p>
                </Card>
                : null}
        </>
    )
}

export default FarmList
