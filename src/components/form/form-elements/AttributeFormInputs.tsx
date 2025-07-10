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
import { IAttributeListItem, IAttributeOption } from '@/core/types';
import Button from '@/components/ui/button/Button';
import { TrashBinIcon } from '@/icons';
import EmptySection from '@/components/example/EmptySection';

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
  disabled: boolean;
}

const AttributeFormInputs: FC<AttributeFormInputsProps> = ({
  heading,
  cta,
  allAttributes,
  setAllAttributes,
  disabled,
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

  const handleEditAttributeOption = (
    keyData: string,
    optionIndex: number,
    option: { keyValue?: string; value?: string }
  ) => {
    setAllAttributes((prev: IAttributeListItem[]) =>
      prev.map((item) => {
        if (item.key === keyData) {
          const newOptions = [...(item.options || [])];
          if (!newOptions[optionIndex]) {
            newOptions[optionIndex] = { label: '', value: '' };
          }
          if (option.keyValue) {
            newOptions[optionIndex].label = option.keyValue;
          }
          if (option.value) {
            newOptions[optionIndex].value = option.value;
          }
          return {
            ...item,
            options: newOptions,
          };
        }
        return item;
      })
    );
  };

  const handleAddEmptyAttributeOption = (key: string) => {
    setAllAttributes((prev: IAttributeListItem[]) =>
      prev.map((item) => {
        if (item.key === key) {
          const newOptions = [
            ...(item.options || []),
            { label: '', value: '' },
          ];
          return {
            ...item,
            options: newOptions,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteAttributeOption = (index: number) => {
    setAllAttributes((prev: IAttributeListItem[]) =>
      prev.map((item) => {
        if (item.options && item.options.length > index) {
          const newOptions = [...item.options];
          newOptions.splice(index, 1);
          return {
            ...item,
            options: newOptions,
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
    return (
      <>
        <div className='my-3'>
          <Label>Attribute Name</Label>
          <Input
            type='text'
            placeholder='slilicana..'
            name='productTypeId'
            disabled={disabled}
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
              disabled={disabled}
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
        {selectedType === 'Select' && (
          <div className='my-3'>
            <Label>Options</Label>
            {Array.isArray(options) && options.length ? (
              options.map((option, index) => (
                <div key={index + 1} className='grid grid-cols-13 gap-3 my-2'>
                  <div className='col-span-6'>
                    <Input
                      type='text'
                      placeholder='Key ..'
                      name={`${option.label}_${index}key`}
                      disabled={disabled}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleEditAttributeOption(key, index, {
                          keyValue: e.target.value,
                        })
                      }
                      value={option.label}
                      required
                    />
                  </div>
                  <div className='col-span-6'>
                    <Input
                      type='text'
                      placeholder='value..'
                      name={`${option.label}_${index}_value`}
                      disabled={disabled}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleEditAttributeOption(key, index, {
                          value: e.target.value,
                        })
                      }
                      value={option.value}
                      required
                    />
                  </div>
                  <div className='col-span-1'>
                    <Button
                      size='sm'
                      variant='outline'
                      type='button'
                      onClick={() => {
                        handleDeleteAttributeOption(index);
                      }}
                      disabled={disabled}
                    >
                      <TrashBinIcon />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptySection
                heading='No Options'
                description='Add options to your attribute'
              />
            )}
            <div>
              <Button
                size='xm'
                type='button'
                className='text-blue-500 hover:text-blue-600 my-2'
                onClick={() => {
                  handleAddEmptyAttributeOption(key);
                }}
                disabled={disabled}
              >
                Add Option
              </Button>
            </div>
          </div>
        )}
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
        ctaLabel={disabled ? '' : cta?.label}
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
