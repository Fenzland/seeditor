import Language from '../Language.js';

Language.define( 'text/plain', {
	contexts: {
		line: {
			header: /^/,
			footer: /\n/,
		},
		indent:{
			header: /^(?=\t)/,
			footer: /(?!\t)/,
		},
	},
	relation: {
		line: [ 'indent', ],
	},
} );
