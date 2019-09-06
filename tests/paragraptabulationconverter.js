import VirtualTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/virtualtesteditor';
import testUtils from '@ckeditor/ckeditor5-core/tests/_utils/utils';
import { getData as getViewData } from '@ckeditor/ckeditor5-engine/src/dev-utils/view';
import { getData as getModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import ParagraphTabulationConverter from './../src/paragraphtabulationconverter';
import { getRoundedValue } from './../src/utils';

describe( 'ParagraphTabulationConverter', () => {
	let editor, doc;

	testUtils.createSinonSandbox();

	afterEach( () => {
		if ( editor ) {
			return editor.destroy();
		}
	} );

	describe( 'conversion', () => {
		beforeEach( () => {
			return VirtualTestEditor
				.create( {
					plugins: [ Paragraph, ParagraphTabulationConverter ],
				} )
				.then( newEditor => {
					editor = newEditor;
					doc = editor.model;
				} );
		} );

		it( 'defines plugin name', () => {
			expect( ParagraphTabulationConverter.pluginName ).to.equal( 'ParagraphTabulationConverter' );
		} );

		it( 'should set proper schema rules', () => {
			expect( doc.schema.checkAttribute( [ 'cktab' ], 'tabulation' ) ).to.be.true;
		} );

		it( 'should not convert to cktab if span not empty', () => {
			const data = '<p><span style="width:50px;">foo</span>bar</p>';
			editor.setData( data );

			expect( getModelData( doc ) ).to.not.equal( '<paragraph>[]<cktab>foo</cktab>bar</paragraph>' );
			expect( getModelData( doc ) ).to.equal( '<paragraph>[]foobar</paragraph>' );
		} );

		it( 'should not convert to cktab if span empty and has not width in style', () => {
			const data = '<p><span style="font-size: 14px">&nbsp;</span>foo</p>';
			editor.setData( data );

			expect( getModelData( doc ) ).to.not.equal( '<paragraph>[]<cktab></cktab>foo</paragraph>' );
			expect( getModelData( doc ) ).to.equal( '<paragraph>[]foo</paragraph>' );
		} );

		it( 'should convert to cktab if span empty and has width in style', () => {
			const data = '<p><span style="width:50px;">&nbsp;</span>foo</p>';
			editor.setData( data );

			expect( getModelData( doc ) ).to.equal( '<paragraph>[]<cktab tabulation="50"></cktab>foo</paragraph>' );
		} );

		it( 'should convert to cktab if span empty and has width in style and convert pt to px value', () => {
			const data = '<p><span style="width:50px;">&nbsp;</span>foo</p>';
			editor.setData( data );

			expect( getModelData( doc ) )
				.to.equal( `<paragraph>[]<cktab tabulation="${ getRoundedValue( '50px' ) }"></cktab>foo</paragraph>` );
		} );

		it( 'should convert width in px on empty span and add display:inline-block to style attribute', () => {
			const data = '<p><span style="width:50px;">&nbsp;</span>foo</p>';
			const expectedData = '<p><span style="display:inline-block;width:50px;">&nbsp;</span>foo</p>';
			const expectedViewData = '<p><span style="display:inline-block;width:50px"></span>foo</p>';

			editor.setData( data );

			expect( editor.getData() ).to.equal( expectedData );
			expect( getViewData( editor.editing.view, { withoutSelection: true } ) )
				.to.equal( expectedViewData );
		} );

		it( 'should convert width form pt to px on empty span and add display:inline-block to style attribute', () => {
			const data = '<p><span style="width:50pt;">&nbsp;</span>foo</p>';
			const expectedData = `<p><span style="display:inline-block;width:${ getRoundedValue( '50pt' ) }px;">&nbsp;</span>foo</p>`;
			const expectedViewData = `<p><span style="display:inline-block;width:${ getRoundedValue( '50pt' ) }px"></span>foo</p>`;

			editor.setData( data );

			expect( editor.getData() ).to.equal( expectedData );
			expect( getViewData( editor.editing.view, { withoutSelection: true } ) )
				.to.equal( expectedViewData );
		} );
	} );
} );
