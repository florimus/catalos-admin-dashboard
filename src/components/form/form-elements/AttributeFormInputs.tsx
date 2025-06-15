import Accordion from '@/components/common/Accordion';
import ButtonCard from '@/components/common/ButtonCard';
import { FC } from 'react';

interface AttributeFormInputsProps {
  heading?: string;
  cta?: {
    label: string;
    loading?: boolean;
    onSubmit: () => void;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
}

const AttributeFormInputs: FC<AttributeFormInputsProps> = ({
  heading,
  cta,
  fields,
}) => {
  return (
    <ButtonCard
      title={heading || 'Default Inputs'}
      ctaLabel={cta?.label}
      loading={cta?.loading}
      onSubmit={cta?.onSubmit}
    >
      <Accordion title='Color' content='text' />
    </ButtonCard>
  );
};

export default AttributeFormInputs;
