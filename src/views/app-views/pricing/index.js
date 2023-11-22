import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Card, Grid, Button, Badge, notification, message } from 'antd';
import { pricingData } from './pricingData';
import utils from 'utils'
import SubscriptionService from 'services/SubscriptionService';
import { useDispatch, useSelector } from 'react-redux';
import { setSubscription } from 'store/slices/subscriptionSlice';

const { useBreakpoint } = Grid;

const Pricing = () => {
	const { subscription } = useSelector(state => state.subscription)
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
	const colCount = pricingData.length

	const getSubscription = async () => {
		const res = await SubscriptionService.getSubscription();
		if (res) {
			dispatch(setSubscription(res))
		}
	}

	const subscribe = async (plan) => {
		setIsLoading(true);
		if (plan === 'Pro') {
			if (subscription === null || subscription && subscription.customer_id === null) {
				notification.warning({ message: `You don't have any payment method yet` })
			} else {
				const res = await SubscriptionService.subscribe({ plan: 'Pro' });
				if (res) {
					getSubscription()
					message.success({ content: 'Your subscription has been successfully updated.', duration: 2.5 })
				}
			}
		} else {
			const res = await SubscriptionService.subscribe({ plan: 'Free' });
			if (res) {
				getSubscription()
				message.success({ content: 'Your subscription has been successfully updated.', duration: 2.5 })
			}
		}
		setIsLoading(false);
	}

	const currentPlan = useMemo(() => {
		if (subscription) {
			if (subscription.subscription_id) {
				return 'Pro'
			} else return 'Free'
		} return 'Free'
	}, [subscription])

	useEffect(() => {
		getSubscription()
	}, [])

	return (
		<Card>
			<div className="container">
				<div className="text-center mb-4">
					<h2 className="font-weight-semibold">Pick a base plan</h2>
					<Row type="flex" justify="center">
						<Col sm={24} md={12} lg={8}>
							<p>
								{/* Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission. */}
							</p>
						</Col>
					</Row>
				</div>
				<Row>
					{
						pricingData.map((elm, i) => {
							return (
								<Col key={`price-column-${i}`} xs={24} sm={24} md={24 / colCount} lg={24 / colCount} className={colCount === (i + 1) || isMobile ? '' : 'border-right'}>
									<div className="p-3">
										<div className="text-center">
											<img className="img-fluid" src={elm.image} alt="" />
											<h1 className="display-4 mt-4">
												<span className="font-size-md d-inline-block mr-1" style={{ transform: 'translate(0px, -17px)' }}>R$</span>
												<span>{elm.price}</span>
											</h1>
											<p className="mb-0">{elm.duration}</p>
										</div>
										<div className="mt-4">
											<h2 className="text-center font-weight-semibold">{elm.plan}</h2>
										</div>
										<div className="d-flex justify-content-center mt-3">
											<div>
												{
													elm.features.map((elm, i) => {
														return (
															<p key={`pricing-feature-${i}`}>
																<Badge color={'blue'} />
																<span>{elm}</span>
															</p>
														)
													})
												}
											</div>
										</div>
										<div className="mt-3 text-center">
											<Button type="default" loading={isLoading && currentPlan !== elm.plan} onClick={() => subscribe(elm.plan)} disabled={currentPlan === elm.plan ? true : false}>{currentPlan === elm.plan ? 'Current Plan' : 'Get Started'}</Button>
										</div>
									</div>
								</Col>
							)
						})
					}
				</Row>
			</div>
		</Card>
	)
}

export default Pricing

