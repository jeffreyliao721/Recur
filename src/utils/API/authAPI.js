import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

Amplify.configure({
	Auth: {
		userPoolId: 'us-west-2_1p8n3UkI5',
		userPoolWebClientId: '2osj5lfgdt5snt7mao4oqjt85c',
	}
})

export default Auth;
