'use client';

import DefaultInputs from '../form/form-elements/DefaultInputs';

const CreateProductForm = () => {
  const handleSave = () => {
    console.log('Form submitted');
  };

  return (
    <div  className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
      <div className='grid col-span-1 xl:col-span-2'>
        <DefaultInputs
          cta={{
            label: 'Save Product',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleSave();
            },
          }}
          heading='Product Form'
          fields={[]}
        />
      </div>
    </div>
  );
};

export default CreateProductForm;
