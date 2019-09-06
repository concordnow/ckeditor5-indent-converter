import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { getRoundedValue } from './utils';

export default class ParagraphTabulationConverter extends Plugin {
	static get pluginName() {
		return 'ParagraphTabulationConverter';
	}

	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const conversion = editor.conversion;

		schema.register( 'cktab', {
			allowWhere: '$text',
			isInline: true,
			isObject: true,
			allowAttributes: [ 'tabulation' ]
		} );

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				styles: {
					'width': /[\s\S]+/
				}
			},
			model: ( viewElement, modelWriter ) => {
				if ( !viewElement.isEmpty ) {
					return;
				}
				const tabulation = getRoundedValue( viewElement.getStyle( 'width' ) );
				return modelWriter.createElement( 'cktab', { tabulation } );
			}
		} );

		conversion.for( 'downcast' ).elementToElement( {
			model: 'cktab',
			view: ( modelElement, viewWriter ) => {
				const tabulationValue = modelElement.getAttribute( 'tabulation' );

				return viewWriter.createContainerElement( 'span', {
					style: 'display: inline-block; width:' + tabulationValue + 'px'
				} );
			}
		} );
	}
}
