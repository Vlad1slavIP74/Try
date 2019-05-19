// @flow
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {IntlProvider, defineMessages, addLocaleData} from 'react-intl'
import Helmet from 'react-helmet'
import {APPLICATION_INIT} from 'actions/common'
import {ThemeProvider} from 'styled-components'
import theme from 'styles/theme'
import RoutingWrapper from 'components/RoutingWrapper'
import App from 'containers/App'

const Router = process.env.BROWSER
	? require('react-router-redux').ConnectedRouter
	: require('react-router').StaticRouter

class Root extends Component {
	static defaultProps = {
		SSR: {}
	}

	componentWillMount () {
		const {store, i18n} = this.props
		const {asyncBootstrapPhase} = this.context
		if (!asyncBootstrapPhase) {
			store.dispatch({type: APPLICATION_INIT})
			addLocaleData(i18n.localeData)
		}
	}

	render () {
		if (this.context.asyncBootstrapPhase) {
			return null
		}
		const {SSR, store, history, i18n} = this.props
		const routerProps = process.env.BROWSER ? {history} : {location: SSR.location, context: SSR.context}

		return (
			<IntlProvider locale={i18n.locale} messages={defineMessages(i18n.messages)}>
				{/* key={Math.random()} = hack for HMR
					From https://github.com/webpack/webpack-dev-server/issues/395
				*/}
				<Provider store={store} key={Date.now()}>
					<ThemeProvider theme={theme}>
						<Router {...routerProps}>
							<App>
								<Helmet>
									<html lang={i18n.lang} />
									<meta charSet="utf-8" />
									<title>Альфакаста - все ставки с коэффициентом от 1.9</title>
									<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
									<meta
										name="description"
										content="Ставки против других пользователей на спорт, киберспорт, акции, криптовалюту, события"
									/>
									<meta name="theme-color" content="#1b1e2f" />
									<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
									<base href="/" />

									<meta name="msapplication-tap-highlight" content="no" />

									<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext" rel="stylesheet"/>

									<link rel="manifest" href="manifest.json" />
									<noscript
										dangerouslySetInnerHTML={{
											__html: `You are using outdated browser. You can install modern browser here:
										<a href="http://outdatedbrowser.com/">http://outdatedbrowser.com</a>.`
										}}
									/>

									{/* Yandex verification */}
									<meta name="yandex-verification" content="89e48c967f8758a0" />

									{/* Google verification */}
									<meta name="google-site-verification" content="OSWzWeqmWs0lsbI15lSthZX8gVivCiI1PdvTndpS1gA" />
									<script type="text/javascript" >
									  {`  (function (d, w, c) {
									        (w[c] = w[c] || []).push(function() {
									            try {
									                w.yaCounter49626475 = new Ya.Metrika2({
									                    id:49626475,
									                    clickmap:true,
									                    trackLinks:true,
									                    accurateTrackBounce:true,
									                    webvisor:true
									                });
									            } catch(e) { }
									        });

									        var n = d.getElementsByTagName("script")[0],
									            s = d.createElement("script"),
									            f = function () { n.parentNode.insertBefore(s, n); };
									        s.type = "text/javascript";
									        s.async = true;
									        s.src = "https://mc.yandex.ru/metrika/tag.js";

									        if (w.opera == "[object Opera]") {
									            d.addEventListener("DOMContentLoaded", f, false);
									        } else { f(); }
									    })(document, window, "yandex_metrika_callbacks2");
									  `}
									</script>
									<noscript>{`<div><img src="https://d31j93rd8oukbv.cloudfront.net/metrika/watch_ua.js" style={{ position: 'absolute', left: '-9999px;' }} alt="" /></div>`}</noscript>

									{/* Global site tag (gtag.js) - Google Analytics */}
									<script async src="https://www.googletagmanager.com/gtag/js?id=UA-123083769-1"></script>
									<script>
									  {`window.dataLayer = window.dataLayer || [];
									  function gtag(){dataLayer.push(arguments);}
									  gtag('js', new Date());

									  gtag('config', 'UA-123083769-1');`}
									</script>

								</Helmet>
								<RoutingWrapper />
							</App>
						</Router>
					</ThemeProvider>
				</Provider>
			</IntlProvider>
		)
	}
}

export default Root
