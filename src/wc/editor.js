import Editor from '../Editor.js';

const SHADOW_ROOT= Symbol( 'SHADOW_ROOT', );
const EDITOR= Symbol( 'EDITOR', );

class ScriptEditorElement extends HTMLElement
{
	connectedCallback()
	{
		this[SHADOW_ROOT]= this.attachShadow( { mode:'open', }, );
		// Waiting for children
		setTimeout( ()=> {
			
			this[EDITOR]= new Editor( this, this[SHADOW_ROOT], );
			
			this[EDITOR].addListeners( document, );
			
			this.tabIndex= this.getAttribute( 'tabindex', )||0;
			
			this.hasAttribute( 'autofocus', ) && this.focus();
		}, );
	}
	
	disconnectedCallback()
	{
		this[EDITOR].removeListeners();
	}
	
	focus()
	{
		this[EDITOR].focus();
	}
	
	blur()
	{
		this[EDITOR].blur();
	}
}

customElements.define( 'se-editor', ScriptEditorElement, { extends:'textarea', } );
