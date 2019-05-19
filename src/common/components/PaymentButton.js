import React, {Component} from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import scriptLoader from 'react-async-script-loader'
import LightButton from 'common/components/LightButton'

class PaymentButton extends Component {
	render () {
		const { dark, label, onClick, u_id, pay_amount, pay_currency,
			 payment_desc, ik_suc_u, ik_ia_u, ik_ia_m } = this.props

		return (
			<div>
				<Form action="https://sci.interkassa.com/" target="_blank" name="payment" acceptCharset="UTF-8">
					<input type="hidden" name="ik_co_id" value="5b69d0363c1eaf1e228b4567"/>
					<input type="hidden" name="ik_pm_no" value={u_id + (new Date()).getTime()}/>
					<input type="hidden" name="ik_am" value={pay_amount}/>
					<input type="hidden" name="ik_cur" value={pay_currency}/>
					<input type="hidden" name="ik_desc" value={payment_desc}/>
					<input type="hidden" name="ik_suc_u" value={ik_suc_u}/>
					<input type="hidden" name="ik_ia_u" value={ik_ia_u}/>
					<input type="hidden" name="ik_ia_m" value={ik_ia_m}/>

					<LightButton onClick={onClick} dark={dark}>{label}</LightButton>
				</Form>
			</div>
		)
	}
}

export default PaymentButton
