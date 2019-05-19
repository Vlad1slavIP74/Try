import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import ComponentMaxWidth from 'common/components/ComponentMaxWidth'
import ComponentMinHeight from 'common/components/ComponentMinHeight'
import MarginComponent from 'common/components/MarginComponent'

const Title = styled.h1`
  ${props => props.dark && 'color: #fff;'}
  font-size: 28px;
`
const Question = styled.h2`
  ${props => props.dark && 'color: #fff;'}
  font-size: 24px;
`
const Answer = styled.p`
  ${props => props.dark && 'color: #9299a2;'}
  font-size: 16px;
`

const FAQ = ({ layout, history, location }) => {
	const { darkMode } = layout

	const TitleWithColorMode = (props) => <Title dark={darkMode} {...props} />
	const QuestionWithColorMode = (props) => <Question dark={darkMode} {...props}/>
	const AnswerWithColorMode = (props) => <Answer dark={darkMode} {...props}/>

	return (
		<ComponentMinHeight height={500}>
			<ComponentMaxWidth>
  			<MarginComponent margin='30px 0px 80px 0px'>
  				<TitleWithColorMode>Часто задаваемые вопросы</TitleWithColorMode>

  				<QuestionWithColorMode>Что такое Alfakasta?</QuestionWithColorMode>
  				<AnswerWithColorMode>Альфакаста - это социальная платформа для ставок абсолютно на все: от спорта, киберспорта до курса акций на фондовом рынке, криптовалюты и разного рода событий. Это площадка на которой вы можете зарабатывать на своих прогнозах, заключить пари со своими друзьями/коллегами, и играть по высоким коэффициентам.</AnswerWithColorMode>

  				<QuestionWithColorMode>Как работает сервис?</QuestionWithColorMode>
  				<AnswerWithColorMode>Все ставки создаются исключительно игроками, самостоятельно. Коефициент выиграша 1.9 независимо от типа ставки. Чтобы ставка стала активной, в ней должны принять участия два игрока. Выигрыш начисляется победителю по факту наступления даты события, на которое было сделано ставку. </AnswerWithColorMode>

  				<QuestionWithColorMode>Я могу делать ставки если мне нет 18 лет?</QuestionWithColorMode>
  				<AnswerWithColorMode>Нет. Согласно правилам сервиса, а также в соответствии с законодательством большинства стран, делать ставки могут лица, достигшие 18 лет. При регистрации вы подтверждаете, что ваш возраст больше 18 лет. В случае, если у нас будут подозрения или информация о том, что вам нет 18 лет, ваш аккаунт будет заблокирован до достижения совершеннолетия или до предоставления доказательств достижения совершеннолетия.</AnswerWithColorMode>

  				<QuestionWithColorMode>Могу ли я использовать несколько аккаунтов?</QuestionWithColorMode>
  				<AnswerWithColorMode>Нет. Согласно правилам сервиса, вы можете создать и использовать только один аккаунт. В случае, если вы зарегистрировали несколько аккаунтов - все ваши аккаунты будут закрыты. Мы не гарантируем возврат средств или вывод выигрышей в случае мультиаккаунтинга.</AnswerWithColorMode>

  				<QuestionWithColorMode>Могу ли я использовать карточку друга или родственника для депозита?</QuestionWithColorMode>
  				<AnswerWithColorMode>Нет. Согласно правилам сервиса, вы можете сделать депозит только с личного аккаунта или карточки, которая выпущена на ваше имя. В случае, если вы сделали депозит с карточки друга или родственника, ваши ставки, выигрыши и бонусы будут отменены, а депозит возвращен за вычетом банковских расходов.</AnswerWithColorMode>

  				<QuestionWithColorMode>В какой валюте принимаются ставки?</QuestionWithColorMode>
  				<AnswerWithColorMode>В настоящий момент все ставки принимаются исключительно в (₴) грн. Мы работаем над тем, чтобы разширить диапазон валют. </AnswerWithColorMode>

  				<QuestionWithColorMode>Почему так мало опций для вывода?</QuestionWithColorMode>
  				<AnswerWithColorMode>Согласно общепринятой политике по борьбе с отмыванием денег, вывод средств производится только на тот платежный метод, который был использован для депозита. Другие опции вывода появятся в списке тогда, когда вы сделаете депозит через этот платежный метод.</AnswerWithColorMode>

  				<QuestionWithColorMode>Почему вывод средств задерживается?</QuestionWithColorMode>
  				<AnswerWithColorMode>После запроса на вывод он проверяется нашей командой. Эта проверка обычно совершается в тот же день, но иногда может занять до 72х часов. В случае возникновения каких-либо вопросов мы связываемся с пользователем.</AnswerWithColorMode>

  				<QuestionWithColorMode>Нужно ли загружать свои документы?</QuestionWithColorMode>
  				<AnswerWithColorMode>В соответствии с законодательством и правилами платежных систем, для вывода средств вам нужно предоставить документы, подтверждающие личность (фотография паспорта или ID карты). Фотография документа должна быть не старше 6 месяцев. В случае депозита через банковскую карту необходимо предоставить и ее фотографию, на которой должны быть видны первые 6 и последние 4 цифры, а остальные можно закрыть.</AnswerWithColorMode>

  				<QuestionWithColorMode>Могу ли я вывести деньги на Mastercard?</QuestionWithColorMode>
  				<AnswerWithColorMode>К сожалению, Mastercard обычно не позволяет проводить вывод на карточки этой системы из букмекерских сервисов. В случае депозита через карту MasterCard, мы предлагаем другие методы вывода: Skrill, QIWI, Yandex.Money, Neteller.</AnswerWithColorMode>

  				<QuestionWithColorMode>Какие комиссии на вывод?</QuestionWithColorMode>
  				<AnswerWithColorMode>Мы не взимаем комиссий с наших пользователей.</AnswerWithColorMode>

  				<QuestionWithColorMode>Уже известен результат ставки, а деньги на счет до сих пор не зачислились, что делать?</QuestionWithColorMode>
  				<AnswerWithColorMode>Все ставки обрабатываются командой трейдеров, вручную, и это занимает время. Среднее вреия рассмотрения ставки 30 мин. В случае, если через час после завершения события выигрыш все еще не зачислен, обратитесь, пожалуйста, в службу поддержки через чат.</AnswerWithColorMode>

  				<QuestionWithColorMode>Я сделал депозит картой Maestro, деньги списались с карты, но не пришли на мой счет, помогите.</QuestionWithColorMode>
  				<AnswerWithColorMode>Система Maestro отправляет информацию об успешном платеже не мгновенно, как другие, а через несколько дней. В таких случаях мы просим Вас обратиться в чат поддержки (в нижнем правом углу экрана) и назвать данные о платеже: первые 6 и последние 4 цифры номера карты, сумму транзакции и дату транзакции, и деньги зачислим вручную.</AnswerWithColorMode>
  			</MarginComponent>
			</ComponentMaxWidth>
		</ComponentMinHeight>
	)
}

const mapStateToProps = ({ layout }) => ({
	layout
})

export default connect(mapStateToProps, null)(FAQ)
