'use client';

import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { IUploadedImage, uploadImage } from '@/utils/imageUtils';
import Button from '@/components/ui/button/Button';
import { useParams, useRouter } from 'next/navigation';
import { updateModule } from '@/actions/module';
import { useModal } from '@/hooks/useModal';
import FormInModal from '@/components/modals/FormInModal';
import { FormFields } from '@/components/form/form-elements/DefaultFormFields';
import { CHANNELS } from '@/core/constants';
import { getTranslationLanguagesOptions } from '@/utils/translationUtils';

const GrapesEditor = () => {
  const router = useRouter();
  const params = useParams();

  const editorRef = useRef<HTMLDivElement>(null);

  const [html, setHtml] = useState<string>('');
  const [css, setCss] = useState<string>('');

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('EN');
  const [translations, setTranslations] = useState<Record<string, string>>();

  useEffect(() => {
    const initialTranslations = localStorage.getItem('gjsTranslations');
    if (initialTranslations) {
      setTranslations(JSON.parse(initialTranslations));
    }
  }, []);

  const channelTranslations = CHANNELS.map((channel) => channel.translations);

  const languageOptions = getTranslationLanguagesOptions(
    [...channelTranslations].flat()
  );

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
            label: 'Container',
            category: 'Layout',
            content: `
              <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-white shadow-md p-6 rounded-lg">
                  Content goes here
                </div>
              </section>
            `,
          },
          {
            id: '1-column',
            label: '1 Column',
            category: 'Layout',
            content: `
              <div class="grid grid-cols-1 gap-6">
                <div class="bg-gray-100 p-6 rounded-lg shadow">Column 1</div>
              </div>
            `,
          },
          {
            id: '2-columns',
            label: '2 Columns',
            category: 'Layout',
            content: `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-blue-100 p-6 rounded">Left Column</div>
                <div class="bg-green-100 p-6 rounded">Right Column</div>
              </div>
            `,
          },
          {
            id: '3-columns',
            label: '3 Columns',
            category: 'Layout',
            content: `
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-pink-100 p-4 rounded">Col 1</div>
                <div class="bg-yellow-100 p-4 rounded">Col 2</div>
                <div class="bg-purple-100 p-4 rounded">Col 3</div>
              </div>
            `,
          },
          {
            id: 'spacer-vertical',
            label: 'Vertical Spacer',
            category: 'Layout',
            content: `<div class="w-full h-8 bg-transparent transition-opacity"></div>`,
          },
          {
            id: 'spacer-horizontal',
            label: 'Horizontal Spacer',
            category: 'Layout',
            content: `<div class="h-full w-8 inline-block bg-transparent transition-opacity"></div>`,
          },
          {
            id: 'banner',
            label: 'Hero Banner',
            category: 'Marketing',
            content: `
              <section class="bg-cover bg-center text-white p-20 rounded" style="background-image: url('https://via.placeholder.com/1200x400');">
                <div class="bg-black bg-opacity-50 p-8 rounded">
                  <h1 class="text-4xl font-bold mb-4">Welcome to Our Store</h1>
                  <p class="mb-6">Discover amazing products curated just for you.</p>
                  <a href="#" class="bg-white text-black px-5 py-2 rounded font-medium">Shop Now</a>
                </div>
              </section>
            `,
          },
          {
            id: 'cta',
            label: 'Call to Action',
            category: 'Marketing',
            content: `
              <section class="bg-indigo-600 text-white p-8 rounded text-center">
                <h2 class="text-3xl font-bold mb-4">Join our newsletter</h2>
                <p class="mb-6">Stay updated with the latest news</p>
                <a href="#" class="bg-white text-indigo-600 px-6 py-2 rounded font-semibold hover:bg-gray-100">Subscribe</a>
              </section>
            `,
          },
          {
            id: 'text-image',
            label: 'Text + Image',
            category: 'Content',
            content: `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <img src="https://via.placeholder.com/500x300" alt="Image" class="rounded shadow-md" />
                <div>
                  <h2 class="text-2xl font-bold mb-2">About Us</h2>
                  <p class="text-gray-700">We provide high-quality services to elevate your brand and presence.</p>
                </div>
              </div>
            `,
          },
          {
            id: 'image-text',
            label: 'Image + Text',
            category: 'Content',
            content: `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 class="text-2xl font-bold mb-2">About Us</h2>
                  <p class="text-gray-700">We provide high-quality services to elevate your brand and presence.</p>
                </div>
                <img src="https://via.placeholder.com/500x300" alt="Image" class="rounded shadow-md" />
              </div>
            `,
          },
          {
            id: 'feature-list',
            label: 'Feature List',
            category: 'Content',
            content: `
              <section class="p-8 bg-white rounded">
                <h2 class="text-2xl font-bold mb-6 text-center">Our Features</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="p-4 bg-gray-100 rounded text-center">
                    <h3 class="font-semibold text-lg">Feature One</h3>
                    <p class="text-sm mt-2">Description of feature one.</p>
                  </div>
                  <div class="p-4 bg-gray-100 rounded text-center">
                    <h3 class="font-semibold text-lg">Feature Two</h3>
                    <p class="text-sm mt-2">Description of feature two.</p>
                  </div>
                  <div class="p-4 bg-gray-100 rounded text-center">
                    <h3 class="font-semibold text-lg">Feature Three</h3>
                    <p class="text-sm mt-2">Description of feature three.</p>
                  </div>
                </div>
              </section>
            `,
          },
          {
            id: 'footer',
            label: 'Footer',
            category: 'Footer',
            content: `
              <footer class="bg-gray-800 text-white p-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 class="font-semibold mb-2">Company</h4>
                    <ul class="text-sm space-y-1">
                      <li><a href="#" class="hover:underline">About</a></li>
                      <li><a href="#" class="hover:underline">Careers</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-2">Support</h4>
                    <ul class="text-sm space-y-1">
                      <li><a href="#" class="hover:underline">Contact</a></li>
                      <li><a href="#" class="hover:underline">FAQs</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-2">Follow Us</h4>
                    <ul class="text-sm space-y-1">
                      <li><a href="#" class="hover:underline">Twitter</a></li>
                      <li><a href="#" class="hover:underline">Instagram</a></li>
                    </ul>
                  </div>
                </div>
              </footer>
            `,
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

    return () => {
      editor.destroy();
    };
  }, []);

  let editor: Editor;
  try {
    editor = grapesjs.init({
      container: document?.createElement('div'),
      storageManager: false,
    });
  } catch {
    console.log("GrapesJS couldn't be initialized");
  }

  const translateModule = (data?: string | null, language?: string) => {
    if (!data) return;
    const translationData = JSON.parse(
      translations?.[language || selectedLanguage] || '{}'
    );

    Object.keys(translationData).forEach((key: string) => {
      data = data?.replace(`{{${key}}}`, translationData[key]);
    });

    return data;
  };

  const handleGetCode = (language?: string) => {
    if (!editorRef.current) return;
    const projectData = translateModule(
      localStorage.getItem('gjsProject'),
      language
    );
    editor.loadProjectData(projectData ? JSON.parse(projectData) : {});
    setHtml(editor.getHtml());
    setCss(editor.getCss() || '');
    closeModal();
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    const projectData = localStorage.getItem('gjsProject');
    if (projectData) {
      const response = await updateModule({
        resourceId: params.id as string,
        data: projectData || '{}',
        translations: translations || {},
        active: true,
      });
      if (response.success) {
        localStorage.removeItem('gjsProject');
        localStorage.removeItem('gjsTranslations');
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
        <div className='mr-2'>
          <FormFields.DropDownFormField
            key='translation-Language-direct'
            name='translation-Language-direct'
            onChange={(value) => {
              setSelectedLanguage(value);
              handleGetCode(value);
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
        </div>
        <Button variant='outline' className='mr-2' onClick={openModal}>
          Edit Translations
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>

      {isOpen && (
        <FormInModal
          title='Module Translations'
          isOpen={isOpen}
          closeModal={closeModal}
        >
          <FormFields.DropDownFormField
            label='Select Language'
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
          <FormFields.TextAreaFormField
            label='Translations'
            key='translation-textarea'
            name='translation-textarea'
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setTranslations((prev) => ({
                ...prev,
                [selectedLanguage]: e.target.value,
              }));
            }}
            value={translations?.[selectedLanguage] || '{}'}
            placeholder='{}'
            disabled={false}
            required
          />
          <div className='flex justify-end'>
            <Button variant='primary' onClick={() => handleGetCode()}>
              Preview
            </Button>
          </div>
        </FormInModal>
      )}

      <div className='bg-gray-100' dir={selectedLanguage === "AR" ? "rtl" : "ltr"}>
        <style>{css}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default GrapesEditor;
