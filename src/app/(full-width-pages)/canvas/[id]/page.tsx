'use client';

import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { IUploadedImage, uploadImage } from '@/utils/imageUtils';
import Button from '@/components/ui/button/Button';
import { useParams, useRouter } from 'next/navigation';
import { updateModule } from '@/actions/module';

const GrapesEditor = () => {
  const router = useRouter();
  const params = useParams();

  const editorRef = useRef<HTMLDivElement>(null);

  const [html, setHtml] = useState<string>('');
  const [css, setCss] = useState<string>('');

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = grapesjs.init({
      container: editorRef.current,
      height: '90vh',
      width: 'auto',
      fromElement: false,
      storageManager: {
        type: 'local',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
        id: 'my-custom-editor',
      },
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
        ],
      },

      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px' },
          { name: 'Mobile', width: '390px' },
        ],
      },

      assetManager: {
        uploadFile: async (e: DragEvent) => {
          const target = e.target as HTMLInputElement;
          const file = target?.files?.[0];

          if (file) {
            const uploadedImage: IUploadedImage = await uploadImage(file);
            console.log(uploadedImage);
            editor.AssetManager.add({
              height: 'auto',
              src: uploadedImage.url,
              name: uploadedImage.name,
              type: 'image',
              unitDim: 'px',
              width: 'auto',
            });
          }
        },
      },

      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'container',
            label: 'Box',
            content: `
              <section class="container mx-auto">
                <section class="bg-blue-100">container</section>
              </section>
            `,
          },
          {
            id: '1-column',
            label: 'Single Column',
            content: `
              <section class="p-8 bg-transparent">
                <section class="bg-blue-100">session 1</section>
              </section>
            `,
          },
          {
            id: '2-columns',
            label: 'Double Column',
            content: `
              <session class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section class="bg-blue-100">session 1</section>
                <section class="bg-green-100">session 2</section>
              </session>
            `,
          },
          {
            id: '3-columns',
            label: 'Three Column',
            content: `
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-red-100 p-4">Col 1</div>
                <div class="bg-yellow-100 p-4">Col 2</div>
                <div class="bg-purple-100 p-4">Col 3</div>
              </div>
            `,
          },
          {
            id: 'text',
            label: 'Text Block',
            content: `
              <div>
                <h2 class="text-2xl bg-transparent font-semibold">Heading</h2>
                <p class="mt-2">This is a bg-transparent Tailwind-powered paragraph.</p>
              </div>
            `,
          },
          {
            id: 'image',
            label: 'Image',
            content: `
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                <img class="rounded shadow-md" src="https://via.placeholder.com/300x150" alt="Placeholder"/>
              </a>
            `,
          },
          {
            id: 'h-spacer',
            label: 'Spacer',
            content: `
              <div class="inline-block w-full h-10px bg-transparent"></div>
            `,
          },
          {
            id: 'heading-list',
            label: 'Heading List',
            content: `
              <section class="p-4">
                <h2 class="text-2xl font-bold mb-2">Section Heading</h2>
                <ul class="list-disc pl-5 space-y-1 text-base text-gray-700">
                  <li>Bullet point one</li>
                  <li>Bullet point two</li>
                  <li>Bullet point three</li>
                </ul>
              </section>
            `,
            category: 'Basic',
          },
        ],
      },
    });

    editor.on('component:create', (component) => {
      const cid =
        component.getId?.() || Math.random().toString(36).substr(2, 6);
      const className = `cmp-${cid}`;
      component.addClass(className);
    });

    editor.DomComponents.addType('custom-button', {
      model: {
        defaults: {
          tagName: 'a',
          attributes: {
            class:
              'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-block',
            href: 'https://example.com',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          content: 'Click Me',
          traits: [
            {
              type: 'text',
              label: 'Button Text',
              name: 'content',
              changeProp: true,
            },
            {
              type: 'text',
              label: 'Link URL',
              name: 'href',
              placeholder: 'https://example.com',
            },
            {
              type: 'checkbox',
              label: 'Open in new tab',
              name: 'target',
              valueTrue: '_blank',
              valueFalse: '_self',
            },
            {
              type: 'color',
              label: 'Background Color',
              name: 'bgColor',
              default: '#2563eb', // Tailwind blue-600
              changeProp: true,
            },
            {
              type: 'color',
              label: 'Text Color',
              name: 'textColor',
              default: '#ffffff',
              changeProp: true,
            },
          ],
          // This ensures the text updates live
          script: function () {
            this.innerHTML =
              this.el.getAttribute('data-content') || this.el.innerHTML;
          },
          'script-props': ['content'],
        },
      },
      view: {
        onRender({ el }) {
          const model = this.model;
          const content = model.get('content');
          const bgColor = model.get('bgColor') || '#2563eb';
          const textColor = model.get('textColor') || '#ffffff';

          el.innerHTML = content || 'Click Me';
          el.setAttribute(
            'style',
            `
            text-align: center;
            background-color: ${bgColor};
            color: ${textColor};
            font-weight: 600;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            display: inline-block;
            transition: all 0.2s ease;
          `
          );
        },
      },
    });

    editor.BlockManager.add('custom-button', {
      label: `
        <div class="flex flex-col items-center text-sm text-center">
          <span>Button</span>
        </div>
      `,
      category: 'Basic',
      content: {
        type: 'custom-button',
      },
    });

    return () => {
      editor.destroy();
    };
  }, []);

  const editor = grapesjs.init({
    container: document.createElement('div'),
    storageManager: false,
  });

  const handleGetCode = () => {
    if (!editorRef.current) return;
    const projectData = localStorage.getItem('gjsProject');
    editor.loadProjectData(projectData ? JSON.parse(projectData) : {});
    setHtml(editor.getHtml());
    setCss(editor.getCss() || '');
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    const projectData = localStorage.getItem('gjsProject');
    if (projectData) {
      const response =await updateModule({
        resourceId: params.id as string,
        data: projectData || '{}',
        active: true,
      });
      if (response.success) {
        localStorage.removeItem('gjsProject');
        router.back();
      }
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex'>
        <div
          id='blocks'
          className='w-64 p-4 border-r border-gray-300 overflow-y-auto'
          style={{ backgroundColor: '#f9f9f9' }}
        />
        <div ref={editorRef} className='flex-1' />
      </div>
      <div className='flex justify-end'>
        <Button
          onClick={handleGetCode}
          className='bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 mx-2'
        >
          Preview
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>

      <div className='bg-gray-100'>
        <style>{css}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default GrapesEditor;
