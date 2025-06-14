import { FC } from 'react';
import Input from '../input/InputField';
import Label from '../Label';
import Select from '../Select';
import { ChevronDownIcon, TimeIcon } from '@/icons';
import DatePicker from '../date-picker';
import { DateOption } from 'flatpickr/dist/types/options';
import MultiSelect, { Option } from '../MultiSelect';

export interface ITextFormFieldProps {
  name: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

export const TextFormField: FC<ITextFormFieldProps> = ({
  label,
  name,
  onChange,
  value,
  id,
  hint,
  disabled,
  error = false,
  placeholder = '',
  required = false,
}) => {
  console.log({ name, value, onChange });
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type='text'
        name={name}
        id={id || name}
        onChange={onChange}
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        error={error}
        hint={hint}
      />
    </div>
  );
};

export interface IDisplayFieldProps {
  label: string;
  value: string;
  id?: string;
  hint?: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  onClick?: () => void;
}

export const DisplayField: FC<IDisplayFieldProps> = ({
  label,
  value,
  id,
  hint,
  name,
  onClick,
  disabled = false,
  placeholder = '',
  required = false,
}) => {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type='text'
        name={name}
        id={id || name}
        value={value}
        onChange={() => {}}
        onClick={onClick}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        hint={hint}
      />
    </div>
  );
};

export interface IDropDownFormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}

export const DropDownFormField: FC<IDropDownFormFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  options,
  defaultValue,
  placeholder = 'Select an option',
  onChange,
}) => {
  return (
    <div>
      <Label>{label}</Label>
      <div className='relative'>
        <Select
          options={options}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onChange}
          className='dark:bg-dark-900'
          name={name}
          required={required}
          disabled={disabled}
        />
        <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
};

export interface IDatePickerFormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultDate?: DateOption;
  mode?: 'single' | 'multiple' | 'range' | 'time';
  onChange: ({}: { dates: Date[]; currentDateString: string }) => void;
}

export const DatePickerFormField: FC<IDatePickerFormFieldProps> = ({
  name,
  mode = 'single',
  label,
  defaultDate,
  placeholder,
  required = false,
  disabled = false,
  onChange,
}) => {
  return (
    <div>
      <DatePicker
        id={name}
        mode={mode}
        required={required}
        disabled={disabled}
        label={label}
        placeholder={placeholder}
        defaultDate={defaultDate}
        onChange={(dates, currentDateString) => {
          onChange({ dates, currentDateString });
        }}
      />
    </div>
  );
};

export interface ITimepickerProps {
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export const TimePicker: FC<ITimepickerProps> = ({
  id,
  label,
  name,
  placeholder,
  onChange,
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      <Label htmlFor='tm'>{label}</Label>
      <div className='relative'>
        <Input
          type='time'
          id={id}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          name={name}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
          <TimeIcon />
        </span>
      </div>
    </div>
  );
};

export interface IMultiSelectFormFieldProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

export const MultiSelectFormField: FC<IMultiSelectFormFieldProps> = ({
  label,
  options,
  defaultSelected,
  onChange,
  disabled = false,
}) => {
  return (
    <div className='relative'>
      <MultiSelect
        label={label}
        options={options}
        defaultSelected={defaultSelected}
        onChange={(values) => onChange(values)}
        disabled={disabled}
      />
      {/* <p className='sr-only'>Selected Values: {selectedValues.join(', ')}</p> */}
    </div>
  );
};

export enum FormFieldType {
  Text = 'text',
  DropDown = 'dropdown',
  DatePicker = 'datepicker',
  TimePicker = 'timepicker',
  MultiSelect = 'multiselect',
  Display = 'display',
}

export const FormFields = {
  TextFormField,
  DropDownFormField,
  DatePickerFormField,
  TimePicker,
  MultiSelectFormField,
  DisplayField,
};
