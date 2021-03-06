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

const Ul = styled.ul`
  padding-left: 25px;
`

const Bold = styled.b``

const Privacy = ({ layout, history, location }) => {
	const { darkMode } = layout

	const TitleWithColorMode = (props) => <Title dark={darkMode} {...props} />
	const QuestionWithColorMode = (props) => <Question dark={darkMode} {...props}/>
	const AnswerWithColorMode = (props) => <Answer dark={darkMode} {...props}/>

	return (
		<ComponentMinHeight height={500}>
			<ComponentMaxWidth>
				<MarginComponent margin='30px 0px 80px 0px'>
					<TitleWithColorMode>Конфиденциальность</TitleWithColorMode>

					<QuestionWithColorMode>Политика конфиденциальности</QuestionWithColorMode>
					<AnswerWithColorMode>
						Настоящая Политика конфиденциальности описывает, каким образом Alfakasta (далее «Мы») использует информацию и данные, которые Вы предоставляете, чтобы мы могли управлять вашими отношениями с Alfakasta.<br/>
						Мы будем обрабатывать личную информацию, предоставленную Вами, с помощью веб-сайтаAlfakasta (далее «Сайт») или иным образом, в порядке, установленном в настоящей политике конфиденциальности. Отправляя нам информацию с помощью веб-сайта, Вы подтверждаете свое согласие на использование Ваших персональных данных, изложенных в настоящей политике конфиденциальности. Если вы не согласны с условиями настоящей политики конфиденциальности, пожалуйста, не используйте Сайт или предоставьте нам Вашу личную информацию иным образом.
					</AnswerWithColorMode>

					<QuestionWithColorMode>Сбор и использование информации</QuestionWithColorMode>
					<AnswerWithColorMode>
						<p>Информация и данные о Вас, которые мы можем собирать и использовать, включают в себя следующее:</p>
						<Ul>

							<li>  Информация, которую вы предоставляете нам при заполнении форм на сайте или любую другую информацию, которую Вы предоставляете нам через сайт или по электронной почте.</li>
							<li>  Переписка, будь то через веб-сайт, электронную почту, телефон или другие средства связи.</li>
							<li>  Детали проведенных Вами платежей, будь то с помощью веб-сайта, телефона или других средств.</li>
							<li>  Подробная информация о Ваших посещениях веб-сайта, включая данные о трафике, данные о местоположении, логине и другие данные.</li>
						</Ul>

						<p>Мы можем использовать Вашу личную информацию и данные вместе с другой информацией о Вас в целях:</p>
						<Ul>

							<li>  обработки ваших ставок, а также платежей с банковских карт и онлайн-платежей;</li>
							<li>  настройки и управления Вашим счетом;</li>
							<li>  проверки соответствия с законодательной базой;</li>
							<li>  проведения аналитических операций;</li>
							<li>  предоставления Вам информации о рекламных предложениях, наших продуктах и услугах, которыми Вы желаете воспользоваться, и мониторинга операций в целях предотвращения мошенничества, противоправных ставок, отмывания денег.</li>
						</Ul>
						<p>Вы можете отписаться от ненужной для Вас рассылки при помощи доступного функционала.</p>
					</AnswerWithColorMode>

					<QuestionWithColorMode>Разглашение информации</QuestionWithColorMode>
					<AnswerWithColorMode>
            Мы имеем право предоставлять информацию, которой мы располагаем, включая личные данные и историю ставок, в спортивные и иные органы, в том числе в полицию, в целях расследования случаев мошенничества и отмывания денег.
					</AnswerWithColorMode>

					<QuestionWithColorMode>Безопасность</QuestionWithColorMode>
					<AnswerWithColorMode>
            Мы предпринимаем все разумные шаги, как того требует закон, для обеспечения точной регистрации и надежной сохранности Вашей личной информации. Вся личная информация уничтожается, когда больше нет необходимости для ее хранения, или по требованию закона.
            Мы не гарантируем безопасность какой бы то ни было информации, передаваемой нам посредством Интернета. Вся информация передается на Ваш собственный риск. Однако после получения переданной информации, мы предпринимаем все разумные шаги по защите Вашей личной информации от ненадлежащего использования, потери или несанкционированного доступа.
					</AnswerWithColorMode>

					<QuestionWithColorMode>Изменения в политике конфиденциальности</QuestionWithColorMode>
					<AnswerWithColorMode>
            Любые будущие изменения в нашей Политике Конфиденциальности будут размещены на этой странице, и любые такие изменения вступают в силу с момента их публикации в пересмотренной Политике конфиденциальности.
					</AnswerWithColorMode>

					<QuestionWithColorMode>Политика компании по борьбе с отмыванием денег и международным терроризмом</QuestionWithColorMode>
					<AnswerWithColorMode>
            Компания Alfakasta осуществляет все должные меры по борьбе с отмыванием денег, полученных преступным путем, и борьбе с международным терроризмом (Политика AML). При этом, Компания поддерживает сильную и принципиальную позицию по предотвращению всякого рода незаконной деятельности, а также все связанные с ним нормативно-правовые акты. Для исполнения данных обязательств Компания обязана сообщить соответствующим официальным инстанциям, если имеются основания подозревать, что средства, внесенные Пользователем на счет, имеют отношение к деятельности по легализации доходов, полученных незаконным путем или финансированию терроризма. Компания также будет обязана заблокировать такие средства Пользователя, а также принять другие меры, предусмотренные правилами AML-политики.
            Отмывание средств означает:

						<li>  сокрытие или сохранение конфиденциальности в отношении информации о настоящем происхождении, источнике, местоположении, способах избавления от, перемещениях, правах собственности либо других правах на имущество, полученное в результате незаконной деятельности (или об имуществе, полученном взамен такого имущества),</li>
						<li>  конвертация, перемещение, получение, владение или использование имущества, полученного в результате преступной деятельности (или имущества, полученного взамен такого имущества) с целью сокрытия незаконного происхождения такого имущества или содействие лицам, принимающим участие в преступной деятельности, во избежание юридических последствий их действий,</li>
						<li>  ситуацию, в которой имущество было получено в результате преступной деятельности, совершавшейся на территории другого государства.</li>

						<p>В целях противодействия проникновению криминального капитала в экономику государства и противодействия распространению преступности, во многих странах ведется постоянная борьба с отмыванием денег и финансированием терроризма.</p>
						<p>Компания применяет внутренние нормативно-правовые акты и специальные программы мер, чтобы помочь государственным и международным организациям в борьбе с отмыванием денег и финансированием терроризма по всему миру.</p>

            Регистрируя счет в Компании, вы принимаете на себя следующие обязательства:

						<li>  Вы гарантируете, что будете следовать всем применимым законам и нормативно-правовым актам по противодействию отмыванию средств и финансированию терроризма, включая в том числе и Политике АМL.</li>
						<li>  Вы подтверждаете, что у вас нет информации либо подозрений, относительно того, что средства, использованные для пополнения счета в прошлом, настоящем или будущем, получены из незаконного источника или имеют какое-либо отношение к легализации доходов, полученных незаконным путем, или к другой противоправной деятельности, запрещенной действующим законодательством либо инструкциями любых международных организаций;</li>
						<li>  Вы также соглашаетесь немедленно предоставлять нам любую информацию, которую мы считаем необходимым запросить для соблюдения нами действующего законодательства и регулирующих требований в отношении противодействия легализации средств, полученных незаконным путем.</li>

            Компания собирает и хранит документы, удостоверяющие личность Пользователя, а также отчеты о всех совершенных на счете операциях;

            Компания отслеживает подозрительные операции на счете Пользователя, а также операции, осуществленные при особых условиях;

            Компания оставляет за собой право в любой момент времени и на любом этапе отказать Пользователю в осуществлении операции, если у Компании имеются основания полагать, что эта операция имеет какое-либо отношение к отмыванию денег и преступной деятельности. В соответствии с международным законодательством, Компания не обязана уведомлять Пользователя о том, что его деятельность является подозрительной, и информация о ней была передана в соответствующие государственные органы.

            В соответствии с внутренней AML-Политикой Компания проводит первичные и текущие проверки личности Пользователей компании в соответствии с уровнем потенциального риска, связанным с каждым Пользователем.

						<li>  Компания потребует Вас предоставить минимальные данные для удостоверения вашей личности.</li>
						<li>  Компания запишет и сохранит данные и документы, удостоверяющие Вашу личность, а также информацию о том, какие методы использовались для удостоверения личности и результаты проверок.</li>
						<li>  Компания проверит ваши личные данные на совпадения со списком лиц подозреваемых в терроризме, сформированным уполномоченным государственными и независимыми органами Минимальный набор идентификационных данных включает: - полное имя Пользователя; - дата рождения (для физических лиц); адрес проживания или адрес регистрации Пользователя; источник происхождения средств, которые планируется депонировать на счет компании.</li>

            Для проверки и подтверждения подлинности упомянутых выше данных, Компания может потребовать от Пользователя следующие документы:

						<li>  паспорт или идентификационная карта, или другой документ, заменяющий их, который отвечает следующим требованиям: содержит имя, дату рождения и фотографию владельца документа; был выдан национальными государственными органами,</li>
						<li>  недавно полученный счет об оплате коммунальных услуг (не старше 3-х месяцев) или другой документ, подтверждающий адрес проживания Пользователя.</li>

            Компания может также запрашивать иную дополнительную информацию, подтвержденную соответствующими документами. В определенных случаях, Компания может также запрашивать от Пользователя нотариально заверенные копии документов.
					</AnswerWithColorMode>

				</MarginComponent>
			</ComponentMaxWidth>
		</ComponentMinHeight>
	)
}

const mapStateToProps = ({ layout }) => ({
	layout
})

export default connect(mapStateToProps, null)(Privacy)
