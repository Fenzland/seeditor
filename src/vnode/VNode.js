const DOM_MAP= Symbol( 'DOM_MAP', );

export default class VNode
{
	render()
	{
		const dom= this.makeDOM();
		
		VNode[DOM_MAP].set( this, dom, );
		
		return dom;
	}
}

VNode[DOM_MAP]= new WeakMap;
