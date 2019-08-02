import Plugin from '@ckeditor/ckeditor/ckeditor5-core/src/plugin';

export default class ParagraphTabulationConverter extends Plugin {
	static get pluginName() {
		return 'ParagraphTabulationConverter';
	}

	static upcastTabulation() {
		return dispatcher => {
			dispatcher.on( 'element:p', ( evt, data, conversionApi ) => {
				const { consumable, writer } = conversionApi;
				const { modelRange, viewItem } = data;

				if ( !consumable.consume( viewItem, { style: 'margin-left' } ) || !modelRange ) {
					return;
				}

				let tabulationLevel = 0;
				let defaultMarginLeftPointValue = 0;

				for ( const child of viewItem.getChildren() ) {
					if ( !child.getStyle ) {
						continue;
					}

					const width = child.getStyle( 'width' );

					if ( !width ) {
						continue;
					}

					defaultMarginLeftPointValue = parseFloat( width.replace( 'pt', '' ) );

					tabulationLevel++;
				}

				const tabulationBlockValue = tabulationLevel * defaultMarginLeftPointValue;

				writer.setAttribute( 'tabulationBlock', `${ tabulationBlockValue }pt`, modelRange );
			} );
		};
	}

	init() {
		const editor = this.editor;

		editor.conversion.for( 'upcast' ).add( this.constructor.upcastTabulation() );
	}
}
