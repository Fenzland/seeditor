export default class KeyMap
{
	constructor( customization )
	{
		this.map= Object.assign( this.getDefault(), customization );
	}

	seek( key )
	{
		/* context */
		z(key);
		return this.map[key];
	}

	getDefault()
	{
		return {
			Tab_0: {
				command: 'input',
				args: [ '\t', ],
			},
			Enter_0: {
				command: 'input',
				args: [ '\n', ],
			},
			Backspace_0: {
				command: 'delete',
				args: { direction: -1, unit:'char', amount:1, },
			},
			ArrowLeft_0: {
				command: 'move',
				args: { axis: 'horizontal', direction: -1, unit:'char', amount:1, },
			},
			ArrowRight_0: {
				command: 'move',
				args: { axis: 'horizontal', direction: 1, unit:'char', amount:1, },
			},
			ArrowUp_0: {
				command: 'move',
				args: { axis: 'vertical', direction: -1, unit:'char', amount:1, },
			},
			ArrowDown_0: {
				command: 'move',
				args: { axis: 'vertical', direction: 1, unit:'char', amount:1, },
			},
		};
	}
}
