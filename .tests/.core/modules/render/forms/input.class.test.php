<?php

	/**
	 * Class Input Test
	 */
	class HC_Input_Test extends PHPUnit_Framework_TestCase {

		// @todo: HC_Input_Test Test

		public function testInput()
		{

			$this->assertEquals(class_exists('HC_Input'), true);
		}

		/**
		 * @depends testInput
		 */
		public function testInputCreation()
		{

			$this->assertNotEmpty(new HC_Input());
		}

		/**
		 * @depends testInputCreation
		 */
		public function testInputHTML()
		{

			$input     = new HC_Input(['name'       => 'inputName',
			                           'value'      => 'inputValue',
			                           'class'      => 'inputClass',
			                           'onclick'    => 'alert("Input clicked");',
			                           'disabled'   => true,
			                           'required'   => true,
			                           'autofocus'  => true,
			                           'style'      => 'color: red;',
			                           'readonly'   => true,
			                           'maxlength'  => 255,
			                           'pattern'    => '^\w+$',
			                           'spellcheck' => true,
			                           'type'       => 'text',
			                           'append' => '<p>Append Input</p>',
			                           'prepend' => '<p>Prepend Input</p>']);
			$inputHTML = $input->render();
			$this->assertContains('<input', $inputHTML, 'Input did not contain <input,:' . $inputHTML);
			// Check for prepend
			$this->assertStringStartsWith('<p>Prepend Input</p>', $inputHTML, 'Checkbox did not contain prepend');

			// Check for append
			$this->assertStringEndsWith('<p>Append Input</p>', $inputHTML, 'Checkbox did not contain append');
			Assert::HTMLValidate($inputHTML);
		}
	}
