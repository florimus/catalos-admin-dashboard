'use client';

import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { useCallback, useEffect, useState } from 'react';
import Button from '../ui/button/Button';
import { PencilIcon } from '@/icons';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import EmptySection from '../example/EmptySection';
import SecureComponent from '@/core/authentication/SecureComponent';
import { FormFields } from '../form/form-elements/DefaultFormFields';
import { CHANNELS } from '@/core/constants';
import { getTranslationLanguagesOptions } from '@/utils/translationUtils';

interface ModuleViewProps {
  projectData: string;
  moduleId: string;
  translations: Record<string, string>;
}

const ModuleView: React.FC<ModuleViewProps> = ({
  projectData,
  moduleId,
  translations,
}) => {
  const [html, setHtml] = useState<string>('');
  const [css, setCss] = useState<string>('');

  const router = useRouter();
  const { start } = useGlobalLoader();

  const channelTranslations = CHANNELS.map((channel) => channel.translations);

  const languageOptions = getTranslationLanguagesOptions(
    [...channelTranslations].flat()
  );

  const [selectedLanguage, setSelectedLanguage] = useState<string>('EN');

  const editor = grapesjs.init({
    container: document.createElement('div'),
    storageManager: false,
  });

  function scopeCss(css: string, scope: string = '.module-scope') {
    return css.replace(/(^|\})\s*([^{\}@]+)/g, (match, brace, selector) => {
      if (selector.startsWith('@')) return match;
      const scopedSelector = selector
        .split(',')
        .map((s: string) => `${scope} ${s.trim()}`)
        .join(', ');
      return `${brace} ${scopedSelector}`;
    });
  }

  const translateModule = useCallback(
    (data?: string) => {
      if (!data) return;

      const translationData = JSON.parse(
        translations?.[selectedLanguage] || '{}'
      );

      Object.keys(translationData).forEach((key: string) => {
        data = data?.replace(`{{${key}}}`, translationData[key]);
      });

      return data;
    },
    [translations, selectedLanguage]
  );

  const handleEditClick = () => {
    localStorage.setItem('gjsProject', projectData || '{}');
    localStorage.setItem('gjsTranslations', JSON.stringify(translations));
    start(() => router.push(`/canvas/${moduleId}`));
  };

  useEffect(() => {
    const translatedData = translateModule(projectData) || '{}';
    editor.loadProjectData(projectData ? JSON.parse(translatedData) : {});
    setHtml(editor.getHtml());
    setCss(scopeCss(editor.getCss() || ''));
  }, [editor, projectData, translateModule, translations, selectedLanguage]);

  return (
    <div className='rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-5'>
      <div className='px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sm:px-8'>
        <h3 className='text-base font-medium text-gray-800 dark:text-white/90'>
          Custom Module
        </h3>
        <div className='flex gap-2 items-center'>
          <FormFields.DropDownFormField
            key='translation-Language'
            name='translation-Language'
            onChange={(value) => {
              setSelectedLanguage(value);
            }}
            options={[
              { label: 'Default (English)', value: 'EN' },
              ...languageOptions,
            ]}
            defaultValue={selectedLanguage}
            placeholder='Select Language'
            disabled={false}
            required
          />
          <div>
            <SecureComponent permission='MOD:NN'>
              <Button
                size='sm'
                className='mt-2'
                type='button'
                onClick={handleEditClick}
              >
                <PencilIcon /> {projectData ? 'Edit' : 'Create'}
              </Button>
            </SecureComponent>
          </div>
        </div>
      </div>
      {projectData ? (
        <div
          className='bg-gray-100 module-scope'
          dir={selectedLanguage === 'AR' ? 'rtl' : 'ltr'}
        >
          <style>{css}</style>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      ) : (
        <EmptySection
          heading='No Module'
          description='No Module to view it here'
        />
      )}
    </div>
  );
};

export default ModuleView;
