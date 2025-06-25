'use client';

import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { useEffect, useState } from 'react';
import Button from '../ui/button/Button';
import { PencilIcon } from '@/icons';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import EmptySection from '../example/EmptySection';
import SecureComponent from '@/core/authentication/SecureComponent';

interface ModuleViewProps {
  projectData: string;
  moduleId: string;
}

const ModuleView: React.FC<ModuleViewProps> = ({ projectData, moduleId }) => {
  const [html, setHtml] = useState<string>('');
  const [css, setCss] = useState<string>('');

  const router = useRouter();
  const { start } = useGlobalLoader();

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

  const handleEditClick = () => {
    localStorage.setItem('gjsProject', projectData || '{}');
    start(() => router.push(`/canvas/${moduleId}`));
  };

  useEffect(() => {
    editor.loadProjectData(projectData ? JSON.parse(projectData) : {});
    setHtml(editor.getHtml());
    setCss(scopeCss(editor.getCss() || ''));
  }, [editor, projectData]);

  return (
    <div className='rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-5'>
      <div className='px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sm:px-8'>
        <h3 className='text-base font-medium text-gray-800 dark:text-white/90'>
          Custom Module
        </h3>
        <SecureComponent permission='MOD:NN'>
          <Button size='xm' type='button' onClick={handleEditClick}>
            <PencilIcon /> {projectData ? 'Edit' : 'Create'}
          </Button>
        </SecureComponent>
      </div>
      {projectData ? (
        <div className='bg-gray-100 module-scope'>
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
