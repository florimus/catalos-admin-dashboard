import FormCard from '@/components/common/FormCard';
import { Table, TableCell, TableRow } from '@/components/ui/table';
import { FC } from 'react';
import {
  FormFields,
  FormFieldType,
  IDisplayFieldProps,
  IDropDownFormFieldProps,
  IMultiSelectFormFieldProps,
  ISwitchFieldProps,
  ITextFormFieldProps,
} from './DefaultFormFields';

interface GridFormInputsProps {
  heading?: string;
  cta?: {
    label: string;
    loading?: boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gridFields: any[];
}

const GridFormInputs: FC<GridFormInputsProps> = ({
  heading,
  cta,
  gridFields,
}) => {
  return (
    <FormCard
      title={heading || 'Default Inputs'}
      ctaLabel={cta?.label}
      loading={cta?.loading}
      onSubmit={cta?.onSubmit}
    >
      <Table>
        {Array.isArray(gridFields) ? (
          gridFields?.map((fields, index) => (
            <TableRow key={`key_grid-row-${index}_`}>
              {Array.isArray(fields) &&
                fields.map((field) => (
                  <TableCell key={field.name}>
                    {field.fieldType === FormFieldType.Text ? (
                      <FormFields.TextFormField
                        key={field.name}
                        {...(field as unknown as ITextFormFieldProps)}
                      />
                    ) : field.fieldType === FormFieldType.MultiSelect ? (
                      <FormFields.MultiSelectFormField
                        key={field.name}
                        {...(field as unknown as IMultiSelectFormFieldProps)}
                      />
                    ) : field.fieldType === FormFieldType.DropDown ? (
                      <FormFields.DropDownFormField
                        key={field.name}
                        {...(field as unknown as IDropDownFormFieldProps)}
                      />
                    ) : field.fieldType === FormFieldType.Display ? (
                      <FormFields.DisplayField
                        key={field.name}
                        {...(field as unknown as IDisplayFieldProps)}
                      />
                    ) : field.fieldType === FormFieldType.Switch ? (
                      <FormFields.SwitchField
                        key={field.name}
                        {...(field as unknown as ISwitchFieldProps)}
                      />
                    ) : null}
                  </TableCell>
                ))}
            </TableRow>
          ))
        ) : (
          <></>
        )}
      </Table>
    </FormCard>
  );
};

export default GridFormInputs;
