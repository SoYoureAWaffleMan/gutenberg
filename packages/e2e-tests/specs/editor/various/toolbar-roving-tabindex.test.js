/**
 * WordPress dependencies
 */
import {
	createNewPost,
	pressKeyWithModifier,
	insertBlock,
} from '@wordpress/e2e-test-utils';

async function focusBlockToolbar() {
	await pressKeyWithModifier( 'alt', 'F10' );
}

async function expectLabelToHaveFocus( label ) {
	await expect(
		await page.evaluate( () =>
			document.activeElement.getAttribute( 'aria-label' )
		)
	).toBe( label );
}

async function testBlockToolbarKeyboardNavigation( currentBlockLabel ) {
	await focusBlockToolbar();
	await expectLabelToHaveFocus( 'Change block type or style' );
	await page.keyboard.press( 'ArrowRight' );
	await expectLabelToHaveFocus( 'Move up' );
	await page.keyboard.press( 'Tab' );
	await expectLabelToHaveFocus( currentBlockLabel );
	await pressKeyWithModifier( 'shift', 'Tab' );
	await expectLabelToHaveFocus( 'Move up' );
}

describe( 'Toolbar roving tabindex', () => {
	beforeEach( async () => {
		await createNewPost();
		await insertBlock( 'Paragraph' );
		await page.keyboard.type( 'First block' );
	} );

	it( 'ensures paragraph block toolbar uses roving tabindex', async () => {
		await insertBlock( 'Paragraph' );
		await page.keyboard.type( 'Paragraph' );
		await testBlockToolbarKeyboardNavigation( 'Paragraph block' );
	} );

	it( 'ensures heading block toolbar uses roving tabindex', async () => {
		await insertBlock( 'Heading' );
		await page.keyboard.type( 'Heading' );
		await testBlockToolbarKeyboardNavigation( 'Block: Heading' );
	} );

	it( 'ensures list block toolbar uses roving tabindex', async () => {
		await insertBlock( 'List' );
		await page.keyboard.type( 'List' );
		await testBlockToolbarKeyboardNavigation( 'Block: List' );
	} );

	it( 'ensures image block toolbar uses roving tabindex', async () => {
		await insertBlock( 'Image' );
		await testBlockToolbarKeyboardNavigation( 'Block: Image' );
	} );

	it( 'ensures table block toolbar uses roving tabindex', async () => {
		await insertBlock( 'Table' );
		await testBlockToolbarKeyboardNavigation( 'Block: Table' );
		// Move focus to the first toolbar item
		await page.keyboard.press( 'Home' );
		await expectLabelToHaveFocus( 'Change block type or style' );
		await page.click( '.blocks-table__placeholder-button' );
		await testBlockToolbarKeyboardNavigation( 'Block: Table' );
	} );

	it( 'ensures custom html block toolbar uses roving tabindex', async () => {
		await insertBlock( 'Custom HTML' );
		await testBlockToolbarKeyboardNavigation( 'Block: Custom HTML' );
	} );
} );
