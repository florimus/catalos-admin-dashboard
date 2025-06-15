import Accordion from '@/components/common/Accordion';
import ButtonCard from '@/components/common/ButtonCard';
import FormInModal from '@/components/modals/FormInModal';
import { useModal } from '@/hooks/useModal';
import { FC, useState } from 'react';
import Input from '../input/InputField';
import Label from '../Label';
import Radio from '../input/Radio';
import { ATTRIBUTE_TYPES } from '@/core/constants';
import { formatSlug } from '@/utils/stringUtils';
import {
  IAttributeListItem,
  IAttributeOption,
} from '@/core/types';

interface AttributeFormInputsProps {
  heading?: string;
  cta?: {
    label: string;
    loading?: boolean;
    onSubmit?: () => void;
  };
  allAttributes: IAttributeListItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAllAttributes: any;
}

const AttributeFormInputs: FC<AttributeFormInputsProps> = ({
  heading,
  cta,
  allAttributes,
  setAllAttributes,
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  const [attribute, setAttribute] = useState<{ name: string; type: string }>({
    name: '',
    type: 'Text',
  });

  const handleEditAttribute = (key: string, name: string) => {
    setAllAttributes((prev: IAttributeListItem[]) =>
      prev.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            key: name,
          };
        }
        return item;
      })
    );
  };

  const handleEditAttributeType = (
    key: string,
    type: 'Text' | 'Select' | 'Number' | 'Boolean'
  ) => {
    setAllAttributes((prev: IAttributeListItem[]) =>
      prev.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            type,
          };
        }
        return item;
      })
    );
  };

  const attributeToContentMapper = (
    key: string,
    selectedType: 'Select' | 'Number' | 'Boolean' | 'Text',
    options: IAttributeOption[] | null
  ) => {
    console.log(options);
    
    return (
      <>
        <div className='my-3'>
          <Label>Attribute Name</Label>
          <Input
            type='text'
            placeholder='slilicana..'
            name='productTypeId'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleEditAttribute(key, e.target.value);
            }}
            value={key}
            required
          />
        </div>
        <Label>Type</Label>
        <div className='my-3 flex gap-3'>
          {ATTRIBUTE_TYPES.map((type) => (
            <Radio
              key={type}
              id={`type_editor_${key}_${type}`}
              name={`type_editor_${key}_${type}`}
              value={type}
              checked={selectedType === type}
              onChange={(newType) =>
                handleEditAttributeType(
                  key,
                  newType as 'Text' | 'Select' | 'Number' | 'Boolean'
                )
              }
              label={type}
            />
          ))}
        </div>
      </>
    );
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttribute((prev) => ({
      ...prev,
      name: formatSlug(e.target.value),
    }));
  };

  const handleTypeChange = (type: string) => {
    console.log({ type });
    
    setAttribute((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleSave = () => {
    setAllAttributes((prev: IAttributeListItem[]) => [
      ...prev,
      {
        key: attribute.name,
        type: attribute.type as 'Text' | 'Select' | 'Number' | 'Boolean',
        options: null,
        value: '' as string | number | boolean | IAttributeOption,
      },
    ]);
    setAttribute({ name: '', type: 'Text' });
    closeModal();
  };

  return (
    <>
      <ButtonCard
        title={heading || 'Default Inputs'}
        ctaLabel={cta?.label}
        loading={cta?.loading}
        onSubmit={openModal}
      >
        {allAttributes.map((item, index) => (
          <Accordion
            key={index}
            title={item.key}
            content={attributeToContentMapper(
              item.key,
              item?.type,
              item?.options
            )}
          />
        ))}
      </ButtonCard>
      {isOpen && (
        <FormInModal
          title='Add New Product Type'
          isOpen={isOpen}
          closeModal={closeModal}
          hasSaveButton={true}
          hasCloseButton={true}
          saveButtonText='Create'
          handleSave={handleSave}
        >
          <div className='my-3'>
            <Label>Attribute Name</Label>
            <Input
              type='text'
              placeholder='slilicana..'
              name='productTypeId'
              onChange={handleTextChange}
              value={attribute.name}
              required
            />
          </div>
          <div className='my-3'>
            <Label>Type</Label>
            {ATTRIBUTE_TYPES.map((type) => (
              <Radio
                key={type}
                id={`model_type_${type}`}
                name={`model_type_${type}`}
                value={type}
                checked={attribute.type === type}
                onChange={handleTypeChange}
                label={type}
              />
            ))}
          </div>
        </FormInModal>
      )}
    </>
  );
};

export default AttributeFormInputs;
