import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/languages/cs.js';

import React, { forwardRef } from 'react';
import { Box } from '@chakra-ui/react';
import FroalaEditor from 'react-froala-wysiwyg';

import { FormField, type FormFieldBaseProps } from './FormField';

import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

export type ToolbarButtonsConfig = {
  buttons: string[];
  align?: string;
  buttonsVisible?: number;
};

export type FroalaEditorConfig = {
  placeholderText?: string;
  toolbarButtons?: {
    moreText?: ToolbarButtonsConfig;
    moreParagraph?: ToolbarButtonsConfig;
    moreRich?: ToolbarButtonsConfig;
    moreMisc?: ToolbarButtonsConfig;
  };
  heightMin?: number;
  language?: string;
  charCounterCount?: boolean;
  wordCounterCount?: boolean;
  [key: string]: unknown;
};

export type WysiwygFieldProps = FormFieldBaseProps<{
  config?: Partial<FroalaEditorConfig>;
}>;

export const WysiwygField = forwardRef((props: WysiwygFieldProps, ref) => {
  const { id, name, label, config, ...rest } = props;

  return (
    <FormField id={id} name={name} label={label} isRequired={rest.isRequired}>
      {({ value, onChange }) => (
        <Box bg="white" borderWidth="1px" borderRadius="md" p={4} shadow="sm">
          <FroalaEditor
            tag="textarea"
            model={value || ''}
            onModelChange={(content: string) => {
              onChange(content);
            }}
            config={{
              placeholderText: 'Napište svůj článek...',
              toolbarButtons: {
                moreText: {
                  buttons: [
                    'bold',
                    'italic',
                    'underline',
                    'strikeThrough',
                    'subscript',
                    'superscript',
                    'fontFamily',
                    'fontSize',
                    'textColor',
                    'backgroundColor',
                    'inlineClass',
                    'inlineStyle',
                    'clearFormatting',
                  ],
                },
                moreParagraph: {
                  buttons: [
                    'alignLeft',
                    'alignCenter',
                    'formatOLSimple',
                    'alignRight',
                    'alignJustify',
                    'formatOL',
                    'formatUL',
                    'paragraphFormat',
                    'paragraphStyle',
                    'lineHeight',
                    'outdent',
                    'indent',
                    'quote',
                  ],
                },
                moreRich: {
                  buttons: [
                    'insertLink',
                    'fontAwesome',
                    'specialCharacters',
                    'embedly',
                  ],
                },
                moreMisc: {
                  buttons: [
                    'undo',
                    'redo',
                    'fullscreen',
                    'print',
                    'spellChecker',
                    'selectAll',
                    'html',
                    'help',
                  ],
                  align: 'right',
                  buttonsVisible: 2,
                },
              },
              heightMin: 200,
              language: 'cs',
              charCounterCount: false,
              wordCounterCount: false,
              ...config,
            }}
            ref={ref as React.LegacyRef<FroalaEditor>}
          />
        </Box>
      )}
    </FormField>
  );
});
